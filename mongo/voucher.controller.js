// voucher.controller.js

const Voucher = require("../mongo/voucher.model");

// Lấy danh sách tất cả voucher
exports.getVouchers = async (req, res) => {
  try {
    const vouchers = await Voucher.find();
    res.status(200).json(vouchers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Thêm mới một voucher
exports.addVoucher = async (req, res) => {
  try {
    const newVoucher = new Voucher(req.body);
    await newVoucher.save();
    res.status(201).json(newVoucher);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Thêm voucher thất bại", error });
  }
};

// Cập nhật voucher theo ID
exports.updateVoucher = async (req, res) => {
  try {
    const updatedVoucher = await Voucher.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedVoucher) {
      return res.status(404).json({ message: "Voucher không tìm thấy" });
    }
    res.status(200).json(updatedVoucher);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Cập nhật voucher thất bại", error });
  }
};

// Xóa voucher theo ID
exports.deleteVoucher = async (req, res) => {
  try {
    const deletedVoucher = await Voucher.findByIdAndDelete(req.params.id);
    if (!deletedVoucher) {
      return res.status(404).json({ message: "Voucher không tìm thấy" });
    }
    res.status(200).json({ message: "Xóa voucher thành công" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Xóa voucher thất bại", error });
  }
};

// Hàm xác thực voucher
exports.validateVoucher = async (req, res) => {
  const { code, orderValue } = req.body;

  try {
    // Tìm voucher theo mã
    const voucher = await Voucher.findOne({ code });

    if (!voucher) {
      return res.status(400).json({ message: "Voucher không tồn tại." });
    }

    // Kiểm tra hạn sử dụng
    if (voucher.expiryDate < new Date()) {
      return res.status(400).json({ message: "Voucher đã hết hạn." });
    }

    // Kiểm tra giá trị đơn hàng tối thiểu
    if (orderValue < voucher.minOrderValue) {
      return res.status(400).json({ message: "Giá trị đơn hàng không đủ để áp dụng voucher này." });
    }

    // Tính toán số tiền giảm giá
    let discountAmount = 0;
    if (voucher.discountType === "percentage") {
      discountAmount = (orderValue * voucher.discountValue) / 100;

      // Áp dụng mức giảm tối đa nếu có
      if (voucher.maxDiscountAmount && discountAmount > voucher.maxDiscountAmount) {
        discountAmount = voucher.maxDiscountAmount;
      }
    } else {
      discountAmount = voucher.discountValue;
    }

    return res.status(200).json({ discountAmount, message: "Áp dụng voucher thành công!" });
  } catch (error) {
    console.error("Lỗi khi xác thực voucher:", error);
    return res.status(500).json({ message: "Đã xảy ra lỗi khi xác thực voucher." });
  }
};