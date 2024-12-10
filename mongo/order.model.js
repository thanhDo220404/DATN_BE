const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const OrderSchema = new Schema(
  {
    user: {
      _id: { type: ObjectId },
    },
    products: [
      {
        _id: { type: ObjectId },
        name: { type: String },
        category: {
          _id: { type: ObjectId },
          categoryName: { type: String },
        },
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
          price: { type: Number },
          discount: { type: Number, default: 0 },
          variations: {
            _id: { type: Object },
            size: {
              _id: { type: ObjectId },
              sizeName: { type: String },
              sizeValue: { type: String },
            },
          },
        },
        quantity: { type: Number },
      },
    ],
    order_address: {
      address: {
        id: { type: String, required: true },
        name: { type: String, required: true },
        district: {
          id: { type: String, required: true },
          name: { type: String, required: true },
          ward: {
            id: { type: String, required: true },
            name: { type: String, required: true },
            prefix: { type: String, required: true },
            _id: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Ward",
              required: true,
            },
          },
          _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "District",
            required: true,
          },
        },
      },
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
        required: true,
      },
      name: { type: String, required: true },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      phone: { type: String, required: true },
      specific_address: { type: String, required: true },
      is_default: { type: Boolean, default: false },
    },
    order_status: {
      _id: { type: ObjectId },
      name: { type: String },
    },
    shipping_method: {
      _id: { type: ObjectId },
      name: { type: String },
      price: { type: Number },
      description: { type: String },
    },
    payment_type: {
      type: String,
      enum: ["Thanh toán khi nhận hàng", "Ví điện tử VNPAY"],
      default: "Thanh toán khi nhận hàng",
      required: true,
    },
    order_total: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.order || mongoose.model("order", OrderSchema);
