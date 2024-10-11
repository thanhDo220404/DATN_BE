const userModel = require("./user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
module.exports = {
  getAll,
  register,
  sendVerificationEmail,
  updateById,
  removeById,
  login,
  getUserById,
  checkEmailExistence,
  sendForgotPasswordEmail,
  resetPass,
  generateRandomNumberString,
};

async function getAll() {
  try {
    const result = await userModel.find();
    return result;
  } catch (error) {
    console.log("Loi lay danh sach user");
    throw error;
  }
}
async function getUserById(id) {
  try {
    const result = await userModel.findById(id);
    return result;
  } catch (error) {
    console.log("Lỗi lấy user theo id:", error.message);
    throw error;
  }
}

// Cập nhật thông tin người dùng theo ID và trả về token
async function updateById(id, body) {
  try {
    const user = await userModel.findById(id);
    if (!user) {
      throw new Error("Không tìm thấy người dùng");
    }

    const { name, email, image, pass, phone } = body;
    let hash;

    // Tạo mật khẩu mới chỉ khi mật khẩu được cung cấp
    if (pass) {
      const salt = bcrypt.genSaltSync(10);
      hash = bcrypt.hashSync(pass, salt);
    }

    // Tạo đối tượng chứa thông tin cập nhật
    const updateData = {
      name,
      email,
      image,
      phone,
    };

    // Nếu có mật khẩu mới, thêm vào đối tượng cập nhật
    if (hash) {
      updateData.pass = hash;
    }

    // Cập nhật thông tin người dùng
    const result = await userModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    // Tạo token JWT
    const token = jwt.sign(
      {
        _id: result._id,
        name: result.name,
        email: result.email,
        image: result.image,
        phone: result.phone,
        role: user.role,
      }, // payload
      "trieuhoa", // secret key (cần được lưu trữ trong biến môi trường)
      { expiresIn: "1h" } // thời gian hết hạn của token
    );

    // Trả về thông tin người dùng đã cập nhật cùng với token
    return { user: result, token };
  } catch (error) {
    console.log("Lỗi cập nhật:", error);
    throw error;
  }
}

async function register(body) {
  try {
    const { name, email, pass, phone } = body;
    const mail = await userModel.findOne({ email: email });
    if (mail) {
      throw new Error("Email da ton tai");
    }
    //tao pass
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(pass, salt);

    // Tạo mã xác nhận ngẫu nhiên
    const verificationToken = jwt.sign({ email }, "secretKey", {
      expiresIn: "1h",
    }); // Chỉnh sửa secretKey theo nhu cầu của bạn

    //Tao user moi
    const user = new userModel({
      name,
      email,
      pass: hash,
      phone,
      verificationToken,
    });
    //luu db
    const result = await user.save();

    // Gửi email xác nhận
    await sendVerificationEmail(email, verificationToken);

    return result;
  } catch (error) {}
}
async function sendVerificationEmail(email, verificationToken) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "chodenmot@gmail.com", // Tài khoản SMTP của bạn
      pass: "ntzvyougnhjizjbh", // Mật khẩu SMTP của bạn
    },
  });

  const verificationLink = `http://localhost:3000/user/verify/${verificationToken}`; // Địa chỉ liên kết xác nhận

  const mailOptions = {
    from: "chodenmot@gmail.com",
    to: email, // Địa chỉ email nhận
    subject: "Xác nhận địa chỉ email",
    html: `<p>Vui lòng xác nhận địa chỉ email của bạn bằng cách nhấp vào liên kết dưới đây:</p>
               <a href="${verificationLink}">Xác nhận email</a>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email xác nhận đã được gửi tới:", email);
  } catch (error) {
    console.error("Lỗi gửi email xác nhận:", error);
  }
}
async function removeById(id) {
  try {
    //tao dieu kien kiem tra neu co san pham thi khong cho xoa
    // Sử dụng phương thức findOneAndDelete để tìm và xóa sản phẩm dựa trên ID
    const result = await userModel.findOneAndDelete({ _id: id });
    return result;
  } catch (error) {
    console.log("Loi delete", error);
    throw error;
  }
}

async function login(body) {
  try {
    const { email, pass } = body;
    let user = await userModel.findOne({ email: email });
    if (!user) {
      throw new Error("Email khong ton tai");
    }
    //kiem tra pass
    const checkpass = bcrypt.compareSync(pass, user.pass);
    if (!checkpass) {
      throw new Error("Mat khau khong chinh xac");
    }
    //xoa field pass
    delete user._doc.pass;
    //tao token
    const token = jwt.sign(
      {
        _id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
        phone: user.phone,
        role: user.role,
      },
      "trieuhoa", // key secret
      { expiresIn: 1 * 1 * 60 * 60 } // thoi gian het han cua token = 60s
    );
    user = { ...user._doc, token };
    return user;
  } catch (error) {
    console.log("Loi login", error);
    throw error;
  }
}
// Hàm kiểm tra email có tồn tại trong cơ sở dữ liệu hay không
async function checkEmailExistence(email) {
  try {
    const user = await userModel.findOne({ email: email }); // Tìm user với email tương ứng
    if (user) {
      return { exists: true, userId: user._id }; // Trả về true và userId nếu user tồn tại
    } else {
      return { exists: false, userId: null }; // Trả về false và null nếu user không tồn tại
    }
  } catch (error) {
    console.error("Lỗi khi kiểm tra email:", error);
    return { exists: false, userId: null }; // Trả về false và null nếu có lỗi xảy ra
  }
}

// Hàm gửi email quên mật khẩu và kiểm tra tồn tại email
async function sendForgotPasswordEmail(email, newPassword) {
  // Tạo một transporter với cấu hình SMTP
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", // Thay thế bằng địa chỉ SMTP server của bạn
    port: 587, // Port của SMTP server
    secure: false, // true nếu bạn sử dụng SSL/TLS
    auth: {
      user: "chodenmot@gmail.com", // Tài khoản SMTP của bạn
      pass: "ntzvyougnhjizjbh", // Mật khẩu SMTP của bạn
    },
  });

  // Nội dung email
  const mailOptions = {
    from: "chodenmot@gmail.com", // Địa chỉ email gửi
    to: email, // Địa chỉ email nhận
    subject: "Yêu cầu đặt lại mật khẩu",
    html: `Mật khẩu mới của bạn là: ${newPassword}`, // Nội dung email
  };

  try {
    // Gửi email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    return true; // Trả về true nếu gửi email thành công
  } catch (error) {
    console.error("Error sending email:", error);
    return false; // Trả về false nếu gửi email thất bại
  }
}
async function resetPass(id, pass) {
  try {
    const user = await userModel.findById(id);
    if (!user) {
      throw new Error("Không tìm thấy người dùng");
    }
    let hash;
    if (pass) {
      const salt = bcrypt.genSaltSync(10);
      hash = bcrypt.hashSync(pass, salt);
    }
    // Cập nhật mật khẩu mới của người dùng
    user.pass = hash;
    const result = await user.save();
    return result;
  } catch (error) {
    console.log("Lỗi cập nhật:", error);
    throw error;
  }
}
function generateRandomNumberString(length) {
  let randomNumberString = "";
  for (let i = 0; i < length; i++) {
    const randomNumber = Math.floor(Math.random() * 10); // Tạo số ngẫu nhiên từ 0 đến 9
    randomNumberString += randomNumber.toString(); // Chuyển số nguyên thành chuỗi và thêm vào chuỗi kết quả
  }
  return randomNumberString;
}
