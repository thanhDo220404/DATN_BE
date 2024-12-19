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

// Thêm route decrement voucher
router.post('/decrement', async (req, res) => {
  const { code } = req.body;
  try {
    const voucher = await Voucher.findOne({ code });
    if (!voucher || !voucher.isActive) {
      return res.status(400).json({ message: 'Voucher không hợp lệ hoặc đã hết hạn.' });
    }

    if (voucher.usageCount > 0) {
      voucher.usageCount -= 1;
      if (voucher.usageCount === 0) {
        voucher.isActive = false;
      }
      await voucher.save();
      res.json({ usageCount: voucher.usageCount, isActive: voucher.isActive });
    } else {
      res.status(400).json({ message: 'Voucher đã hết lượt sử dụng.' });
    }
  } catch (error) {
    console.error("Error decrementing voucher usage:", error);
    res.status(500).json({ message: 'Đã có lỗi xảy ra.' });
  }
});

// Cập nhật voucher theo ID
router.put("/:id", updateVoucher);

// Xóa voucher theo ID
router.delete("/:id", deleteVoucher);

module.exports = router;