// Voucher.js

const mongoose = require("mongoose");

const VoucherSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discountType: { type: String, required: true, enum: ["percentage", "fixed"] },
  discountValue: { type: Number, required: true },
  maxDiscountAmount: { type: Number }, // Thêm trường này
  expiryDate: { type: Date, required: true },
  minOrderValue: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
});

module.exports = mongoose.model("Voucher", VoucherSchema);
