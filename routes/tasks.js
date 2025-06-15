const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// Отримати всі задачі
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Додати нову задачу
router.post('/', async (req, res) => {
  const task = new Task({
    text: req.body.text
  });
  try {
    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Оновити задачу (наприклад, відмітити як виконану)
router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    task.text = req.body.text !== undefined ? req.body.text : task.text;
    task.done = req.body.done !== undefined ? req.body.done : task.done;

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).send({ message: 'Task not found' });
    }
    await task.deleteOne();
    res.send({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

module.exports = router;