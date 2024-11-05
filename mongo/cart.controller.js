const Cart = require("./cart.model"); // Đảm bảo đường dẫn đúng
const User = require("./user.model");
const Product = require("./product.model");

// 1. Tạo một giỏ hàng mới
const createCart = async (data) => {
  const { user, product } = data;

  try {
    // Kiểm tra sự tồn tại của người dùng
    const foundUser = await User.findById(user._id);
    if (!foundUser) {
      throw new Error("User not found.");
    }

    // Kiểm tra sự tồn tại của sản phẩm
    const foundProduct = await Product.findById(product._id);
    if (!foundProduct) {
      throw new Error("Product not found.");
    }

    // Kiểm tra sự tồn tại của product.items
    const itemExists = foundProduct.items.some(
      (item) => item._id.toString() === product.items._id
    );
    if (!itemExists) {
      throw new Error("Product item not found.");
    }

    // Kiểm tra sự tồn tại của product.items.variations
    const foundItem = foundProduct.items.find(
      (item) => item._id.toString() === product.items._id
    );
    const variationExists = foundItem.variations.some(
      (variation) => variation._id.toString() === product.items.variations._id
    );
    if (!variationExists) {
      throw new Error("Product variation not found.");
    }

    // Kiểm tra giỏ hàng của người dùng
    const existingCart = await Cart.findOne({
      "user._id": user._id,
      "product._id": product._id,
      "product.items._id": product.items._id,
      "product.items.variations._id": product.items.variations._id,
    });

    if (existingCart) {
      // Nếu giỏ hàng đã tồn tại, tăng số lượng
      existingCart.product.quantity += product.quantity; // Hoặc điều chỉnh theo logic cần thiết
      await existingCart.save();
      return existingCart; // Trả về giỏ hàng đã được cập nhật
    }

    // Nếu không tồn tại, tạo giỏ hàng mới
    const cart = new Cart(data);
    await cart.save();
    return cart;
  } catch (error) {
    throw new Error("Error creating cart: " + error.message);
  }
};

// 2. Lấy tất cả giỏ hàng của người dùng
const getCartsByUserId = async (userId) => {
  try {
    const carts = await Cart.find({ "user._id": userId });
    return carts;
  } catch (error) {
    throw new Error("Error fetching carts: " + error.message);
  }
};

// 3. Cập nhật giỏ hàng
const updateCart = async (cartId, updateData) => {
  try {
    const cart = await Cart.findByIdAndUpdate(cartId, updateData, {
      new: true,
    });
    if (!cart) {
      throw new Error("Cart not found");
    }
    return cart;
  } catch (error) {
    throw new Error("Error updating cart: " + error.message);
  }
};
const updateCartQuantity = async (cartId, updateData) => {
  try {
    const { quantity } = updateData;

    const cart = await Cart.findByIdAndUpdate(
      cartId,
      {
        $set: { "product.quantity": quantity }, // Cập nhật quantity trong sản phẩm
      },
      { new: true, runValidators: true }
    );

    if (!cart) {
      throw new Error("Cart not found");
    }

    return cart; // Trả về cart đã được cập nhật
  } catch (error) {
    throw new Error("Error update cart's quantity: " + error.message);
  }
};

// 4. Xóa giỏ hàng
const deleteCart = async (cartId) => {
  try {
    const cart = await Cart.findByIdAndDelete(cartId);
    if (!cart) {
      throw new Error("Cart not found");
    }
    return cart;
  } catch (error) {
    throw new Error("Error deleting cart: " + error.message);
  }
};
const getAll = async () => {
  try {
    const result = await Cart.find();
    return result;
  } catch (error) {
    console.log("Loi lay danh sach cart");
    throw error;
  }
};
const getCartById = async (id) => {
  try {
    const result = await Cart.findById(id);
    return result;
  } catch (error) {
    console.log("Lỗi lấy gio hang theo id:", error.message);
    throw error;
  }
};

module.exports = {
  createCart,
  getCartsByUserId,
  updateCart,
  updateCartQuantity,
  deleteCart,
  getAll,
  getCartById,
};
