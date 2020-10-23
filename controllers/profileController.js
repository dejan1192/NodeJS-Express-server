const User = require('../models/User');
const { createError } = require('../util/helperFunctions');
const Post = require('../models/Post');

exports.get_posts = async (req, res, next) => {

   const userId = req.params.id;
 
try {
  
    const posts = await Post.find({author:userId}).populate('author').sort({createdAt:-1});
   
    
    const numberOfUserPosts = await Post.countDocuments({author:userId});
        
    res.status(200).json({
        posts:posts,
        numberOfPosts:numberOfUserPosts
    })

} catch (error) {
    next(error);
}

  
};

exports.upload_image = async (req, res, next) => {
  
   const userId = req.userId;

   
    try {
        const file = req.file;
        

        const user = await User.findById(userId);
        
        if(!user){
            createError('User not found', 404);
        }
    
        if(file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/jpg' && file.mimetype !== 'image/png' ){
            createError('invalid filetype', 400);
        }
      
        user.imageUrl = file.filename;
        const saved = await user.save();

        res.status(200).json({
            msg:"Image uploaded",
            saved
        })

       
        

    } catch (error) {
        console.log(error);
        next(error);
    }
};


exports.get_user_profile = async (req, res, next) => {
    const userId = req.params.id;

    try {
        const user = await User.findOne({_id:userId});

        if(!user){
            createError('User does not exist', 400);
        }

        res.status(200).json({
            user
        })
    } catch (error) {
        next(error);
    }


};