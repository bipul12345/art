const express = require('express');
const multer = require('multer');
const path = require("path");

const storage = multer.diskStorage({
    destination: "./public/uploads",
    filename: (req, file, callback) => {
        let ext = path.extname(file.originalname);
        callback(null, `${file.fieldname}-${Date.now()}${ext}`);
    }
});

const imageFileFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webm|mp4)$/)) {
        return cb(new Error("Image file doesn't seems to be supported!"), false);
    }
    cb(null, true);
};

const upload = multer({
    storage: storage,
    fileFilter: imageFileFilter
})

const uploadRouter = express.Router();

uploadRouter.route('/')
    .post(upload.single('courseFile'), (req, res) => {
        res.json(req.file);
    });

module.exports = uploadRouter;