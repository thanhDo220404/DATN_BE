const express = require("express");
const router = express.Router();
const cartController = require("../mongo/cart.controller");

// 1. Tạo giỏ hàng mới
router.post("/", async (req, res) => {
  const body = req.body;
  try {
    const cart = await cartController.createCart(body);
    res.status(200).json(cart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 2. Lấy giỏ hàng của người dùng
router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const carts = await cartController.getCartsByUserId(userId);
    res.status(200).json(carts);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
// 2. Lấy giỏ hàng của người dùng
router.get("/:cartId", async (req, res) => {
  const { cartId } = req.params;
  try {
    const carts = await cartController.getCartById(cartId);
    res.status(200).json(carts);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 3. Cập nhật giỏ hàng
router.put("/:cartId", async (req, res) => {
  const { cartId } = req.params;
  const body = req.body;
  try {
    const cart = await cartController.updateCart(cartId, body);
    res.status(200).json(cart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
// 3. Cập nhật giỏ hàng
router.put("/:cartId/quantity", async (req, res) => {
  const { cartId } = req.params;
  const body = req.body;
  try {
    const cart = await cartController.updateCartQuantity(cartId, body);
    res.status(200).json(cart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 4. Xóa giỏ hàng
router.delete("/:cartId", async (req, res) => {
  const { cartId } = req.params;
  try {
    const cart = await cartController.deleteCart(cartId);
    res.status(200).json(cart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
router.get("/", async function (req, res, next) {
  try {
    const result = await cartController.getAll();
    return res.status(200).json({ Carts: result });
  } catch (error) {
    console.log("Loi lay danh sach danh muc");
    return res.status(500).json({ mess: error });
  }
});
module.exports = router;
