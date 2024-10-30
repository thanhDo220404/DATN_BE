const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const ProductSchema = new Schema({
  // name: { type: String, required: true },
  // price: { type: Number, required: true },
  // discount: { type: Number, required: false, default: 0 },
  // hot: { type: Boolean, required: false, default: false },
  // bestSeller: { type: Boolean, required: false, default: false },
  // image: { type: String, required: true },
  // description: { type: String, required: false },
  // category: {
  //   type: {
  //     categoryId: { type: ObjectId, required: true },
  //     categoryName: { type: String, required: true },
  //   },
  //   required: true,
  // },
  // view: { type: Number, default: 0 },
  // createdAt: { type: Date, default: Date.now },
  // updatedAt: { type: Date, default: Date.now },
  name: { type: String, required: true },
  description: { type: String },
  category: {
    type: {
      _id: { type: ObjectId, required: true },
      categoryName: { type: String, required: true },
    },
    required: true,
  },
  items: [
    {
      color: {
        type: {
          _id: { type: ObjectId, required: true },
          colorName: { type: String, required: true },
          colorHexCode: { type: String, required: true },
        },
        required: true,
      },
      image: {
        type: {
          _id: { type: ObjectId, required: true },
          mediaFilePath: { type: String, required: true },
        },
        required: true,
      },
      price: { type: Number, required: true },
      discount: { type: Number, default: 0 },
      variations: [
        {
          size: {
            type: {
              _id: { type: ObjectId, required: true },
              sizeName: { type: String, required: true },
              sizeValue: { type: String, required: true },
            },
            required: true,
          },
          quantity: { type: Number, required: true },
        },
      ],
    },
  ],
  view: {
    type: Number,
    default: 0,
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
ProductSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports =
  mongoose.models.product || mongoose.model("product", ProductSchema);
