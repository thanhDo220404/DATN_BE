const CategoryModel = require("./category.model"); // Đường dẫn đến mô hình Category

// Tạo danh mục mới
const insertCategory = async (categoryData) => {
  try {
    const { name, description, status, parent } = categoryData;

    // Tìm kiếm danh mục cha nếu có
    let parentCategory = null;
    if (parent) {
      parentCategory = await CategoryModel.findById(parent);
      if (!parentCategory) {
        throw new Error("Danh mục cha không tồn tại");
      }
    }

    // Tạo một danh mục mới
    const newCategory = new CategoryModel({
      name,
      description,
      status,
      ...(parentCategory && {
        parent: {
          categoryId: parentCategory._id,
          categoryName: parentCategory.name,
        },
      }), // Thêm thông tin danh mục cha nếu có
    });

    // Lưu vào database
    const result = await newCategory.save();
    return result; // Trả về danh mục vừa tạo
  } catch (error) {
    console.error("Lỗi khi tạo danh mục:", error);
    throw error;
  }
};

// Lấy tất cả danh mục
const getAllCategories = async () => {
  try {
    const categories = await CategoryModel.find();
    return categories; // Trả về danh sách danh mục
  } catch (error) {
    console.error("Lỗi khi lấy tất cả danh mục:", error);
    throw error;
  }
};

// Lấy danh mục theo ID
const getCategoryById = async (id) => {
  try {
    const category = await CategoryModel.findById(id);
    if (!category) {
      throw new Error("Danh mục không tồn tại");
    }
    return category; // Trả về danh mục theo ID
  } catch (error) {
    console.error("Lỗi khi lấy danh mục theo ID:", error);
    throw error;
  }
};

// Cập nhật danh mục
const updateCategoryById = async (id, categoryData) => {
  try {
    const { parent, ...rest } = categoryData;

    // Nếu có parent, kiểm tra xem danh mục cha có tồn tại không
    let parentCategory = null;
    if (parent) {
      parentCategory = await CategoryModel.findById(parent);
      if (!parentCategory) {
        throw new Error("Danh mục cha không tồn tại");
      }
    }

    // Nếu parent là chuỗi rỗng, điều này có nghĩa là xóa parent
    const updatedData = {
      ...rest,
      ...(parent === "" && { parent: null }), // Xóa parent nếu giá trị rỗng
      ...(parentCategory && {
        parent: {
          categoryId: parentCategory._id,
          categoryName: parentCategory.name,
        },
      }), // Thêm thông tin của parent nếu có
    };

    const updatedCategory = await CategoryModel.findByIdAndUpdate(
      id,
      updatedData,
      {
        new: true,
      }
    );

    if (!updatedCategory) {
      throw new Error("Danh mục không tồn tại");
    }

    return updatedCategory; // Trả về danh mục đã cập nhật
  } catch (error) {
    console.error("Lỗi khi cập nhật danh mục:", error);
    throw error;
  }
};

// Xóa danh mục
const deleteCategoryById = async (id) => {
  try {
    // Tìm và xóa danh mục theo ID
    const deletedCategory = await CategoryModel.findByIdAndDelete(id);
    if (!deletedCategory) {
      throw new Error("Danh mục không tồn tại");
    }

    // Cập nhật các danh mục con có parent là danh mục vừa bị xóa
    await CategoryModel.updateMany(
      { "parent.categoryId": id }, // Tìm tất cả các danh mục con có parent là danh mục vừa xóa
      { parent: null } // Đặt parent của chúng thành null
    );

    return deletedCategory; // Trả về danh mục đã xóa
  } catch (error) {
    console.error("Lỗi khi xóa danh mục:", error);
    throw error;
  }
};

module.exports = {
  insertCategory,
  getAllCategories,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
};
