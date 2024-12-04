const Order = require("./order.model"); // Đảm bảo đường dẫn đúng
const User = require("./user.model");
const Product = require("./product.model");
const Order_Status = require("./order_status.model");

// 1. Tạo một đơn hàng mới
const createOrder = async (data) => {
  const {
    user,
    products,
    shipping_method,
    order_address,
    payment_type,
    order_total,
  } = data;

  try {
    // Kiểm tra sự tồn tại của người dùng
    const foundUser = await User.findById(user._id);
    if (!foundUser) throw new Error("User not found.");

    // Kiểm tra sự tồn tại của sản phẩm và giảm số lượng
    for (const product of products) {
      const foundProduct = await Product.findById(product._id);
      if (!foundProduct) throw new Error(`Product ${product._id} not found.`);

      const item = product.items;
      const productItem = foundProduct.items.find(
        (p) => p._id.toString() === item._id.toString()
      ); // Chuyển đổi sang chuỗi để so sánh

      if (!productItem) {
        throw new Error(
          `Item with ID ${item._id} not found in product ${foundProduct.name}.`
        );
      }

      const sizeVariation = productItem.variations.find(
        (v) => v._id.toString() === item.variations._id.toString()
      );

      if (!sizeVariation) {
        throw new Error(
          `Size variation with ID ${item.variations._id} not found in item ${product.name}.`
        );
      }

      if (sizeVariation.quantity >= product.quantity) {
        // Giảm số lượng
        sizeVariation.quantity -= product.quantity;
        await foundProduct.save();
      } else {
        throw new Error(
          `Not enough quantity for ${product.name} in size ${sizeVariation.size.sizeName}.`
        );
      }
    }

    let order_status_find = await Order_Status.findById(
      "6724f9c943ad843da1d3114c"
    );

    if (payment_type === "Ví điện tử VNPAY") {
      order_status_find = await Order_Status.findById(
        "673f4eb7e8698e7b4115b84c"
      );
    }

    // Tạo đơn hàng mới
    const order = new Order({
      user,
      products,
      shipping_method,
      order_address,
      payment_type,
      order_total,
      order_status: order_status_find,
    });

    await order.save();
    return order;
  } catch (error) {
    throw new Error("Error creating order: " + error.message);
  }
};

const getAllOrders = async () => {
  try {
    const orders = await Order.find().sort({
      createdAt: -1,
    });
    return orders;
  } catch (error) {
    throw new Error("Error fetching orders: " + error.message);
  }
};

// 3. Lấy đơn hàng theo ID
const getOrderById = async (orderId) => {
  try {
    const order = await Order.findById(orderId);
    if (!order) throw new Error("Order not found.");
    return order;
  } catch (error) {
    throw new Error("Error fetching order: " + error.message);
  }
};

// 4. Cập nhật đơn hàng
const updateOrder = async (orderId, updateData) => {
  try {
    const order = await Order.findByIdAndUpdate(orderId, updateData, {
      new: true,
      runValidators: true,
    });
    if (!order) throw new Error("Order not found.");
    return order;
  } catch (error) {
    throw new Error("Error updating order: " + error.message);
  }
};

// 5. Xóa đơn hàng
const deleteOrder = async (orderId) => {
  try {
    const order = await Order.findByIdAndDelete(orderId);
    if (!order) throw new Error("Order not found.");
    return order;
  } catch (error) {
    throw new Error("Error deleting order: " + error.message);
  }
};

// 6. Lấy tất cả đơn hàng theo userId
const getOrdersByUserId = async (userId) => {
  try {
    const orders = await Order.find({ "user._id": userId }).sort({
      createdAt: -1,
    }); // Sắp xếp theo trường createdAt từ gần tới xa
    return orders;
  } catch (error) {
    throw new Error("Error fetching orders by user ID: " + error.message);
  }
};

// 7. Cập nhật trạng thái đơn hàng
const updateOrderStatus = async (orderId, orderStatusId) => {
  try {
    // Tìm trạng thái đơn hàng
    const orderStatusFind = await Order_Status.findById(orderStatusId);
    if (!orderStatusFind) throw new Error("Order status not found.");

    // Nếu trạng thái đơn hàng là "hủy" (ID này là giả sử của trạng thái hủy)
    if (orderStatusId === "6724f9c943ad843da1d31150") {
      const order = await Order.findById(orderId);
      if (!order) throw new Error("Order not found.");

      // Duyệt qua các sản phẩm trong đơn hàng để hoàn lại số lượng
      for (const product of order.products) {
        const foundProduct = await Product.findById(product._id);
        if (!foundProduct) throw new Error(`Product ${product._id} not found.`);

        const item = product.items;
        const productItem = foundProduct.items.find(
          (p) => p._id.toString() === item._id.toString()
        );

        if (!productItem) {
          throw new Error(
            `Item with ID ${item._id} not found in product ${foundProduct.name}.`
          );
        }

        const sizeVariation = productItem.variations.find(
          (v) => v._id.toString() === item.variations._id.toString()
        );

        if (!sizeVariation) {
          throw new Error(
            `Size variation with ID ${item.variations._id} not found in item ${foundProduct.name}.`
          );
        }

        // Hoàn lại số lượng khi đơn hàng bị hủy
        sizeVariation.quantity += product.quantity;
        await foundProduct.save();
      }
    }

    // Cập nhật trạng thái đơn hàng mới
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        order_status: { _id: orderStatusFind._id, name: orderStatusFind.name },
      },
      { new: true, runValidators: true }
    );

    if (!updatedOrder) throw new Error("Order not found.");
    return updatedOrder;
  } catch (error) {
    throw new Error("Error updating order status: " + error.message);
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  getOrdersByUserId,
  updateOrderStatus, // Xuất hàm updateOrderStatus ra
};
