const mongoose = require("mongoose");
const SizeModel = require("./size.model"); // Đảm bảo đường dẫn đúng đến model

module.exports = {
  insertSize,
  getAllSizes,
  getSizeById,
  updateSizeById,
  deleteSizeById,
};

// Thêm kích thước mới
async function insertSize(body) {
  try {
    const { name, value } = body;
    const newSize = new SizeModel({
      name,
      value,
    });
    // Lưu vào cơ sở dữ liệu
    const result = await newSize.save();
    return result;
  } catch (error) {
    console.log("Lỗi insert kích thước:", error);
    throw error;
  }
}

// Lấy tất cả kích thước
async function getAllSizes() {
  try {
    const result = await SizeModel.find();
    return result;
  } catch (error) {
    console.log("Lỗi lấy danh sách kích thước:", error);
    throw error;
  }
}

// Lấy kích thước theo ID
async function getSizeById(id) {
  try {
    const result = await SizeModel.findById(id);
    if (!result) {
      throw new Error("Không tìm thấy kích thước với ID đã cho.");
    }
    return result;
  } catch (error) {
    console.log("Lỗi lấy kích thước theo ID:", error.message);
    throw error;
  }
}

// Cập nhật kích thước theo ID
async function updateSizeById(id, body) {
  try {
    const { name, value } = body; // Cập nhật thêm trường mô tả nếu cần
    const updatedSize = await SizeModel.findByIdAndUpdate(
      id,
      { name, value },
      { new: true, runValidators: true } // Chạy kiểm tra validate
    );
    if (!updatedSize) {
      throw new Error("Không tìm thấy kích thước để cập nhật.");
    }
    return updatedSize;
  } catch (error) {
    console.log("Lỗi cập nhật kích thước:", error);
    throw error;
  }
}

// Xóa kích thước theo ID
async function deleteSizeById(id) {
  try {
    const result = await SizeModel.findOneAndDelete({ _id: id });
    if (!result) {
      throw new Error("Không tìm thấy kích thước để xóa.");
    }
    return result;
  } catch (error) {
    console.log("Lỗi xóa kích thước:", error);
    throw error;
  }
}
