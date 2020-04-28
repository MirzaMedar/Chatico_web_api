const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    email: {
        type: String,
        required: true,
        min: 6,
        max: 255,
        unique: true
    },
    username: {
        type: String,
        required: true,
        max: 1024,
        min: 6,
        unique: true
    },
    password: {
        type: String,
        required: true,
        max: 1024,
        min: 6,
        select: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    imageUrl: {
        type: String,
        required: false,
        default: ''
    },
    socketId: {
        type: String,
        required: false,
        default: null
    },
    playerId: {
        type: String,
        required: false,
        default: ''
    },
});

module.exports = mongoose.model('User', userSchema);