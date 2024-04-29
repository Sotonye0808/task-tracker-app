// routes/stats.js
const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const UserStats = require('../models/UserStats');

// Get statistics
router.get('/', async (req, res) => {
  try {
    const userId = req.ip; // Assuming IP address is used as the user identifier
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Query database for user statistics
    let userStats = await UserStats.findOne({ userId });
    if (!userStats) {
      userStats = new UserStats({ userId });
      await userStats.save();
    }

    // Calculate daily, weekly, and monthly statistics
    const dailyTasks = await Task.find({ createdAt: { $gte: startOfDay }, userId });
    const weeklyTasks = await Task.find({ createdAt: { $gte: startOfWeek }, userId });
    const monthlyTasks = await Task.find({ createdAt: { $gte: startOfMonth }, userId });

    // Update user statistics
    userStats.daily.tasksAdded = dailyTasks.filter(task => !task.removed).length;
    userStats.daily.tasksRemoved = dailyTasks.filter(task => task.removed).length;

    userStats.weekly.tasksAdded = weeklyTasks.filter(task => !task.removed).length;
    userStats.weekly.tasksRemoved = weeklyTasks.filter(task => task.removed).length;

    userStats.monthly.tasksAdded = monthlyTasks.filter(task => !task.removed).length;
    userStats.monthly.tasksRemoved = monthlyTasks.filter(task => task.removed).length;

    await userStats.save();

    res.json(userStats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
