const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Message, FriendRequest } = require('./models');

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

// Get friend requests
router.get('/friends/requests', authenticateToken, async (req, res) => {
  try {
    const friendRequests = await FriendRequest.find({ receiver: req.user.userId, status: 'pending' })
      .populate('sender', 'username email');
    res.json(friendRequests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching friend requests', error: error.message });
  }
});

// Search users
router.get('/users/search', authenticateToken, async (req, res) => {
  try {
    const searchTerm = req.query.q;
    const users = await User.find({
      $or: [
        { username: { $regex: searchTerm, $options: 'i' } },
        { email: { $regex: searchTerm, $options: 'i' } }
      ],
      _id: { $ne: req.user.userId }
    }).select('username email');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error searching users', error: error.message });
  }
});

module.exports = router;