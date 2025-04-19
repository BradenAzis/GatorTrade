const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  chat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'GoogleUser', required: true },
  text: { type: String, required: true },
  listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: false }, 
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', messageSchema);
