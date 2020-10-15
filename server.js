const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const postRoutes = require('./routes/postRoutes');
dotenv.config();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    res.header('Access-Control-Allow-Headers', 'Origin , X-Requested-With, Content-Type, Authorization, Accept');
    next();
})
app.use(cookieParser());
app.use(express.json());

app.use(postRoutes);
app.use('/auth', authRoutes);


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
