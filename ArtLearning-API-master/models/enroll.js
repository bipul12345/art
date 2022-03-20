const mongoose = require('mongoose');

const enrollSchema = new mongoose.Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    },
    by: {
        type: String
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        default: 'Not-Approved',
        enum: ['Not-Approved', 'Approved']
    }
}, { timestamps: true })

module.exports = mongoose.model('Enroll', enrollSchema);
