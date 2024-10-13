var express = require("express");
var router = express.Router();
const addressController = require("../mongo/address.controller");
//http://localhost:2204/administrative_units
router.get("/", async function (req, res, next) {
  try {
    const result = await addressController.getAll();
    return res.status(200).json(result);
  } catch (error) {
    console.log("Lỗi lấy danh sách đơn vị hành chính");
    return res.status(500).json({ mess: error });
  }
});

router.get("/:id", async function (req, res) {
  try {
    const { id } = req.params;
    const result = await addressController.getById(id);
    return res.status(200).json(result);
  } catch (error) {
    console.log("Lỗi lấy đơn vị hành chính bằng id");
    return res.status(500).json({ mess: error });
  }
});
router.post("/insert", async function (req, res) {
  try {
    const body = req.body;
    const result = await addressController.insert(body);
    return res.status(200).json(result);
  } catch (error) {
    console.log("Loi insert: ", error);
    return res.status(500).json({ mess: error });
  }
});
router.get("/user/:userId", async function (req, res) {
  try {
    const { userId } = req.params;
    const result = await addressController.getAllByUserId(userId);
    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await addressController.deleteById(id);
    return res.status(200).json({ addressDeleted: result });
  } catch (error) {
    console.log("loi delele: ", error);
    return res.status(500).json({ mess: error });
  }
});
//update bằng id
router.post("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const result = await addressController.updateById(id, body);
    return res.status(200).json({ addressNew: result });
  } catch (error) {
    console.log("loi update: ", error);
    return res.status(500).json({ mess: error });
  }
});
module.exports = router;
