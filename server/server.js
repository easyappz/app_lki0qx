const express = require('express');
const mongoose = require('mongoose');

const apiRoutes = require('./apiRoutes');
const { User, Message, FriendRequest } = require('./models');

// Для работы с express
const app = express();

app.use('/api', apiRoutes);

/**
 * Подключение к базе данных MongoDB
 */
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// Определение порта
const PORT = process.env.PORT || 3000;

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
