// routes/voucher.js

const express = require("express");
const {
  getVouchers,
  addVoucher,
  updateVoucher,
  deleteVoucher,
  validateVoucher,
} = require("../mongo/voucher.controller"); // Đảm bảo đường dẫn đúng tới voucherController.js

const router = express.Router();

// Lấy danh sách tất cả voucher
router.get("/", getVouchers);

// Thêm mới một voucher
router.post("/", addVoucher);

// Cập nhật voucher theo ID
router.put("/:id", updateVoucher);

// Xóa voucher theo ID
router.delete("/:id", deleteVoucher);

// Xác thực voucher
router.post("/validate", validateVoucher);

module.exports = router;
