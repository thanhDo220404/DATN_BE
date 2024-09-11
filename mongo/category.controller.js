//thực hiện thao tác CRUD với mongoBD
const mongoose = require('mongoose');
const productModel = require('./product.model');
const categoryModel = require('./category.model');


module.exports = {insert, getAll, updateById, getCategoryById, removeById};

async function insert(body){
    try {
        const {name, description} = body;
        const cateNew = new categoryModel({
            name, description
        });
        //luu vao database
        const result = await cateNew.save();
        return result;
    } catch (error) {
        console.log("Loi insert: ", error);
        throw error;
    }
};

async function getAll(){
    try {
        const result = await categoryModel.find();
        return result;
    } catch (error) {
        console.log("Loi lay danh sach danh mục")
        throw error;
    }
}

async function getCategoryById(id){
    try {
        const result = await categoryModel.findById(id);
        return result;
    } catch (error) {
        console.log("Lỗi lấy danh mục theo id:", error.message);
        throw error;
    }
}

//cap nhat san pham theo id
async function updateById(id, body){
    try {
        const cate = await categoryModel.findById(id);
        if (!cate) {
            throw new Error("khong tim thay san pham")
        }
        const {name, description} = body;
        const result = categoryModel.findByIdAndUpdate(id,
            {name, description},
            {new: true});
        return result;
    } catch (error) {
        console.log("Loi update", error);
        throw error;
    }
}
async function removeById(id){
    try {
        // Sử dụng phương thức findOneAndDelete để tìm và xóa sản phẩm dựa trên ID
        const result = await categoryModel.findOneAndDelete({ _id: id });
        return result;
    } catch (error) {
        console.log("Loi delete", error);
        throw error;
    }
}