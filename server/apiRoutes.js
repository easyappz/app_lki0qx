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

// Get user settings
router.get('/user/settings', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    res.json({
      emailNotifications: user.emailNotifications,
      darkMode: user.darkMode,
      twoFactorAuth: user.twoFactorAuth
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching settings', error: error.message });
  }
});

// Update user settings
router.post('/user/settings', authenticateToken, async (req, res) => {
  try {
    const { emailNotifications, darkMode, twoFactorAuth } = req.body;
    await User.findByIdAndUpdate(req.user.userId, {
      emailNotifications,
      darkMode,
      twoFactorAuth
    });
    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating settings', error: error.message });
  }
});

// Get user notifications
router.get('/notifications', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const friendRequests = await FriendRequest.find({ receiver: req.user.userId, status: 'pending' })
      .populate('sender', 'username');
    const unreadMessages = await Message.countDocuments({ receiver: req.user.userId, read: false });

    const notifications = [
      ...friendRequests.map(request => ({
        type: 'friendRequest',
        message: `${request.sender.username} sent you a friend request`,
        date: request.createdAt
      })),
      unreadMessages > 0 ? {
        type: 'unreadMessages',
        message: `You have ${unreadMessages} unread messages`,
        date: new Date()
      } : null
    ].filter(Boolean);

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications', error: error.message });
  }
});

module.exports = router;