const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    userId: String,
    chatId: String,
    messages: [{
        sender: String,
        content: String
    }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Chat', chatSchema);