const administrative_units_model = require("./administrative_units.model");
module.exports = { getAll, getById };

async function getAll() {
  try {
    const result = await administrative_units_model.find();
    return result;
  } catch (error) {
    console.log("Lỗi lấy danh sách đơn vị hành chính");
    throw error;
  }
}
async function getById(id) {
  try {
    const result = await administrative_units_model.findById(id);
    return result;
  } catch (error) {
    console.log("Lỗi lấy đơn vị hành chính bằng id");
    throw error;
  }
}
