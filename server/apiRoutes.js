const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Message, FriendRequest, Chat, Post } = require('./models');
const rateLimit = require('express-rate-limit');

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

// Login rate limiting
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 login attempts per windowMs
  message: 'Too many login attempts, please try again later.'
});

// Password strength check
const isPasswordStrong = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasNonalphas = /\W/.test(password);
  return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasNonalphas;
};

// Login route
router.post('/login', loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Register route
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    if (!isPasswordStrong(password)) {
      return res.status(400).json({ message: 'Password is not strong enough' });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

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