// C:\Users\Bevis\Desktop\DATN_BE-develop\mongo\models\Voucher.js
const mongoose = require('mongoose');

const VoucherSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
  discountValue: { type: Number, required: true },
  expiryDate: { type: Date, required: true },
  usageLimit: { type: Number, required: true },
  minOrderValue: { type: Number, required: true },
  usedCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
});

module.exports = mongoose.model('Voucher', VoucherSchema);