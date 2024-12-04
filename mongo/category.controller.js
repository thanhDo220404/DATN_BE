const CategoryModel = require("./category.model"); // Đường dẫn đến mô hình Category

const insertCategory = async (categoryData) => {
  try {
    const { name, description } = categoryData;

    // Tạo một danh mục mới
    const newCategory = new CategoryModel({
      name,
      description,
    });

    // Lưu vào database
    const result = await newCategory.save();
    return result; // Trả về danh mục vừa tạo
  } catch (error) {
    console.error("Lỗi khi tạo danh mục:", error);
    throw error;
  }
};
const updateCategoryById = async (id, categoryData) => {
  try {
    const { name, description } = categoryData;

    const updatedCategory = await CategoryModel.findByIdAndUpdate(
      id,
      { name, description }, // Đối tượng chứa các trường cần cập nhật
      {
        new: true,
      }
    );

    if (!updatedCategory) {
      throw new Error("Danh mục không tồn tại");
    }

    return updatedCategory; // Trả về danh mục đã cập nhật
  } catch (error) {
    console.error("Lỗi khi cập nhật danh mục:", error);
    throw error;
  }
};
// Lấy tất cả danh mục
const getAllCategories = async () => {
  try {
    const categories = await CategoryModel.find();
    return categories; // Trả về danh sách danh mục
  } catch (error) {
    console.error("Lỗi khi lấy tất cả danh mục:", error);
    throw error;
  }
};

// Lấy danh mục theo ID
const getCategoryById = async (id) => {
  try {
    const category = await CategoryModel.findById(id);
    if (!category) {
      throw new Error("Danh mục không tồn tại");
    }
    return category; // Trả về danh mục theo ID
  } catch (error) {
    console.error("Lỗi khi lấy danh mục theo ID:", error);
    throw error;
  }
};

// Xóa danh mục
const deleteCategoryById = async (id) => {
  try {
    // Tìm và xóa danh mục theo ID
    const deletedCategory = await CategoryModel.findByIdAndDelete(id);
    if (!deletedCategory) {
      throw new Error("Danh mục không tồn tại");
    }

    return deletedCategory; // Trả về danh mục đã xóa
  } catch (error) {
    console.error("Lỗi khi xóa danh mục:", error);
    throw error;
  }
};

module.exports = {
  insertCategory,
  getAllCategories,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
};
