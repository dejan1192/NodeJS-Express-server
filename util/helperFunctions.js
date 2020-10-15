const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

exports.createError = (msg, code) => {

    const error = new Error(msg);
    error.status = code;
    throw error;
};

exports.createToken = (userId) => {
    return jwt.sign({userId}, process.env.SECRET,{
        expiresIn:24*60*60
    });
}