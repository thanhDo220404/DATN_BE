// voucherController.js

const Voucher = require('../mongo/Voucher');

// Lấy danh sách tất cả voucher
exports.getVouchers = async (req, res) => {
  try {
    const vouchers = await Voucher.find();
    res.status(200).json(vouchers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Thêm mới một voucher
exports.addVoucher = async (req, res) => {
  try {
    const {
      code,
      discountType,
      discountValue,
      maxDiscountAmount,
      expiryDate,
      minOrderValue,
      isActive = true,
    } = req.body;

    // Kiểm tra xem voucher đã tồn tại chưa
    const existingVoucher = await Voucher.findOne({ code });

    if (existingVoucher) {
      return res.status(400).json({ message: 'Voucher đã tồn tại' });
    }

    const newVoucher = new Voucher({
      code,
      discountType,
      discountValue,
      maxDiscountAmount,
      expiryDate,
      minOrderValue,
      isActive,
    });

    await newVoucher.save();

    res.status(201).json(newVoucher);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Cập nhật voucher theo ID
exports.updateVoucher = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      code,
      discountType,
      discountValue,
      maxDiscountAmount,
      expiryDate,
      minOrderValue,
      isActive,
    } = req.body;

    const updatedVoucher = await Voucher.findByIdAndUpdate(
      id,
      {
        code,
        discountType,
        discountValue,
        maxDiscountAmount,
        expiryDate,
        minOrderValue,
        isActive,
      },
      { new: true }
    );

    if (!updatedVoucher) {
      return res.status(404).json({ message: 'Voucher không tồn tại' });
    }

    res.status(200).json(updatedVoucher);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Xóa voucher theo ID
exports.deleteVoucher = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedVoucher = await Voucher.findByIdAndDelete(id);

    if (!deletedVoucher) {
      return res.status(404).json({ message: 'Voucher không tồn tại' });
    }

    res.status(200).json({ message: 'Xóa voucher thành công' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Xác thực voucher
exports.validateVoucher = async (req, res) => {
  try {
    const { userId, code, orderValue } = req.body;
    const voucher = await Voucher.findOne({ code });

    if (!voucher) {
      return res.status(400).json({ message: 'Voucher không tồn tại' });
    }

    if (!voucher.isActive) {
      return res.status(400).json({ message: 'Voucher không hoạt động' });
    }

    if (new Date(voucher.expiryDate) < new Date()) {
      return res.status(400).json({ message: 'Voucher đã hết hạn' });
    }

    if (orderValue < voucher.minOrderValue) {
      return res.status(400).json({
        message: `Giá trị đơn hàng tối thiểu để áp dụng voucher là ${voucher.minOrderValue.toLocaleString()} VND.`,
      });
    }

    // Tính toán giảm giá
    let discountAmount = 0;

    if (voucher.discountType === 'percentage') {
      discountAmount = (voucher.discountValue / 100) * orderValue;
    } else if (voucher.discountType === 'fixed') {
      discountAmount = voucher.discountValue;
    }

    // Áp dụng giảm giá tối đa nếu có
    if (voucher.maxDiscountAmount != null && discountAmount > voucher.maxDiscountAmount) {
      discountAmount = voucher.maxDiscountAmount;
    }

    // Đảm bảo discountAmount không lớn hơn orderValue
    if (discountAmount > orderValue) {
      discountAmount = orderValue;
    }

    // Trả về thông tin giảm giá
    res.status(200).json({
      discountAmount,
      message: 'Áp dụng voucher thành công',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};