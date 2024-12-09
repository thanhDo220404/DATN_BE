const ShippingMethod = require("./shipping_method.model");

// Lấy danh sách phương thức giao hàng
exports.getShippingMethods = async (req, res) => {
  try {
    const shippingMethods = await ShippingMethod.find();
    res.json(shippingMethods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Thêm phương thức giao hàng
exports.addShippingMethod = async (req, res) => {
  const shippingMethod = new ShippingMethod({
    name: req.body.name,
    price: req.body.price,
  });

  try {
    const newShippingMethod = await shippingMethod.save();
    res.status(201).json(newShippingMethod);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Cập nhật phương thức giao hàng
exports.updateShippingMethod = async (req, res) => {
  try {
    const shippingMethod = await ShippingMethod.findById(req.params.id);
    if (!shippingMethod)
      return res
        .status(404)
        .json({ message: "Phương thức giao hàng không tồn tại." });

    shippingMethod.name = req.body.name;
    shippingMethod.price = req.body.price;

    const updatedShippingMethod = await shippingMethod.save();
    res.json(updatedShippingMethod);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Xóa phương thức giao hàng
exports.deleteShippingMethod = async (req, res) => {
  try {
    const shippingMethod = await ShippingMethod.findById(req.params.id);
    if (!shippingMethod)
      return res
        .status(404)
        .json({ message: "Phương thức giao hàng không tồn tại." });

    await shippingMethod.remove();
    res.json({ message: "Phương thức giao hàng đã được xóa." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
