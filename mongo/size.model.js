const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Mô hình cho Kích thước
const SizeSchema = new Schema({
  name: {
    type: String,
    required: true, // Tên kích thước là bắt buộc
    unique: true, // Đảm bảo tên kích thước là duy nhất
  },
  value: {
    type: String, // Giá trị kích thước, kiểu dữ liệu là số
    required: true, // Giá trị kích thước là bắt buộc
  },
  description: {
    type: String,
    default: "", // Mô tả kích thước, có thể để trống
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
SizeSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.models.size || mongoose.model("size", SizeSchema);
