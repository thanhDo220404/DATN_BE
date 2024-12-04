const UserReviews = require("./user_reviews.model");

// Tạo review mới
const createReview = async (req, res) => {
  try {
    const { user, products, rating_value, comment } = req.body;

    const newReview = new UserReviews({
      user,
      products,
      rating_value,
      comment,
    });

    const savedReview = await newReview.save();
    res.status(201).json(savedReview);
  } catch (error) {
    res.status(500).json({ message: "Error creating review", error });
  }
};

// Lấy tất cả review
const getAllReviews = async (req, res) => {
  try {
    const reviews = await UserReviews.find();
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
