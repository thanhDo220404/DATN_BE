var express = require("express");
var router = express.Router();
var userModel = require("../mongo/user.model");
var userController = require("../mongo/user.controller");
const jwt = require("jsonwebtoken");

/* GET users listing. */
//http://localhost:3000/users
router.get("/", async function (req, res, next) {
  try {
    const result = await userController.getAll();
    return res.status(200).json({ Users: result });
  } catch (error) {
    console.log("Loi lay danh sach danh muc");
    return res.status(500).json({ mess: error });
  }
});
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await userController.getUserById(id);
    return res.status(200).json({ User: result });
  } catch (error) {
    console.log("Loi lay danh muc bang id: ", error);
    return res.status(500).json({ mess: error });
  }
});
//http://localhost:3000/users/register
router.post("/register", async (req, res) => {
  try {
    const body = req.body;
    const result = await userController.register(body);
    return res.status(200).json({ NeuUser: result });
  } catch (error) {
    console.log("Loi dang ky", error);
    return res.status(500).json({ mess: error });
  }
});
router.get("/verify/:token", async (req, res) => {
  const { token } = req.params;
  try {
    const decoded = jwt.verify(token, "secretKey"); // Chỉnh sửa secretKey theo nhu cầu của bạn
    const user = await userModel.findOne({ email: decoded.email });
    if (!user) {
      return res.status(400).json({ message: "Người dùng không tồn tại" });
    }
    user.isVerified = true; // Đánh dấu người dùng là đã xác nhận
    user.verificationToken = null; // Xóa mã xác nhận
    await user.save();
    return res.status(200).json({ message: "Xác nhận email thành công!" });
  } catch (error) {
    console.error("Lỗi xác nhận email:", error);
    return res.status(500).json({ message: "Lỗi xác nhận email" });
  }
});

//http://localhost:3000/users/login
router.post("/login", async (req, res) => {
  try {
    const body = req.body;
    const result = await userController.login(body);
    return res.status(200).json({ user: result });
  } catch (error) {
    console.log("Loi dang nhap", error);
    return res.status(500).json({ mess: error });
  }
});
//http://localhost:3000/users/update/:id
router.post("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const userNew = await userController.updateById(id, body);
    return res.status(200).json({ userNew: userNew });
  } catch (error) {
    console.log("loi update: ", error);
    return res.status(500).json({ mess: error });
  }
});
//http://localhost:3000/users/delete/:id
router.get("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await userController.removeById(id);
    return res.status(200).json({ userDelete: result });
  } catch (error) {
    console.log("loi delele: ", error);
    return res.status(500).json({ mess: error });
  }
});
//http://localhost:3000/users/forgot
router.post("/forgot", async (req, res) => {
  try {
    const emailForgot = req.body.emailForgot;
    const newPass = userController.generateRandomNumberString(10);
    const checkMail = await userController.checkEmailExistence(emailForgot);
    if (checkMail.exists) {
      await userController.sendForgotPasswordEmail(
        emailForgot,
        `<h1 style="color: red;">${newPass}</h1>`
      );
      await userController.resetPass(checkMail.userId, newPass);
    } else {
      return res.status(200).json("co cai nit");
    }
  } catch (error) {
    console.log("loi sendMail: ", error);
    return res.status(500).json({ mess: error });
  }
});
module.exports = router;
