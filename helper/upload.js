const multer = require('multer');

// Them San Pham + img
var storage = multer.diskStorage({
    destination: (req, file, cb)=> {
        cb(null, './public/img')
    },
    filename: (req, file, cb) =>{
        cb(null, file.originalname)
    }
});
//kiểm tra định dạng file hình ảnh
var checkFile = (req, file, cb) => {
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)){
        return cb(new Error('Bạn chỉ được upload file hình ảnh'))
    }
    cb(null, true)
};
const upload = multer({storage: storage, fileFilter: checkFile})
module.exports = upload;