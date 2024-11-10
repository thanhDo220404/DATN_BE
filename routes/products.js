var express = require("express");
var router = express.Router();
const productController = require("../mongo/product.controller");
const productModel = require("../mongo/product.model");
const upload = require("../helper/upload");

/* GET home page. */
router.get("/", async function (req, res, next) {
  try {
    const result = await productController.getAll();
    return res.status(200).json(result);
  } catch (error) {
    console.log("Loi lay danh sach san pham");
    return res.status(500).json({ mess: error });
  }
});


//lấy sản phẩm bằng id
//http://localhost:3000/products/:id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productController.getProductById(id);
    return res.status(200).json({ product });
  } catch (error) {
    console.log("Khong tim thay san pham: ", error);
    return res.status(500).json({ mess: error });
  }
});
// Tạo sản phẩm mới
// http://localhost:2204/products
router.post("/", async (req, res) => {
  try {
    const product = await productController.insert(req.body);
    res.status(201).json(product); // Trả về sản phẩm vừa tạo
  } catch (error) {
    res.status(400).json({ message: error.message }); // Trả về lỗi
  }
});
// Cập nhật sản phẩm theo ID
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params; // Lấy ID từ tham số
    const body = req.body;
    const updatedProduct = await productController.updateProductById(id, body); // Gọi hàm cập nhật sản phẩm

    return res.status(200).json({
      message: "Sản phẩm đã được cập nhật thành công",
      product: updatedProduct,
    });
  } catch (error) {
    console.log("Lỗi cập nhật sản phẩm:", error.message);
    return res.status(500).json({ message: error.message });
  }
});

// Xóa sản phẩm theo ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params; // Lấy ID từ tham số
    const result = await productController.deleteProductById(id); // Gọi hàm xóa sản phẩm

    // Kiểm tra xem sản phẩm có tồn tại không
    if (!result) {
      return res
        .status(404)
        .json({ message: "Sản phẩm không tìm thấy để xóa" });
    }

    return res.status(200).json({ message: "Sản phẩm đã được xóa thành công" });
  } catch (error) {
    console.log("Lỗi xóa sản phẩm:", error.message);
    return res.status(500).json({ message: error.message });
  }
});

// //http://localhost:3000/products/addProduct
// router.post("/addProduct", upload.single("image"), async (req, res) => {
//   try {
//     // const body = req.body;
//     const { name, price, description, hot, bestSeller, discount, category } =
//       req.body;
//     const { filename } = req.file;
//     const now = new Date();
//     const body = {
//       name,
//       price,
//       image: filename,
//       description,
//       hot,
//       bestSeller,
//       discount,
//       category,
//       createdAt: now,
//       updatedAt: now,
//     };
//     const result = await productController.insert(body);
//     return res.status(200).json({ NewProduct: result });
//   } catch (error) {
//     console.log("Loi insert: ", error);
//     return res.status(500).json({ mess: error });
//   }
// });

// //http://localhost:3000/products/updateProduct/:id
// router.post("/updateProduct/:id", upload.single("image"), async (req, res) => {
//   try {
//     // const body = req.body;
//     const { id } = req.params;
//     const body = req.body;
//     if (req.file) {
//       body.image = req.file.originalname;
//     } else {
//       delete body.image;
//     }
//     const proUpdate = await productController.updateById(id, body);
//     return res.status(200).json({ ProductUpdated: proUpdate });
//   } catch (error) {
//     console.log("Loi insert: ", error);
//     return res.status(500).json({ mess: error });
//   }
// });

// router.get("/delete/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const result = await productController.removeById(id);
//     return res.status(200).json({ productDelete: result });
//   } catch (error) {
//     console.log("loi delele: ", error);
//     return res.status(500).json({ mess: error });
//   }
// });

//http://localhost:3000/products/search/:keyword
router.get("/search/:keyword", async (req, res) => {
  try {
    const { keyword } = req.params;
    const result = await productController.searchProducts(keyword);
    return res.status(200).json(result);
  } catch (error) {
    console.log("Loi lay danh sach san pham: ", error);
    return res.status(500).json({ mess: error });
  }
});
router.get("/increaseview/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await productController.increaseViewCount(id);
    return res.status(200).json(result);
  } catch (error) {
    console.log("Loi lay danh sach san pham: ", error);
    return res.status(500).json({ mess: error });
  }
});
module.exports = router;
