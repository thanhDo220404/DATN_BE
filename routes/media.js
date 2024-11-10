const express = require("express");
const router = express.Router();
const mediaController = require("../mongo/media.controller");
const createUpload = require("../helper/upload");

const uploadToMedia = createUpload("./public/img/media");

// Route để lấy danh sách media
// http://localhost:2204/media
router.get("/", async (req, res) => {
  try {
    const mediaList = await mediaController.getAll();
    res.status(200).json(mediaList);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách media:", error);
    res.status(500).json({ message: "Đã xảy ra lỗi khi lấy danh sách media" });
  }
});

// Route để upload media mới
router.post("/", uploadToMedia.single("file"), async (req, res) => {
  try {
    const { body } = req;
    const uploadedFile = req.file;

    if (!uploadedFile) {
      return res.status(400).json({ message: "Không có file nào được upload" });
    }

    const mediaData = {
      ...body, 
      fileName: uploadedFile.filename, 
      filePath: `http://localhost:2204/img/media/${uploadedFile.filename}`, 
      fileSize: uploadedFile.size, 
      fileType: uploadedFile.mimetype, 
    };

    const savedMedia = await mediaController.insert(mediaData);
    res.status(201).json(savedMedia);
  } catch (error) {
    console.error("Lỗi khi lưu media:", error);
    res.status(500).json({ message: "Đã xảy ra lỗi khi lưu media" });
  }
});

module.exports = router;
