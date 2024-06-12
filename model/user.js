const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,

    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    provider: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['Reader', 'Author', 'Publisher'],
    },
});

module.exports = mongoose.model('User', userSchema);
