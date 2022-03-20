const express = require("express");
const mongoose = require("mongoose");
const morgan = require('morgan');

//INITILIZE ROUTERS HERE
const userRouter = require('./routes/users');
const courseRouter = require('./routes/course');
const enrollRouter = require('./routes/enroll');
const resourceRouter = require('./routes/resource');
const queryRouter = require('./routes/query');
const answerRouter = require('./routes/answer');

const dotenv = require('dotenv').config();
const cors = require('cors');
const auth = require('./auth');
const uploadRouter = require('./routes/upload');


const app = express();
app.options('*', cors());
app.use(cors());
app.use(morgan('tiny'));
app.use(express.json());
app.use(express.static(__dirname + "/public"));

mongoose.connect(process.env.URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})
    .then((db) => {
        console.log("SUCCESSFULLY CONNECTED TO LEARN-ART DATABASE SERVER");
    }, (err) => console.log(err));




//USER ROUTERS
app.use('/upload', uploadRouter);
app.use('/users', userRouter);
app.use('/courses', courseRouter);
app.use('/enroll', enrollRouter);
app.use('/resource', resourceRouter);
app.use('/query', queryRouter);
app.use('/answer', answerRouter);

app.use((err, req, res, next) => {
    
    console.error(err.stack);
    res.statusCode = 500;
    res.json({ status: err.message });
});

app.listen(process.env.PORT, () => {
    console.log(`App is running at localhost:${process.env.PORT}`);
});