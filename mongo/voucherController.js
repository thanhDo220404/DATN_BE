// voucherController.js

const Voucher = require('../mongo/Voucher');
const UserVoucherUsage = require('../mongo/UserVoucherUsage'); // Assuming you have a model to track user voucher usage

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
      usageLimit, // Thêm giới hạn lượt sử dụng
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
      usageLimit, // Lưu giới hạn lượt sử dụng
      usageCount: 0, // Khởi tạo lượt sử dụng
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
      usageLimit, // Thêm giới hạn lượt sử dụng
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
        usageLimit, // Cập nhật giới hạn lượt sử dụng
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

    console.log(`Validating voucher: ${code} for user: ${userId} with order value: ${orderValue}`);

    // Check user usage
    const userUsage = await UserVoucherUsage.findOne({ userId, code });
    if (userUsage && userUsage.usageCount >= userUsage.userLimit) {
      return res.status(400).json({ message: 'Bạn đã sử dụng voucher này tối đa số lần cho phép.' });
    }

    // Atomically find and update the voucher if usageCount < usageLimit
    const voucher = await Voucher.findOneAndUpdate(
      {
        code,
        isActive: true,
        expiryDate: { $gte: new Date() },
        $expr: { $lt: ["$usageCount", "$usageLimit"] },
      },
      {
        $inc: { usageCount: 1 },
      },
      { new: true }
    );

    if (!voucher) {
      console.log('Voucher invalid or usage limit reached.');
      return res.status(400).json({ message: 'Voucher không hợp lệ hoặc đã hết lượt sử dụng.' });
    }

    // Check if usageCount has reached usageLimit
    if (voucher.usageCount >= voucher.usageLimit) {
      voucher.isActive = false;
      await voucher.save();
      console.log(`Voucher ${code} has reached its usage limit and is now inactive.`);
    }

    if (orderValue < voucher.minOrderValue) {
      console.log(`Order value ${orderValue} is less than minimum required ${voucher.minOrderValue}`);
      return res.status(400).json({
        message: `Giá trị đơn hàng tối thiểu để áp dụng voucher là ${voucher.minOrderValue.toLocaleString()} VND.`,
      });
    }

    // Calculate discount
    let discountAmount = 0;

    if (voucher.discountType === 'percentage') {
      discountAmount = (voucher.discountValue / 100) * orderValue;
      console.log(`Calculated percentage discount: ${discountAmount}`);
    } else if (voucher.discountType === 'fixed') {
      discountAmount = voucher.discountValue;
      console.log(`Calculated fixed discount: ${discountAmount}`);
    }

    // Apply maximum discount limit if applicable
    if (voucher.maxDiscountAmount != null && discountAmount > voucher.maxDiscountAmount) {
      discountAmount = voucher.maxDiscountAmount;
      console.log(`Applied max discount limit: ${discountAmount}`);
    }

    // Ensure discountAmount does not exceed orderValue
    if (discountAmount > orderValue) {
      discountAmount = orderValue;
      console.log(`Adjusted discount to not exceed order value: ${discountAmount}`);
    }

    console.log(`Final discount amount: ${discountAmount}`);

    // Update user usage
    if (userUsage) {
      userUsage.usageCount += 1;
      await userUsage.save();
    } else {
      await UserVoucherUsage.create({ userId, code, usageCount: 1, userLimit: voucher.userLimit });
    }

    // Return discount information
    res.status(200).json({
      discountAmount,
      message: 'Áp dụng voucher thành công',
      usageCount: voucher.usageCount, // Include usage count in the response
    });
  } catch (error) {
    console.error('Error in validateVoucher:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};