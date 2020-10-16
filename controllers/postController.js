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

        res.status(200).json({
            msg:"success",
            posts
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
            msg:"success",
            post
        })

    } catch (error) {
        
        next(error);
    }
}

exports.create_post = async (req, res, next) => {

    const { title, content } = req.body;

    try {
        const author = await User.findById(req.userId);

        const { error } = post_validation.validate({title, content});
        if(error){
            return res.status(400).send({
                validationError:error.details[0].message
            })
 
         }

        const post = await Post.create({
            title,
            content,
            author:author._id
        });
        author.posts.push(post._id);
        const addedToUserPosts = await author.save();
        if(!addedToUserPosts){
            createError('There was a problem with saving your posts', 500);
        }
        res.status(201).json({
            msg:"success",
            post:post._id
        })
     

    } catch (error) {
        
        next(error);
    }
};

exports.delete_post = async (req, res, next) => {

    const postId = req.params.id;

    try {
        const post = await Post.findById(postId);
        if(!post){
            createError('Post not found!', 404);
        }
        
        if(req.userId.toString() !== post.author.toString()){
            createError('Not Authorized !', 403)
        }

        const deleted = await post.remove();
        
        res.json({
            msg:"success",
            deleted_post:deleted._id
        })

    } catch (error) {
        
        next(error);
    }
};