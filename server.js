const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const postRoutes = require('./routes/postRoutes');
const multer = require('multer');
const path = require('path');
const profileRoutes = require('./routes/profileRoutes');

dotenv.config();

const storage = multer.diskStorage({
    destination:function(req, file , cb){
        cb(null, __dirname + '/public/uploads')
    },
    filename:function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

app.use(multer({storage:storage}).single('image'));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Headers', 'Origin,X-Requested-With, Content-Type,Authorization, Accept')
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({})
    }
    next();
});
app.use(cookieParser());
app.use(express.json());

app.use(express.static('public'));
app.use(postRoutes);
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);

app.use((error, req, res, next) => {

    const errorCode = error.status || 500;
    const errorMessage = error.message;

    res.status(errorCode).json({
        error:errorMessage
    })
});

mongoose.connect(process.env.MONGO_URI, {useNewUrlParser:true, useUnifiedTopology:true, useCreateIndex:true, autoIndex:true})
        .then(result => {
            console.log("Server started..")
        app.listen(8000);
    })
    .catch(err => console.log(err));
