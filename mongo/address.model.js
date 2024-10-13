const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WardSchema = new Schema({
  id: String,
  name: String,
  prefix: String,
});

const DistrictSchema = new Schema({
  id: String,
  name: String,
  ward: WardSchema, // Ward nằm trong District
});

const AddressSchema = new Schema({
  name: String,
  userId: String,
  phone: String,
  address: {
    id: String,
    name: String,
    district: DistrictSchema, // District nằm trong Address
  },
  specific_address: String,
  is_default: Boolean,
});

module.exports =
  mongoose.models.Address || mongoose.model("Address", AddressSchema);
