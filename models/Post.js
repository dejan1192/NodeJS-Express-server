const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const postSchema = new Schema({

    title:{
        type:String,
        trim:true,
        required:true
    },
    content:{
        type:String,
        trim:true,
        required:true
    },
    imageUrl:{
        type:String,
        required:false
    },
    author:{
        required:true,
        type:Schema.Types.ObjectId,
        ref:"User"
    }


}, {timestamps:true});



module.exports = mongoose.model('Post', postSchema);