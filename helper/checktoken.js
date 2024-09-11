const jwt = require('jsonwebtoken');
const checktoken = (req, res, next)=>{
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Token không được cung cấp' });
        }else{
            //giai ma token
            //sai token, sai key, het han token
            jwt.verify(token, 'trieuhoa', (error, decode)=>{
                if (error) {
                    return res.status(401).json({ message: 'Token không hợp lệ' });
                }else{
                    //luu thong tin giai ma vao req de su dung o cac api khac
                    req.user = decode;
                    console.log('decode: ', decode);
                    next();
                }
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(401).json({ message: 'Token không hợp lệ' });
    }
}
module.exports = checktoken;