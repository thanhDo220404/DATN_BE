const addressModel = require("./address.model");
module.exports = {
  getAll,
  getById,
  insert,
  getAllByUserId,
  deleteById,
  updateById,
};

async function getAll() {
  try {
    const result = await addressModel.find();
    return result;
  } catch (error) {
    console.log("Lỗi lấy danh sách địa chỉ");
    throw error;
  }
}
async function getById(id) {
  try {
    const result = await addressModel.findById(id);
    return result;
  } catch (error) {
    console.log("Lỗi lấy danh sách địa chỉ bằng id");
    throw error;
  }
}
async function insert(body) {
  try {
    const { name, phone, userId, address, specific_address, is_default } = body;

    // Kiểm tra địa chỉ mặc định hiện có
    const existingDefaultAddress = await addressModel.findOne({
      userId,
      is_default: true,
    });

    // Trường hợp 1: Không có địa chỉ nào tồn tại
    if (!existingDefaultAddress) {
      // Tạo địa chỉ mới với is_default là true
      const addressNew = new addressModel({
        name,
        phone,
        userId,
        address,
        specific_address,
        is_default: true, // Đặt is_default là true cho địa chỉ mới
      });
      // Lưu vào database
      return await addressNew.save();
    }

    // Trường hợp 2: Địa chỉ mặc định tồn tại và địa chỉ mới cũng is_default: true
    if (existingDefaultAddress && is_default) {
      const updateData = { is_default: false };
      await addressModel.findByIdAndUpdate(
        existingDefaultAddress._id,
        updateData,
        { new: true }
      );
    }

    // Trường hợp 3: Địa chỉ mặc định tồn tại và địa chỉ mới là is_default: false
    // Không cần làm gì, chỉ cần thêm địa chỉ mới
    // Tạo địa chỉ mới với is_default từ body
    const addressNew = new addressModel({
      name,
      phone,
      userId,
      address,
      specific_address,
      is_default, // Sử dụng giá trị is_default từ body
    });

    // Lưu vào database
    return await addressNew.save();
  } catch (error) {
    console.log("Lỗi insert: ", error);
    throw error;
  }
}
async function getAllByUserId(userId) {
  try {
    // Tìm tất cả các địa chỉ của người dùng dựa trên userId và sắp xếp
    const addresses = await addressModel
      .find({ userId })
      .sort({ is_default: -1 });

    return addresses; // Trả về danh sách địa chỉ đã sắp xếp
  } catch (error) {
    console.error("Lỗi khi lấy danh sách địa chỉ:", error);
    throw new Error("Có lỗi xảy ra khi lấy danh sách địa chỉ.");
  }
}
async function deleteById(id) {
  try {
    // Sử dụng phương thức findOneAndDelete để tìm và xóa sản phẩm dựa trên ID
    const result = await addressModel.findOneAndDelete({ _id: id });
    return result;
  } catch (error) {
    console.log("Loi delete", error);
    throw error;
  }
}
async function updateById(id, body) {
  try {
    // Tìm địa chỉ theo ID
    const addressById = await addressModel.findById(id);
    if (!addressById) {
      throw new Error("Không tìm thấy sản phẩm");
    }

    const { name, phone, userId, address, specific_address, is_default } = body;

    // Nếu địa chỉ được đặt làm mặc định, cập nhật tất cả các địa chỉ khác thành không mặc định
    if (is_default) {
      // Cập nhật tất cả các địa chỉ khác của người dùng thành không mặc định
      await addressModel.updateMany(
        { userId: userId, _id: { $ne: id } }, // Tìm tất cả địa chỉ của người dùng ngoại trừ địa chỉ hiện tại
        { is_default: false }
      );
    }

    // Cập nhật địa chỉ hiện tại
    const result = await addressModel.findByIdAndUpdate(
      id,
      { name, phone, userId, address, specific_address, is_default },
      { new: true } // Trả về bản cập nhật mới
    );

    return result; // Trả về địa chỉ đã được cập nhật
  } catch (error) {
    console.log("Lỗi update", error);
    throw error; // Ném lỗi để xử lý tiếp
  }
}
