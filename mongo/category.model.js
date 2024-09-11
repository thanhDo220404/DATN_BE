//Kết nối collection categories
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const CategorySchema = new Schema({
    name: {type: String, required: true},
    image: {type: String, required: false, defaultValue: 'image'},
    status: {type: Number, required: false, defaultValue: 1},
    description: {type: String, required: false, defaultValue: 'description'},
});

module.exports = mongoose.models.category || mongoose.model('category', CategorySchema);