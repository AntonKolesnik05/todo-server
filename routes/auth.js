const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');

// Регулярка для валідації пароля
const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;

// ✅ РЕЄСТРАЦІЯ
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, birthDate, username, password } = req.body;

    // Перевірка чи заповнені всі поля
    if (!firstName || !lastName || !birthDate || !username || !password) {
      return res.status(400).json({ message: 'Будь ласка, заповніть всі поля' });
    }

    // Валідація пароля
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: 'Пароль має містити щонайменше 6 символів, одну велику літеру, одну цифру та один спецсимвол'
      });
    }

    // Перевірка чи юзер вже існує
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Користувач з таким логіном вже існує' });
    }

    // Хешування пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    // Створення нового користувача
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


// ✅ ЛОГІН
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
    // Виводимо повний об'єкт помилки
    console.error('Помилка при реєстрації:', error);
    console.error('Помилка (JSON):', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    res.status(500).json({ message: 'Помилка сервера', error: error.message || error });
  }
});

module.exports = router;