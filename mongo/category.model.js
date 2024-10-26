//Kết nối collection categories
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const CategorySchema = new Schema({
  name: {
    type: String,
    required: true, // Tên danh mục là bắt buộc
    unique: true, // Đảm bảo tên danh mục là duy nhất
  },
  description: {
    type: String,
    default: "", // Mô tả danh mục, có thể để trống
  },
  parent: {
    type: {
      categoryId: { type: Schema.Types.ObjectId, required: true }, // ID của danh mục cha
      categoryName: { type: String, required: true }, // Tên của danh mục cha
    },
    default: null, // Mặc định là null nếu không có danh mục cha
  },
  status: {
    type: Boolean,
    default: true, // Trạng thái mặc định là true (active)
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
CategorySchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});
module.exports =
  mongoose.models.category || mongoose.model("category", CategorySchema);
