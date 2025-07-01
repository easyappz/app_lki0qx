const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Message, FriendRequest, Chat, Post } = require('./models');

const router = express.Router();

// Middleware for JWT authentication
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// ... (keep existing routes)

// Get all chats for the current user
router.get('/chats', authenticateToken, async (req, res) => {
  try {
    const chats = await Chat.find({ participants: req.user.userId })
      .populate('participants', 'username');
    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching chats', error: error.message });
  }
});

// Get messages for a specific chat
router.get('/messages/:chatId', authenticateToken, async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate('sender', 'username')
      .sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages', error: error.message });
  }
});

// Send a new message
router.post('/messages/:chatId', authenticateToken, async (req, res) => {
  try {
    const { content } = req.body;
    const newMessage = new Message({
      chat: req.params.chatId,
      sender: req.user.userId,
      content,
    });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: 'Error sending message', error: error.message });
  }
});

// Get posts from friends
router.get('/posts', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const posts = await Post.find({ author: { $in: [...user.friends, req.user.userId] } })
      .populate('author', 'username avatar')
      .populate('comments.author', 'username avatar')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts', error: error.message });
  }
});

// Create a new post
router.post('/posts', authenticateToken, async (req, res) => {
  try {
    const { content } = req.body;
    const newPost = new Post({
      author: req.user.userId,
      content,
    });
    await newPost.save();
    const populatedPost = await Post.findById(newPost._id)
      .populate('author', 'username avatar');
    res.status(201).json(populatedPost);
  } catch (error) {
    res.status(500).json({ message: 'Error creating post', error: error.message });
  }
});

module.exports = router;