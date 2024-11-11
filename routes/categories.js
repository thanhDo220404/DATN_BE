const express = require("express");
const router = express.Router();
const CategoryController = require("../mongo/category.controller"); // Đảm bảo đường dẫn đúng đến controller

// Cập nhật danh mục theo ID
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const result = await CategoryController.updateCategoryById(id, body);
    if (!result) {
      return res
        .status(404)
        .json({ message: "Danh mục không tìm thấy để cập nhật" });
    }
    return res.status(200).json(result);
  } catch (error) {
    console.log("Lỗi cập nhật danh mục:", error.message);
    return res.status(500).json({ message: error.message });
  }
});
// Lấy tất cả danh mục
router.get("/", async (req, res) => {
  try {
    const result = await CategoryController.getAllCategories();
    return res.status(200).json(result);
  } catch (error) {
    console.log("Lỗi lấy danh sách danh mục:", error.message);
    return res.status(500).json({ message: error.message });
  }
});

// Lấy danh mục theo ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await CategoryController.getCategoryById(id);
    if (!result) {
      return res.status(404).json({ message: "Danh mục không tìm thấy" });
    }
    return res.status(200).json(result);
  } catch (error) {
    console.log("Lỗi lấy danh mục bằng ID:", error.message);
    return res.status(500).json({ message: error.message });
  }
});


// Tạo danh mục mới
router.post("/", async (req, res) => {
  try {
    const body = req.body;
    const result = await CategoryController.insertCategory(body);
    return res.status(201).json(result);
  } catch (error) {
    console.log("Lỗi tạo danh mục:", error.message);
    return res.status(500).json({ message: error.message });
  }
});



// Xóa danh mục theo ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await CategoryController.deleteCategoryById(id);
    if (!result) {
      return res
        .status(404)
        .json({ message: "Danh mục không tìm thấy để xóa" });
    }
    return res.status(200).json({ message: "Danh mục đã được xóa thành công" });
  } catch (error) {
    console.log("Lỗi xóa danh mục:", error.message);
    return res.status(500).json({ message: error.message });
  }
});



module.exports = router;
