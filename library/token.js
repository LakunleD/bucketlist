const jwt = require('jsonwebtoken');

const jwt_secret = process.env.JWT_SECRET;

let create_token = (userObj) => {
    return new Promise((resolve, reject) => {
        jwt.sign(JSON.stringify(userObj), jwt_secret, (err, token) => {
            if (err) {
                reject(err);
            }
            resolve(token);
        });
    });
};

let verify_token = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];

    if (typeof bearerHeader !== "undefined") {
        const bearer = bearerHeader.split(' ');
        const token = bearer[1];

        jwt.verify(token, jwt_secret, (err, decoded) => {
            if (err) {
                next(err);
            }
            req.token = decoded;
            next();
        });
    }
    else {
        res.status(403).send({message: 'user token not found'});
    }
};

let tokenManagement = {
    createToken: create_token,
    verifyToken: verify_token
};


module.exports = tokenManagement;
