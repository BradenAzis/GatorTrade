const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const Chat = require('../models/Chat')
const isLoggedIn = require("../middleware/authMiddleware");

// get messages for a chat
router.get('/:chatId', isLoggedIn, async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId }).sort({ createdAt : -1});
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// send a new message
router.post('/', isLoggedIn, async (req, res) => {
  const { chatId, text } = req.body;

  try {
    const message = new Message({
      chat: chatId,
      sender: req.user._id,
      text: text,
    });

    await message.save();
    await Chat.findByIdAndUpdate(chatId, { lastMessage: message._id });
    res.status(201).json(message);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

module.exports = router;
