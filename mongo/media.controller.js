const mediaModel = require("./media.model");
module.exports = {
  getAll,
  insert,
};

async function getAll() {
  try {
    const result = await mediaModel.find();
    return result;
  } catch (error) {
    console.log("Lỗi lấy danh sách địa chỉ");
    throw error;
  }
}
async function insert(body) {
  try {
    const { fileName, fileSize, fileType, filePath } = body;

    // Kiểm tra nếu các trường bắt buộc không được cung cấp
    if (!fileName || !fileSize || !fileType || !filePath) {
      throw new Error("File và filePath là bắt buộc!");
    }

    // Tạo đối tượng media mới
    const newMedia = new mediaModel({
      fileName,
      fileSize,
      fileType,
      filePath,
    });

    // Lưu vào cơ sở dữ liệu
    await newMedia.save();

    // Trả về phản hồi thành công
    return {
      message: "Media đã được chèn thành công!",
      media: newMedia,
    };
  } catch (error) {
    console.error("Lỗi khi chèn media:", error);
    throw new Error("Lỗi server. Vui lòng thử lại!");
  }
}
