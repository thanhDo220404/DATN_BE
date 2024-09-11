const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const ProductSchema = new Schema({
    name: {type: String, required: true},
    price: {type: Number, required: true},
    discount: {type: Number, required: false, default: 0},
    hot:{type: Boolean, required: false, default: false},
    bestSeller:{type: Boolean, required: false, default: false},
    image: {type: String, required: true},
    description: {type: String, required: false},
    category: {
        type: {
            categoryId: {type: ObjectId, required: true},
            categoryName: {type: String, required: true},
        },
        required: true
    },
    // categoryId: {type: String, required: true},
    view: {type: Number, default: 0},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
});

module.exports = mongoose.models.product || mongoose.model('product', ProductSchema);