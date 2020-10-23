const User = require('../models/User');
const { createError, createToken } = require('../util/helperFunctions');
const { register_validation, login_validation } = require('../validation/userValidation');

exports.post_login = async(req, res, next) => {

    const { email, password } = req.body;
   

   try {
        const { error } = login_validation.validate({email, password});
        if(error){
         
            createError(error.details[0].message, 400);
 
         }

        const user = await User.login(email, password);
        if(!user){
            createError('User not found!', 404);
        }
        const token = createToken(user._id);
        res.cookie('jwt', token, {
            httpOnly:true,
            maxAge:24*60*60*1000
        })
        res.status(200).json({
            msg:"success",
            user:user._id
        })
   } catch (error) {
       
        next(error);
   }
};

exports.post_register = async (req, res, next) => {

    const { name, email, password } = req.body;
   
    try {
        const { error} = register_validation.validate({name, email, password});
      
        if(error){
      
        createError(error.details[0].message, 400);
 
         }
        const found = await User.findOne({email});
        if(found){
            createError('User with that email already exists!', 400);
        }
        const user = await User.register(name, email, password);
        res.status(201).json({
            msg:"success",
            user:user._id
        })

    } catch (error) {
        
        next(error);
    }
};

exports.get_user = async (req, res, next) => {

    try {
        const user = await User.findById(req.userId).select('-password').populate('posts');

        if(!user){
            createError('User not found', 404);
        }
        res.status(200).json({
            user
        });

    } catch (error) {
        
        next(error);
    }
};

exports.get_logout = (req, res, next) => {

    res.cookie('jwt', '', {
        maxAge:-1
    })
    res.status(200).json({
        msg:"success"
    })
};

