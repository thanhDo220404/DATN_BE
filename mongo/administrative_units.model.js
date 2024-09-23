//Kết nối collection categories
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Administrative_units = new Schema({});

module.exports =
  mongoose.models.Administrative_units ||
  mongoose.model("administrative_units", Administrative_units);
