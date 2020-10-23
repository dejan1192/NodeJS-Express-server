const { createError } = require('../util/helperFunctions');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

exports.isAuth = (req, res, next) => {

   
    const token = req.cookies.jwt;

    if(token){
        jwt.verify(token, process.env.SECRET, (err, decodedToken) => {
            if(err){
                createError('Invalid Token', 400);
            }

            req.userId = decodedToken.userId;
            next();
        })
    }else{
        createError('Not Authenticated', 401);
    }
};