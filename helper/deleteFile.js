// fileHelper.js - Sửa lại hàm xóa file sử dụng async/await
const fs = require("fs").promises; // Sử dụng fs.promises để làm việc với promises
const path = require("path");

const deleteFile = async (destinationPath, fileName) => {
  const filePath = path.join(destinationPath, fileName); // Đường dẫn file cần xóa

  try {
    // Kiểm tra xem file có tồn tại không
    await fs.access(filePath);

    // Xóa file
    await fs.unlink(filePath);

    console.log(`File ${fileName} đã được xóa thành công.`);
  } catch (error) {
    throw new Error("Không thể xóa file!"); // Ném lỗi nếu có vấn đề
  }
};

module.exports = deleteFile;
