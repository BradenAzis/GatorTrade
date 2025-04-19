const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');
const isLoggedIn = require("../middleware/authMiddleware");

// create or fetch existing chat
router.post('/', isLoggedIn, async (req, res) => {
  const { sellerId } = req.body;
  const buyerId = req.user._id;

  const participants = [buyerId.toString(), sellerId].sort();

  try {
    // prevent self-chat
    if (buyerId.toString() === sellerId) {
      return res.status(400).json({ error: 'Cannot chat with yourself' });
    }

    // find existing chat between the two users
    let chat = await Chat.findOne({ participants: { $all: participants, $size: 2 } });

    if (!chat) {
      // create a new chat if one doesn't exist
      chat = new Chat({ participants });
      await chat.save();
    }

    res.json(chat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create or fetch chat' });
  }
});

// get all chats for the logged-in user
router.get('/', isLoggedIn, async (req, res) => {
    const userId = req.user._id;

    try {
      const chats = await Chat.find({ participants: userId })
        .populate('lastMessage')
        .populate('participants', 'firstName lastName')
        .sort({ updatedAt: -1 }); // show most recent chats first
  
      // filter out self from participants list
      const filteredChats = chats.map(chat => {
        const otherParticipants = chat.participants.filter(
          p => p._id.toString() !== userId.toString()
        );
        return {
          ...chat.toObject(),
          otherUser: otherParticipants[0] || null,
        };
      });
  
      res.json(filteredChats);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch chats' });
    }
});

module.exports = router;
