// routes/voucher.js

const express = require("express");
const {
  getVouchers,
  addVoucher,
  updateVoucher,
  deleteVoucher,
  validateVoucher,
} = require("../mongo/voucher.controller"); // Đảm bảo đường dẫn đúng

const router = express.Router();

// Lấy danh sách tất cả voucher
router.get("/", getVouchers);

// Thêm mới một voucher
router.post("/", addVoucher);

// Xác thực voucher
router.post("/validate", validateVoucher);

// Cập nhật voucher theo ID
router.put("/:id", updateVoucher);

// Xóa voucher theo ID
router.delete("/:id", deleteVoucher);

module.exports = router;