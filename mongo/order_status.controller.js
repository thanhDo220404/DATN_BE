const OrderStatus = require("../mongo/order_status.model");

// Lấy danh sách trạng thái đơn hàng
exports.getOrderStatuses = async (req, res) => {
  try {
    const orderStatuses = await OrderStatus.find();
    res.json(orderStatuses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Thêm trạng thái đơn hàng
exports.addOrderStatus = async (req, res) => {
  const orderStatus = new OrderStatus({
    name: req.body.name,
  });

  try {
    const newOrderStatus = await orderStatus.save();
    res.status(201).json(newOrderStatus);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Cập nhật trạng thái đơn hàng
exports.updateOrderStatus = async (req, res) => {
  try {
    const orderStatus = await OrderStatus.findById(req.params.id);
    if (!orderStatus)
      return res
        .status(404)
        .json({ message: "Trạng thái đơn hàng không tồn tại." });

    orderStatus.name = req.body.name;

    const updatedOrderStatus = await orderStatus.save();
    res.json(updatedOrderStatus);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Xóa trạng thái đơn hàng
exports.deleteOrderStatus = async (req, res) => {
  try {
    const orderStatus = await OrderStatus.findById(req.params.id);
    if (!orderStatus)
      return res
        .status(404)
        .json({ message: "Trạng thái đơn hàng không tồn tại." });

    await orderStatus.remove();
    res.json({ message: "Trạng thái đơn hàng đã được xóa." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
