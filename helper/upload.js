// upload.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Hàm kiểm tra và tạo tên file không trùng
const generateUniqueFileName = (destinationPath, originalName) => {
  const ext = path.extname(originalName);
  const name = path.basename(originalName, ext);
  let fileName = originalName;
  let i = 1;

  // Lặp để kiểm tra nếu file đã tồn tại
  while (fs.existsSync(path.join(destinationPath, fileName))) {
    fileName = `${name}-${i}${ext}`;
    i++;
  }

  return fileName;
};

// Hàm tạo storage với đường dẫn tùy ý
const storage = (destinationPath) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, destinationPath); // Đường dẫn tới thư mục lưu trữ
    },
    filename: (req, file, cb) => {
      // Sử dụng hàm generateUniqueFileName để tránh trùng tên file
      const uniqueFileName = generateUniqueFileName(
        destinationPath,
        file.originalname
      );
      cb(null, uniqueFileName);
    },
  });

// Kiểm tra định dạng file
const checkFileType = (req, file, cb) => {
  const filetypes = /jpg|jpeg|png|gif|webp|avif/; // Các định dạng file hợp lệ
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Bạn chỉ được upload file hình ảnh"));
  }
};

// Hàm tạo upload cho thư mục cụ thể
const createUpload = (destinationPath) => {
  return multer({
    storage: storage(destinationPath),
    fileFilter: checkFileType,
  });
};

// Xuất hàm createUpload
module.exports = createUpload;
