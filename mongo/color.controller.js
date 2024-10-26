const mongoose = require("mongoose");
const ColorModel = require("./color.model"); // Đảm bảo đường dẫn đúng đến model

module.exports = {
  insertColor,
  getAllColors,
  getColorById,
  updateColorById,
  deleteColorById,
};

// Thêm màu sắc mới
async function insertColor(body) {
  try {
    const { name, hexCode } = body;
    const newColor = new ColorModel({
      name,
      hexCode,
    });
    // Lưu vào cơ sở dữ liệu
    const result = await newColor.save();
    return result;
  } catch (error) {
    console.log("Lỗi insert màu sắc:", error);
    throw error;
  }
}

// Lấy tất cả màu sắc
async function getAllColors() {
  try {
    const result = await ColorModel.find();
    return result;
  } catch (error) {
    console.log("Lỗi lấy danh sách màu sắc:", error);
    throw error;
  }
}

// Lấy màu sắc theo ID
async function getColorById(id) {
  try {
    const result = await ColorModel.findById(id);
    if (!result) {
      throw new Error("Không tìm thấy màu sắc với ID đã cho.");
    }
    return result;
  } catch (error) {
    console.log("Lỗi lấy màu sắc theo ID:", error.message);
    throw error;
  }
}

// Cập nhật màu sắc theo ID
async function updateColorById(id, body) {
  try {
    const { name, hexCode } = body;
    const updatedColor = await ColorModel.findByIdAndUpdate(
      id,
      { name, hexCode },
      { new: true, runValidators: true } // Chạy kiểm tra validate
    );
    if (!updatedColor) {
      throw new Error("Không tìm thấy màu sắc để cập nhật.");
    }
    return updatedColor;
  } catch (error) {
    console.log("Lỗi cập nhật màu sắc:", error);
    throw error;
  }
}

// Xóa màu sắc theo ID
async function deleteColorById(id) {
  try {
    const result = await ColorModel.findOneAndDelete({ _id: id });
    if (!result) {
      throw new Error("Không tìm thấy màu sắc để xóa.");
    }
    return result;
  } catch (error) {
    console.log("Lỗi xóa màu sắc:", error);
    throw error;
  }
}
