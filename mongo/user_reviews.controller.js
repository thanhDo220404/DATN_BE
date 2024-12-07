const UserReviews = require("./user_reviews.model");
const OrderModel = require("./order.model");

const createReview = async (req, res) => {
  try {
    const { order, user, product, rating, comment } = req.body;

    // Kiểm tra thông tin order
    if (!order || !order._id) {
      return res.status(400).json({ message: "Invalid order data" });
    }

    // Kiểm tra đơn hàng tồn tại
    const existingOrder = await OrderModel.findById(order._id);
    if (!existingOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Lấy danh sách sản phẩm từ đơn hàng
    const orderProducts = existingOrder.products.map((p) => p._id.toString());

    // Kiểm tra sản phẩm có trong đơn hàng không
    if (!orderProducts.includes(product._id)) {
      return res.status(400).json({
        message: `Sản phẩm với id: ${product._id} không có trong đơn hàng`,
      });
    }

    // Kiểm tra nếu đã có review cho sản phẩm trong đơn hàng
    const existingReview = await UserReviews.findOne({
      "order._id": order._id,
      "product._id": product._id,
    });

    if (existingReview) {
      return res.status(400).json({
        message: `Sản phẩm có id: ${existingReview.product._id} đã có một review dành cho đơn hàng`,
      });
    }

    // Nếu tất cả hợp lệ, tạo review
    const newReview = new UserReviews({
      order,
      user,
      product,
      rating,
      comment,
    });

    const savedReview = await newReview.save();
    res.status(200).json(savedReview);
  } catch (error) {
    res.status(500).json({ message: "Error creating review", error });
  }
};

// Lấy tất cả review
const getAllReviews = async (req, res) => {
  try {
    const reviews = await UserReviews.find().sort({
      createdAt: -1,
    });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reviews", error });
  }
};

// Lấy review theo ID
const getReviewById = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await UserReviews.findById(id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ message: "Error fetching review", error });
  }
};

// Cập nhật review
const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { user, products, rating_value, comment } = req.body;

    const updatedReview = await UserReviews.findByIdAndUpdate(
      id,
      { user, products, rating_value, comment },
      { new: true, runValidators: true }
    );

    if (!updatedReview) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.status(200).json(updatedReview);
  } catch (error) {
    res.status(500).json({ message: "Error updating review", error });
  }
};

// Xóa review
const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedReview = await UserReviews.findByIdAndDelete(id);

    if (!deletedReview) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting review", error });
  }
};

module.exports = {
  createReview,
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview,
};
