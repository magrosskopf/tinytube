const jwt = require('jsonwebtoken');
const JWT_Key = 'saltAndPepper';
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decode = jwt.verify(token, JWT_Key);
        req.userData = decode;
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Auth failed'
        })
    }
}