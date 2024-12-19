// Voucher.js

const mongoose = require('mongoose');

const VoucherSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discountType: { type: String, required: true, enum: ['percentage', 'fixed'] },
  discountValue: { type: Number, required: true },
  maxDiscountAmount: { type: Number }, // Thêm trường này
  expiryDate: { type: Date, required: true },
  minOrderValue: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
  usageLimit: { type: Number, required: true }, // Thêm giới hạn lượt sử dụng
  usageCount: { type: Number, default: 0 }, // Thêm lượt sử dụng hiện tại
  userLimit: { type: Number, required: true }, // Giới hạn lượt sử dụng mỗi người
});

module.exports = mongoose.model('Voucher', VoucherSchema);