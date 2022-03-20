const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
    query: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Query'
    },
    answer: {
        type: String,
        require: true
    },
    answeredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true })

module.exports = mongoose.model('Answer', answerSchema);
