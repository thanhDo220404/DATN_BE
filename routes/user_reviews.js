const express = require("express");
const router = express.Router();
const {
  createReview,
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview,
} = require("../mongo/user_reviews.controller");

// Route tạo review mới
router.post("/", createReview);

// Route lấy tất cả review
router.get("/", getAllReviews);

// Route lấy review theo ID
router.get("/:id", getReviewById);

// Route cập nhật review
router.put("/:id", updateReview);

// Route xóa review
router.delete("/:id", deleteReview);

module.exports = router;
