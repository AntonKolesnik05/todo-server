const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');

const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;

router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, birthDate, username, password } = req.body;

    if (!firstName || !lastName || !birthDate || !username || !password) {
      return res.status(400).json({ message: 'Будь ласка, заповніть всі поля' });
    }

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: 'Пароль має містити щонайменше 6 символів, одну велику літеру, одну цифру та один спецсимвол'
      });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Користувач з таким логіном вже існує' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      birthDate,
      username,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: 'Реєстрація успішна' });
  } catch (error) {
    console.error("Помилка при реєстрації:", error.message, error);
    res.status(500).json({ message: 'Помилка сервера', error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Будь ласка, введіть логін і пароль' });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Користувача не знайдено' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Невірний пароль' });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, message: 'Логін успішний' });
  } catch (error) {
    res.status(500).json({ message: 'Помилка сервера', error });
  }
});

module.exports = router;