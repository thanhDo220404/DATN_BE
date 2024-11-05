const express = require("express");
const {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  getOrdersByUserId,
  updateOrderStatus,
} = require("../mongo/order.controller"); // Đảm bảo đường dẫn đúng

const router = express.Router();

// 1. Tạo đơn hàng mới
router.post("/", async (req, res) => {
  try {
    const order = await createOrder(req.body);
    return res.status(201).json(order);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

// 2. Lấy tất cả đơn hàng
router.get("/", async (req, res) => {
  try {
    const orders = await getAllOrders();
    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// 3. Lấy đơn hàng theo ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const order = await getOrderById(id);
    return res.status(200).json(order);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

// 4. Cập nhật đơn hàng
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const updatedOrder = await updateOrder(id, req.body);
    return res.status(200).json(updatedOrder);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

// 5. Cập nhật trạng thái đơn hàng
router.put("/status/:id", async (req, res) => {
  const { id } = req.params; // ID của đơn hàng
  const { orderStatusId } = req.body; // Lấy orderStatusId từ body
  try {
    const updatedOrder = await updateOrderStatus(id, orderStatusId);
    return res.status(200).json(updatedOrder);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

// 5. Xóa đơn hàng
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedOrder = await deleteOrder(id);
    return res.status(200).json(deletedOrder);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});
router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const orders = await getOrdersByUserId(userId);
    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
