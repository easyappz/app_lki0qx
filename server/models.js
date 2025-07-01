const mongoose = require('mongoose');

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String },
  lastName: { type: String },
  avatar: { type: String },
  bio: { type: String },
  createdAt: { type: Date, default: Date.now },
  lastActive: { type: Date },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  emailNotifications: { type: Boolean, default: true },
  darkMode: { type: Boolean, default: false },
  twoFactorAuth: { type: Boolean, default: false }
});

// ... (keep other schemas unchanged)

// Create models
const User = mongoose.model('User', userSchema);
const Chat = mongoose.model('Chat', chatSchema);
const Message = mongoose.model('Message', messageSchema);
const FriendRequest = mongoose.model('FriendRequest', friendRequestSchema);
const Post = mongoose.model('Post', postSchema);

module.exports = { User, Chat, Message, FriendRequest, Post };