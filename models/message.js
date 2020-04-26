const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    senderId: {
        type: String,
        required: true,
        max: 255
    },
    receiverId: {
        type: String,
        required: true,
        max: 255
    },
    message: {
        type: String,
        required: true,
        max: 1000
    },
    date: {
        type: Date,
        default: Date.now
    },

});

module.exports = mongoose.model('Message', messageSchema);