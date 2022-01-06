const mongoose = require('mongoose');
const validator = require('validator');

const codeSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true
    },
    authorId: {
        type: String,
        required: true,
    },
    authorName: {
        type: String,
        required: true,
    },
    authorEmail: {
        type: String,
        required: true,
    }
})

const Code = mongoose.model('Code', codeSchema);

module.exports = Code;