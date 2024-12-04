// Kết nối collection categories
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true, // Tên danh mục là bắt buộc
    },
    description: {
      type: String,
      default: "", // Mô tả danh mục, có thể để trống
    },
  },
  {
    timestamps: true, // Tự động thêm `createdAt` và `updatedAt`
  }
);

module.exports =
  mongoose.models.category || mongoose.model("category", CategorySchema);
