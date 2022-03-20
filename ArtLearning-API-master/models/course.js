const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    image: {
        type: String
    },
    title: {
        type: String,
        require: true
    },
    detail: {
        type: String,
        require: true
    },
    price: {
        type: String,
        default: 'Free'
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    medium: {
        type: String,
        require: true
    },
    courseType: {
        type: String,
        default: 'Free'
    }
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);