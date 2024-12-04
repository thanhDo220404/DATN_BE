const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const UserReviewsSchema = new Schema(
  {
    order: {
      _id: { type: ObjectId },
    },
    user: {
      _id: { type: ObjectId },
    },
    products: {
      _id: { type: ObjectId },
      items: {
        _id: { type: ObjectId },
        color: {
          _id: { type: ObjectId },
          colorName: { type: String },
          colorHexCode: { type: String },
        },
        image: {
          _id: { type: ObjectId },
          mediaFilePath: { type: String },
        },
        variations: {
          _id: { type: ObjectId },
          size: {
            _id: { type: ObjectId },
            sizeName: { type: String },
            sizeValue: { type: String },
          },
        },
      },
    },
    rating_value: {
      type: Number,
      default: 0,
      min: 0,
      max: 5, // Giới hạn giá trị từ 0 đến 5
    },
    comment: { type: String, default: "" },
  },
  {
    timestamps: true, // Tự động thêm `createdAt` và `updatedAt`
  }
);
module.exports =
  mongoose.models.user_reviews ||
  mongoose.model("user_reviews", UserReviewsSchema);
