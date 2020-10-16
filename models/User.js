const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { createError } = require('../util/helperFunctions');
const bcrypt = require('bcrypt');
const userSchema = new Schema({
    
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    posts:[
        {
            type:Schema.Types.ObjectId,
            ref:'Post'
        }
    ]

}, {timestamps:true});

userSchema.pre('save', async function(next){

    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.static('login', async function(email, password){
    const user = await this.findOne({email});
    if(user){
       const validPassword = bcrypt.compare(password, user.password);

       if(validPassword){
           return user;
       }
       createError('Invalid password' , 400);
    }
});

userSchema.static('register', async function(name, email, password){
   
    try {
        return await this.create({
            name,
            email,
            password
        })


    } catch (error) {
        
        throw error;
    }

    
});

module.exports = mongoose.model('User', userSchema);