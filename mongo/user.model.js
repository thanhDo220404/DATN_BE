const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const UserSchema = new Schema({
    name: {type: String, required: true},
    email: {type:String, required: true},
    pass: {type:String, required: true},
    phone: {type:String, required: true},
    role: {type:Number, default: 0}
});

module.exports = mongoose.models.user || mongoose.model('user', UserSchema);