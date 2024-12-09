const express = require("express");
const router = express.Router();
const ColorController = require("../mongo/color.controller"); // Đảm bảo đường dẫn đúng đến controller

// Lấy tất cả màu sắc
router.get("/", async (req, res) => {
  try {
    const result = await ColorController.getAllColors();
    return res.status(200).json(result);
  } catch (error) {
    console.log("Lỗi lấy danh sách màu sắc:", error.message);
    return res.status(500).json({ message: error.message });
  }
});

// Lấy màu sắc theo ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await ColorController.getColorById(id);
    if (!result) {
      return res.status(404).json({ message: "Màu sắc không tìm thấy" });
    }
    return res.status(200).json(result);
  } catch (error) {
    console.log("Lỗi lấy màu sắc bằng ID:", error.message);
    return res.status(500).json({ message: error.message });
  }
});

// Tạo màu sắc mới
router.post("/", async (req, res) => {
  try {
    const body = req.body;
    const result = await ColorController.insertColor(body);
    return res.status(201).json(result);
  } catch (error) {
    console.log("Lỗi tạo màu sắc:", error.message);
    return res.status(500).json({ message: error.message });
  }
});

// Cập nhật màu sắc theo ID
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const result = await ColorController.updateColorById(id, body);
    if (!result) {
      return res
        .status(404)
        .json({ message: "Màu sắc không tìm thấy để cập nhật" });
    }
    return res.status(200).json(result);
  } catch (error) {
    console.log("Lỗi cập nhật màu sắc:", error.message);
    return res.status(500).json({ message: error.message });
  }
});

// Xóa màu sắc theo ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await ColorController.deleteColorById(id);
    if (!result) {
      return res.status(404).json({ message: "Màu sắc không tìm thấy để xóa" });
    }
    return res.status(200).json({ message: "Màu sắc đã được xóa thành công" });
  } catch (error) {
    console.log("Lỗi xóa màu sắc:", error.message);
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
