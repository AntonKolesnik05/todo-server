const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/auth');
const tasksRouter = require('./routes/tasks');

const app = express();

// Middleware для CORS і парсингу JSON
app.use(cors());
app.use(express.json());

// Підключаємо роутери з префіксом /api
app.use('/api', authRoutes);      // тепер всі маршрути auth.js будуть доступні як /api/register і /api/login
app.use('/api/tasks', tasksRouter); // якщо хочеш tasks теж через /api/tasks

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
