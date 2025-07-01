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

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ message: 'Invalid password' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, userId: user._id });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

// Logout user (client-side implementation)
router.post('/logout', (req, res) => {
  res.json({ message: 'Logout successful' });
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { firstName, lastName, bio } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      { firstName, lastName, bio },
      { new: true, runValidators: true }
    );
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
});

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
});

// Send friend request
router.post('/friends/request', authenticateToken, async (req, res) => {
  try {
    const { receiverId } = req.body;
    const senderId = req.user.userId;

    if (senderId === receiverId) {
      return res.status(400).json({ message: 'You cannot send a friend request to yourself' });
    }

    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId }
      ]
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'Friend request already exists' });
    }

    const newFriendRequest = new FriendRequest({
      sender: senderId,
      receiver: receiverId
    });

    await newFriendRequest.save();
    res.status(201).json({ message: 'Friend request sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending friend request', error: error.message });
  }
});

// Accept or reject friend request
router.put('/friends/request/:requestId', authenticateToken, async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;
    const userId = req.user.userId;

    const friendRequest = await FriendRequest.findById(requestId);
    if (!friendRequest) {
      return res.status(404).json({ message: 'Friend request not found' });
    }

    if (friendRequest.receiver.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to update this request' });
    }

    if (status === 'accepted') {
      await User.findByIdAndUpdate(friendRequest.sender, { $addToSet: { friends: userId } });
      await User.findByIdAndUpdate(userId, { $addToSet: { friends: friendRequest.sender } });
    }

    friendRequest.status = status;
    await friendRequest.save();

    res.json({ message: `Friend request ${status}` });
  } catch (error) {
    res.status(500).json({ message: 'Error updating friend request', error: error.message });
  }
});

// Remove friend
router.delete('/friends/:friendId', authenticateToken, async (req, res) => {
  try {
    const { friendId } = req.params;
    const userId = req.user.userId;

    await User.findByIdAndUpdate(userId, { $pull: { friends: friendId } });
    await User.findByIdAndUpdate(friendId, { $pull: { friends: userId } });

    res.json({ message: 'Friend removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing friend', error: error.message });
  }
});

// Get friend list
router.get('/friends', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate('friends', 'username email');
    res.json(user.friends);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching friend list', error: error.message });
  }
});

// Send message
router.post('/messages', authenticateToken, async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    const senderId = req.user.userId;

    const newMessage = new Message({
      sender: senderId,
      receiver: receiverId,
      content
    });

    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: 'Error sending message', error: error.message });
  }
});

// Get message history
router.get('/messages/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.userId;

    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: userId },
        { sender: userId, receiver: currentUserId }
      ]
    }).sort('timestamp');

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching message history', error: error.message });
  }
});

module.exports = router;
