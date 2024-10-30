const Cart = require("./cart.model"); // Đảm bảo đường dẫn đúng

// 1. Tạo một giỏ hàng mới
const createCart = async (data) => {
  try {
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
  deleteCart,
  getAll,
  getCartById,
};
