const jwt = require('jsonwebtoken');

const verifyToken = async ({req}) => {
    try {
        if(req.body.operationName == 'IntrospectionQuery'||
        req.body.operationName=='Login'||
        req.body.operationName=='GetAllProducts'||
        req.body.operationName=='GetProductIds'||
        req.body.operationName=='GetProductItems'){
            return{}
        }
        const token = req.headers.authorization;
        if (!token) {
            throw new Error('Access denied. Token is missing.');
        }
        const decoded = jwt.verify(token, process.env.JWT_PASS);
        const userId = decoded._id;
        return { userId };
    } catch (error) {
        return { userId:"Invalid Token" };
        // If token verification fails, throw an error
        // throw new Error('Invalid Token');
    }
};

module.exports = verifyToken;
