const express = require("express");
const router = express.Router();
const SizeController = require("../mongo/size.controller"); // Đảm bảo đường dẫn đúng đến controller

// Lấy tất cả kích thước
router.get("/", async (req, res) => {
  try {
    const result = await SizeController.getAllSizes();
    return res.status(200).json(result);
  } catch (error) {
    console.log("Lỗi lấy danh sách kích thước:", error.message);
    return res.status(500).json({ message: error.message });
  }
});

// Lấy kích thước theo ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await SizeController.getSizeById(id);
    if (!result) {
      return res.status(404).json({ message: "Kích thước không tìm thấy" });
    }
    return res.status(200).json(result);
  } catch (error) {
    console.log("Lỗi lấy kích thước bằng ID:", error.message);
    return res.status(500).json({ message: error.message });
  }
});

// Tạo kích thước mới
router.post("/", async (req, res) => {
  try {
    const body = req.body;
    const result = await SizeController.insertSize(body);
    return res.status(201).json(result);
  } catch (error) {
    console.log("Lỗi tạo kích thước:", error.message);
    return res.status(500).json({ message: error.message });
  }
});

// Cập nhật kích thước theo ID
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const result = await SizeController.updateSizeById(id, body);
    if (!result) {
      return res
        .status(404)
        .json({ message: "Kích thước không tìm thấy để cập nhật" });
    }
    return res.status(200).json(result);
  } catch (error) {
    console.log("Lỗi cập nhật kích thước:", error.message);
    return res.status(500).json({ message: error.message });
  }
});

// Xóa kích thước theo ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await SizeController.deleteSizeById(id);
    if (!result) {
      return res
        .status(404)
        .json({ message: "Kích thước không tìm thấy để xóa" });
    }
    return res
      .status(200)
      .json({ message: "Kích thước đã được xóa thành công" });
  } catch (error) {
    console.log("Lỗi xóa kích thước:", error.message);
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
