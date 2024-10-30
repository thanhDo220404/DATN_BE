const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const CartSchema = new Schema({
  user: {
    _id: { type: ObjectId },
  },
  product: {
    _id: { type: ObjectId },
    name: { type: String },
    description: { type: String },
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
        quantity: { type: Number },
      },
    },
  },
});

// Tính toán tổng giá trị của giỏ hàng dựa trên các sản phẩm
CartSchema.methods.calculateTotalPrice = function () {
  this.totalPrice = this.product.items.reduce((total, item) => {
    const itemDiscountedPrice = item.price - item.discount;
    const itemTotal =
      itemDiscountedPrice *
      item.variations.reduce(
        (qtyTotal, variation) => qtyTotal + variation.quantity,
        0
      );
    return total + itemTotal;
  }, 0);
  return this.totalPrice; // Return the calculated total price
};

module.exports = mongoose.models.cart || mongoose.model("cart", CartSchema);
