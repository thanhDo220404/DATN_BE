const mongoose = require('mongoose');

const UserVoucherSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  voucherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Voucher', required: true },
  collectedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('UserVoucher', UserVoucherSchema);