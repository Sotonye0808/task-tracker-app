// routes/tasks.js
const express = require('express');
const router = express.Router();
const UserData = require('../models/UserData');
const requestIp = require('request-ip'); // Import request-ip middleware

// Get all tasks for a specific user
router.get('/', async (req, res) => {
  try {
    const userData = await UserData.findOne({ userId: requestIp.getClientIp(req) });
    if (!userData) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(userData.tasks);
    //log schema to console
    console.log(userData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a task for a specific user
router.post('/', async (req, res) => {
  const { title, description, date, reminder } = req.body;
  const task = { title, description, date, reminder }; // Remove 'id' field
  try {
    const userData = await UserData.findOneAndUpdate(
      { userId: requestIp.getClientIp(req) },
      { $push: { tasks: task } },
      { new: true, upsert: true }
    );
    res.status(201).json(userData.tasks);
    //log schema to console
    console.log(userData);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a task for a specific user
router.delete('/:taskId', async (req, res) => { // Add ':taskId' to capture taskId from request URL
  try {
    const userData = await UserData.findOneAndUpdate(
      { userId: requestIp.getClientIp(req) },
      { $pull: { tasks: { _id: req.params.taskId } } }, // Change 'id' to '_id'
      { new: true }
    );
    if (!userData) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(userData.tasks);
    //log schema to console
    console.log(userData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
