const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    image: {
      _id: { type: ObjectId },
      filePath: { type: String },
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt
  }
);

module.exports = mongoose.model("post", PostSchema);
