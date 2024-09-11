//thực hiện thao tác CRUD với mongoBD
const mongoose = require('mongoose');
const productModel = require('./product.model');
const categoryModel = require('./category.model');



module.exports = {insert, getAll, getByKey, updateById, removeById, 
                getNewProduct, getProductById, getProductsByIdCate, 
                increaseViewCount, getProductsByView, getProductsByPrice,
                paginateProducts, searchProducts};

async function insert(body){
    try {
        const {name, price, image, hot, bestSeller, discount, description, category} = body;
        //tim thong tin danh muc theo id danh muc tra trong collection category
        const categoryFind = await categoryModel.findById(category); 
        if (!categoryFind) {
            throw new Error("Không tìm thấy danh mục");
        }else{
            const proNew = new productModel({
                name, price, image, description, hot, bestSeller, discount,
                category:{
                    categoryId: categoryFind._id,
                    categoryName: categoryFind.name
                }
            });
            //luu vao database
            const result = await proNew.save();
            return result;
        }
    } catch (error) {
        console.log("Loi insert: ", error);
        throw error;
    }
};

async function getAll(){
    try {
        const result = await productModel.find();
        return result;
    } catch (error) {
        console.log("Loi lay danh sach san pham")
        throw error;
    }
}
async function getProductById(id){
    try {
        const result = await productModel.findById(id);
        return result;
    } catch (error) {
        console.log("Lỗi lấy sản phẩm theo id:", error.message);
        throw error;
    }
}
async function getNewProduct(){
    try {
        const result = await productModel.find().sort({createdAt: -1}).limit(5);
        return result;
    } catch (error) {
        console.log("Loi lay danh sach san pham")
        throw error;
    }
}
//lay san pham theo key
async function getByKey(key, value){
    try {
        const result = await productModel.findOne({[key]:value});
        return result;
    } catch (error) {
        console.log('loi lay san pham theo key: ', error);
        throw error;
    }
}
//cap nhat san pham theo id
async function updateById(id, body){
    try {
        const pro = await productModel.findById(id);
        if (!pro) {
            throw new Error("khong tim thay san pham")
        }
        const {name, price, quantity, image, description, category} = body;
        let categoryFind = null;
        if (category) {
            categoryFind = await categoryModel.findById(category);
            if (!categoryFind) {
                throw new Error("khong tim thay danh muc")
            }
        }
        const categoryUpdate = categoryFind?{
            categoryId: categoryFind._id,
            categoryName: categoryFind.name
        }:pro.category;
        const result = await productModel.findByIdAndUpdate(id,
            {name, price, quantity, image, description, category:categoryUpdate},
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
        const result = await productModel.findOneAndDelete({ _id: id });
        return result;
    } catch (error) {
        console.log("Loi delete", error);
        throw error;
    }
}

async function getProductsByIdCate(idCate, productId = null, limit = null){
    try {
        // const query = { 'category.categoryId': idCate };
        const query = { 'categoryId': idCate };
        
        // Nếu có productId, thêm điều kiện lọc
        if(productId !== null){
            query['_id'] = { $ne: productId };
        }
        
        let findQuery = productModel.find(query);
        
        // Nếu có giới hạn, áp dụng giới hạn
        if(limit !== null){
            findQuery = findQuery.limit(limit);
        }

        // Sắp xếp theo createDate tăng dần
        findQuery = findQuery.sort({ createAt: 1 });

        const result = await findQuery.exec();
        return result;
    } catch (error) {
        console.log("Loi lay danh sach san pham")
        throw error;
    }
}
async function increaseViewCount(id) {
    try {
        const product = await productModel.findById(id);
        if (!product) {
            throw new Error('Sản phẩm không tồn tại');
        }

        // Tăng số lượt xem của sản phẩm
        product.view += 1;

        // Lưu sản phẩm đã được cập nhật vào cơ sở dữ liệu
        await product.save();

        return { success: true, message: 'Số lượt xem của sản phẩm đã được tăng' };
    } catch (error) {
        console.error('Lỗi khi tăng số lượt xem của sản phẩm:', error.message);
        return { success: false, message: 'Đã xảy ra lỗi khi tăng số lượt xem của sản phẩm' };
    }
}
async function getProductsByView(key,limit){
    try {
        const result = await productModel.find({}).sort({ view: key}).limit(limit);
        return result;
    } catch (error) {
        console.log("Loi lay danh sach san pham")
        throw error;
    }
}
async function getProductsByPrice(key,limit){
    try {
        const result = await productModel.find({}).sort({ price: key}).limit(limit);
        return result;
    } catch (error) {
        console.log("Loi lay danh sach san pham")
        throw error;
    }
}

async function paginateProducts(page, perPage) {
    try {
        const products = await productModel.find()
            .skip((perPage * page) - perPage)
            .limit(perPage);
        const count = await productModel.countDocuments();
        
        const totalPages = Math.ceil(count / perPage);

        return {
            Products: products,
            currentPage: page,
            totalPages: totalPages
        };
    } catch (err) {
        console.error('Lỗi khi lấy sản phẩm:', err);
        throw new Error('Đã xảy ra lỗi khi lấy sản phẩm');
    }
}
async function searchProducts(keyword){
    try {
        const regex = new RegExp(keyword, 'i');

        const criteria = {
            $or: [
                { name: { $regex: regex } }, // Tìm kiếm trong trường name
                { description: { $regex: regex } }, // Tìm kiếm trong trường description
                { 'category.categoryName': { $regex: regex } } // Tìm kiếm trong trường categoryName
            ]
        };

        const result = await productModel.find(criteria);
        return result;
    } catch (error) {
        console.log("Loi lay danh sach san pham")
        throw error;
    }
}