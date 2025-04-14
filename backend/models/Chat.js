const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'GoogleUser', required: true }],
  lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' , default: null},
}, { timestamps: true }); // includes createdAt and updatedAt

// index participants for faster searches later
chatSchema.index({ participants: 1 }, { unique: false });

module.exports = mongoose.model('Chat', chatSchema);