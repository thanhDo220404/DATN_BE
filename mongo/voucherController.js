// C:\Users\Bevis\Desktop\DATN_BE-develop\mongo\controllers\voucherController.js
const Voucher = require('../mongo/Voucher');

exports.getVouchers = async (req, res) => {
  try {
    const vouchers = await Voucher.find({});
    res.status(200).json(vouchers);
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.addVoucher = async (req, res) => {
  try {
    const voucher = new Voucher(req.body);
    await voucher.save();
    res.status(201).json(voucher);
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.updateVoucher = async (req, res) => {
  try {
    const voucher = await Voucher.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(voucher);
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.deleteVoucher = async (req, res) => {
  try {
    await Voucher.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Voucher deleted successfully' });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.validateVoucher = async (req, res) => {
  try {
    const { code, orderValue } = req.body;
    const voucher = await Voucher.findOne({ code, isActive: true });

    if (!voucher) {
      return res.status(400).json({ error: 'Invalid voucher code' });
    }

    if (voucher.expiryDate < new Date()) {
      return res.status(400).json({ error: 'Voucher has expired' });
    }

    if (voucher.usageLimit <= voucher.usedCount) {
      return res.status(400).json({ error: 'Voucher usage limit reached' });
    }

    if (orderValue < voucher.minOrderValue) {
      return res.status(400).json({ error: 'Order value does not meet the minimum requirement' });
    }

    res.status(200).json({ discountType: voucher.discountType, discountValue: voucher.discountValue });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};