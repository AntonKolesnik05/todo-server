const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
require('dotenv').config();

dotenv.config();

const authRoutes = require('./routes/auth');
const tasksRouter = require('./routes/tasks');

const app = express();

// Спершу підключаємо middleware
app.use(cors());
app.use(express.json());

// Потім підключаємо маршрути
app.use('/auth', authRoutes);
app.use('/tasks', tasksRouter);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Підключення до MongoDB і запуск сервера
mongoose.connect(MONGO_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})
.catch(err => {
  console.error('MongoDB connection error:', err);
});