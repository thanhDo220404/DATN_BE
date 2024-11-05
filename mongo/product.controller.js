//thực hiện thao tác CRUD với mongoBD
const mongoose = require("mongoose");
const productModel = require("./product.model");
const categoryModel = require("./category.model");
const colorModel = require("./color.model"); // Đường dẫn đến mô hình Color
const sizeModel = require("./size.model"); // Đường dẫn đến mô hình Size
const mediaModel = require("./media.model");

module.exports = {
  getAll,
  insert,
  getProductById,
  deleteProductById,
  updateProductById,
  searchProducts,
  increaseViewCount,
};

async function insert(body) {
  try {
    const { name, description, items, category } = body;

    const categoryFind = await categoryModel.findById(category);
    if (!categoryFind) {
      throw new Error("Không tìm thấy danh mục");
    }

    const itemsData = await Promise.all(
      items.map(async (item) => {
        const colorFind = await colorModel.findById(item.color);
        if (!colorFind) {
          throw new Error(`Không tìm thấy màu sắc với ID ${item.color}`);
        }

        // Lấy thông tin hình ảnh từ mediaModel
        const imageFind = await mediaModel.findById(item.image);
        if (!imageFind) {
          throw new Error(`Không tìm thấy hình ảnh với ID ${item.image}`);
        }

        const variationsData = await Promise.all(
          item.variations.map(async (variation) => {
            const sizeFind = await sizeModel.findById(variation.size);
            if (!sizeFind) {
              throw new Error(
                `Không tìm thấy kích thước với ID ${variation.size}`
              );
            }

            return {
              size: {
                _id: sizeFind._id,
                sizeName: sizeFind.name,
                sizeValue: sizeFind.value,
              },
              quantity: variation.quantity,
            };
          })
        );

        return {
          color: {
            _id: colorFind._id,
            colorName: colorFind.name,
            colorHexCode: colorFind.hexCode,
          },
          image: {
            _id: imageFind._id, // ID của hình ảnh
            mediaFilePath: imageFind.filePath, // Giả sử mediaModel có thuộc tính `filePath`
          },
          price: item.price,
          discount: item.discount,
          variations: variationsData,
        };
      })
    );

    const proNew = new productModel({
      name,
      description,
      category: {
        _id: categoryFind._id,
        categoryName: categoryFind.name,
      },
      items: itemsData,
    });

    const result = await proNew.save();
    return result;
  } catch (error) {
    console.log("Lỗi insert: ", error);
    throw error;
  }
}

async function getAll() {
  try {
    const result = await productModel.find();
    return result;
  } catch (error) {
    console.log("Loi lay danh sach san pham");
    throw error;
  }
}
async function getProductById(id) {
  try {
    const result = await productModel.findById(id);
    return result;
  } catch (error) {
    console.log("Lỗi lấy sản phẩm theo id:", error.message);
    throw error;
  }
}
async function updateProductById(id, body) {
  try {
    const { name, description, items, category } = body;

    // Kiểm tra xem danh mục có tồn tại không
    const categoryFind = await categoryModel.findById(category);
    if (!categoryFind) {
      throw new Error("Không tìm thấy danh mục");
    }

    // Cập nhật thông tin cho từng item
    const itemsData = await Promise.all(
      items.map(async (item) => {
        const colorFind = await colorModel.findById(item.color);
        if (!colorFind) {
          throw new Error(`Không tìm thấy màu sắc với ID ${item.color}`);
        }

        // Lấy thông tin hình ảnh từ mediaModel
        const imageFind = await mediaModel.findById(item.image);
        if (!imageFind) {
          throw new Error(`Không tìm thấy hình ảnh với ID ${item.image}`);
        }

        const variationsData = await Promise.all(
          item.variations.map(async (variation) => {
            const sizeFind = await sizeModel.findById(variation.size);
            if (!sizeFind) {
              throw new Error(
                `Không tìm thấy kích thước với ID ${variation.size}`
              );
            }

            return {
              _id: variation._id,
              size: {
                _id: sizeFind._id,
                sizeName: sizeFind.name,
                sizeValue: sizeFind.value,
              },
              quantity: variation.quantity,
            };
          })
        );

        return {
          _id: item._id,
          color: {
            _id: colorFind._id,
            colorName: colorFind.name,
            colorHexCode: colorFind.hexCode,
          },
          image: {
            _id: imageFind._id,
            mediaFilePath: imageFind.filePath,
          },
          price: item.price,
          discount: item.discount,
          variations: variationsData,
        };
      })
    );

    // Cập nhật sản phẩm
    const updatedProduct = await productModel.findByIdAndUpdate(
      id,
      {
        name,
        description,
        category: {
          _id: categoryFind._id,
          categoryName: categoryFind.name,
        },
        items: itemsData,
      },
      { new: true } // Trả về sản phẩm đã cập nhật và kiểm tra các validator
    );

    if (!updatedProduct) {
      throw new Error("Không tìm thấy sản phẩm để cập nhật.");
    }

    return updatedProduct;
  } catch (error) {
    console.log("Lỗi cập nhật sản phẩm:", error);
    throw error;
  }
}

// Xóa sản phẩm theo ID
async function deleteProductById(id) {
  try {
    const result = await productModel.findOneAndDelete({ _id: id });
    if (!result) {
      throw new Error("Không tìm thấy sản phẩm để xóa.");
    }
    return result;
  } catch (error) {
    console.log("Lỗi xóa sản phẩm:", error);
    throw error;
  }
}
async function getNewProduct() {
  try {
    const result = await productModel.find().sort({ createdAt: -1 }).limit(5);
    return result;
  } catch (error) {
    console.log("Loi lay danh sach san pham");
    throw error;
  }
}
//lay san pham theo key
async function getByKey(key, value) {
  try {
    const result = await productModel.findOne({ [key]: value });
    return result;
  } catch (error) {
    console.log("loi lay san pham theo key: ", error);
    throw error;
  }
}
//cap nhat san pham theo id
async function updateById(id, body) {
  try {
    const pro = await productModel.findById(id);
    if (!pro) {
      throw new Error("khong tim thay san pham");
    }
    const { name, price, quantity, image, description, category } = body;
    let categoryFind = null;
    if (category) {
      categoryFind = await categoryModel.findById(category);
      if (!categoryFind) {
        throw new Error("khong tim thay danh muc");
      }
    }
    const categoryUpdate = categoryFind
      ? {
          categoryId: categoryFind._id,
          categoryName: categoryFind.name,
        }
      : pro.category;
    const result = await productModel.findByIdAndUpdate(
      id,
      { name, price, quantity, image, description, category: categoryUpdate },
      { new: true }
    );
    return result;
  } catch (error) {
    console.log("Loi update", error);
    throw error;
  }
}
async function removeById(id) {
  try {
    // Sử dụng phương thức findOneAndDelete để tìm và xóa sản phẩm dựa trên ID
    const result = await productModel.findOneAndDelete({ _id: id });
    return result;
  } catch (error) {
    console.log("Loi delete", error);
    throw error;
  }
}

async function getProductsByIdCate(idCate, productId = null, limit = null) {
  try {
    // const query = { 'category.categoryId': idCate };
    const query = { categoryId: idCate };

    // Nếu có productId, thêm điều kiện lọc
    if (productId !== null) {
      query["_id"] = { $ne: productId };
    }

    let findQuery = productModel.find(query);

    // Nếu có giới hạn, áp dụng giới hạn
    if (limit !== null) {
      findQuery = findQuery.limit(limit);
    }

    // Sắp xếp theo createDate tăng dần
    findQuery = findQuery.sort({ createAt: 1 });

    const result = await findQuery.exec();
    return result;
  } catch (error) {
    console.log("Loi lay danh sach san pham");
    throw error;
  }
}
async function increaseViewCount(id) {
  try {
    const product = await productModel.findById(id);
    if (!product) {
      throw new Error("Sản phẩm không tồn tại");
    }

    // Tăng số lượt xem của sản phẩm
    product.view += 1;

    // Lưu sản phẩm đã được cập nhật vào cơ sở dữ liệu
    await product.save();

    return { success: true, message: "Số lượt xem của sản phẩm đã được tăng" };
  } catch (error) {
    console.error("Lỗi khi tăng số lượt xem của sản phẩm:", error.message);
    return {
      success: false,
      message: "Đã xảy ra lỗi khi tăng số lượt xem của sản phẩm",
    };
  }
}
async function getProductsByView(key, limit) {
  try {
    const result = await productModel.find({}).sort({ view: key }).limit(limit);
    return result;
  } catch (error) {
    console.log("Loi lay danh sach san pham");
    throw error;
  }
}
async function getProductsByPrice(key, limit) {
  try {
    const result = await productModel
      .find({})
      .sort({ price: key })
      .limit(limit);
    return result;
  } catch (error) {
    console.log("Loi lay danh sach san pham");
    throw error;
  }
}

async function paginateProducts(page, perPage) {
  try {
    const products = await productModel
      .find()
      .skip(perPage * page - perPage)
      .limit(perPage);
    const count = await productModel.countDocuments();

    const totalPages = Math.ceil(count / perPage);

    return {
      Products: products,
      currentPage: page,
      totalPages: totalPages,
    };
  } catch (err) {
    console.error("Lỗi khi lấy sản phẩm:", err);
    throw new Error("Đã xảy ra lỗi khi lấy sản phẩm");
  }
}
async function searchProducts(keyword) {
  try {
    const regex = new RegExp(keyword, "i");

    const criteria = {
      $or: [
        { name: { $regex: regex } }, // Tìm kiếm trong trường name
        { description: { $regex: regex } }, // Tìm kiếm trong trường description
        { "category.categoryName": { $regex: regex } }, // Tìm kiếm trong trường categoryName
      ],
    };

    const result = await productModel.find(criteria);
    return result;
  } catch (error) {
    console.log("Loi lay danh sach san pham");
    throw error;
  }
}
