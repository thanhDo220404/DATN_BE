var express = require("express");
var router = express.Router();
const mediaController = require("../mongo/media.controller");
const createUpload = require("../helper/upload");
//http://localhost:2204/media
router.get("/", async function (req, res, next) {
  try {
    const result = await mediaController.getAll();
    return res.status(200).json(result);
  } catch (error) {
    console.log("Lỗi lấy danh sách đơn vị hành chính");
    return res.status(500).json({ mess: error });
  }
});

const uploadToMedia = createUpload("./public/img/media");
router.post("/", uploadToMedia.single("file"), async function (req, res) {
  try {
    // Lấy thông tin từ body và file đã upload
    const body = req.body;
    const fileData = req.file;

    if (!fileData) {
      return res.status(400).json({ mess: "Không có file nào được upload" });
    }

    // Bổ sung thông tin file vào body trước khi insert
    const mediaData = {
      ...body, // Dữ liệu từ form
      fileName: fileData.filename, // Tên file sau khi upload
      filePath: `http://localhost:2204/img/media/${fileData.filename}`, // Đường dẫn file
      fileSize: fileData.size, // Kích thước file
      fileType: fileData.mimetype, // Kiểu file
    };

    // Gọi controller để lưu thông tin media vào DB
    const result = await mediaController.insert(mediaData);

    // Trả về kết quả thành công
    return res.status(200).json(result);
  } catch (error) {
    console.log("Lỗi insert: ", error);
    return res.status(500).json({ mess: "Lỗi trong quá trình lưu media" });
  }
});

module.exports = router;
