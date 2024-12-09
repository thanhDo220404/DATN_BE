const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Mô hình cho Màu sắc
const ColorSchema = new Schema({
  name: {
    type: String,
    required: true, // Tên màu là bắt buộc
    unique: true, // Đảm bảo tên màu là duy nhất
  },
  hexCode: {
    type: String,
    required: true, // Mã màu hex là bắt buộc
  },
  description: {
    type: String,
    default: "", // Mô tả màu sắc, có thể để trống
  },
  createdAt: {
    type: Date,
    default: Date.now, // Ngày tạo, mặc định là ngày hiện tại
  },
  updatedAt: {
    type: Date,
    default: Date.now, // Ngày cập nhật, mặc định là ngày hiện tại
  },
});

// Middleware để tự động cập nhật updatedAt trước khi lưu
ColorSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.models.color || mongoose.model("color", ColorSchema);
