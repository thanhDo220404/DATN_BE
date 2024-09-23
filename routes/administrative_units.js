var express = require("express");
var router = express.Router();
const administrative_units_controller = require("../mongo/administrative_units.controller");

router.get("/", async function (req, res, next) {
  try {
    const result = await administrative_units_controller.getAll();
    return res.status(200).json(result);
  } catch (error) {
    console.log("Lỗi lấy danh sách đơn vị hành chính");
    return res.status(500).json({ mess: error });
  }
});

router.get("/:id", async function (req, res) {
  try {
    const { id } = req.params;
    const result = await administrative_units_controller.getById(id);
    return res.status(200).json(result);
  } catch (error) {
    console.log("Lỗi lấy đơn vị hành chính bằng id");
    return res.status(500).json({ mess: error });
  }
});

module.exports = router;
