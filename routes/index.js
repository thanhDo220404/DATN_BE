const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController"); // Đảm bảo import này đúng

router.get("/", async (req, res) => {
  try {
    const result = await productController.getAll();
    return res.status(200).json(result);
  } catch (error) {
    console.error("Lỗi lấy danh sách sản phẩm:", error);
    return res
      .status(500)
      .json({ message: "Lỗi server", error: error.message });
  }
});

module.exports = router;
