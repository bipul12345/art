const mongoose = require('mongoose');

const querySchema = new mongoose.Schema({
    category: {
        type: String
    },
    query: {
        type: String,
        require: true
    },
    askedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true })

module.exports = mongoose.model('Query', querySchema);
