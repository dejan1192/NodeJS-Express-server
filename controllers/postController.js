const Post = require('../models/Post');
const { createError } = require('../util/helperFunctions');
const { post_validation } = require('../validation/postValidation');
const User = require('../models/User');

exports.get_posts = async (req, res, next) => {

    try {
        
        const posts = await Post.find()
                            .populate({
                                    path:'author',
                                    select:'-password'
                                })
                             .sort({createdAt: -1});
        const recentPosts = await Post.find().populate({
            path:'author',
            select:'-password'
        }).sort({createdAt:-1}).limit(3);

        res.status(200).json({
            posts,
            recentPosts
        })
    } catch (error) {
        
        next(error);
    }
};

exports.get_post = async (req, res, next) => {

    const postId = req.params.id;

    try {
        
        const post = await Post.findById(postId)
                                .populate({
                                    path:'author',
                                    select:'-password'
                                })
                                

        if(!post){

            createError('Post not found', 404);
        }

        res.status(200).json({
            post
        })

    } catch (error) {
        
        next(error);
    }
}

exports.create_post = async (req, res, next) => {
   
   
    const { title, content } = req.body;
    const image = req.file;
    

    try {
        const author = await User.findById(req.userId);
       const authorId = author._id;
        const { error } = post_validation.validate({title, content});
        if(error){
           
            createError(error.details[0].message, 400);
 
         }
      

        const newPost = await Post.create({
            title,
            content,
            author:authorId
        });
        if(image) {
            newPost.imageUrl = image.filename;
          
        }
        
        const post = await newPost.save();
        author.posts.push(post._id);
        const postAuthor = await author.save();
        if(!author){
            createError('There was a problem with saving your posts', 500);
        }

        post.author = postAuthor;
       
        res.status(201).json({
            post:post
        })
     

    } catch (error) {
        
        next(error);
    }
};

exports.delete_post = async (req, res, next) => {

    const postId = req.params.id;
   

    try {
        const user = await User.findById(req.userId);
        const post = await Post.findById(postId);
        if(!post){
            createError('Post not found!', 404);
        }
        
        if(req.userId.toString() !== post.author.toString()){
            createError('Not Authorized !', 403)
        }

        const deleted = await post.remove();
      
        user.posts.pull({_id:deleted._id});
        const removedFromUserPosts = user.save();

        if(!removedFromUserPosts){
            createError('There was a problem updating your posts list', 500);
        }

        res.json({
            msg:"success",
            deleted_post:deleted._id
        })

    } catch (error) {
        
        next(error);
    }
};

