const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    email: {
        type: String,
        required: true,
        unique: true,




    },


    displayName: {
        type: String,
        required: true,
    }
}, { timestamps: true });


module.exports = mongoose.model('user', userSchema);