// routes/stats.js
const express = require('express');
const router = express.Router();
const UserData = require('../models/UserData');

// Get statistics for a specific user
router.get('/', async (req, res) => {
  try {
    const userId = req.ip; // Extract userId from user's IP address
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Find user data based on userId
    let userData = await UserData.findOne({ userId });
    if (!userData) {
      // If no user data found, return empty statistics
      userData = new UserData({ userId });
      await userData.save();
    }

    // Calculate daily, weekly, and monthly statistics
    const dailyTasksAdded = userData.daily.tasksAdded || 0;
    const dailyTasksRemoved = userData.daily.tasksRemoved || 0;

    const weeklyTasksAdded = userData.weekly.tasksAdded || 0;
    const weeklyTasksRemoved = userData.weekly.tasksRemoved || 0;

    const monthlyTasksAdded = userData.monthly.tasksAdded || 0;
    const monthlyTasksRemoved = userData.monthly.tasksRemoved || 0;

    res.json({
      daily: { tasksAdded: dailyTasksAdded, tasksRemoved: dailyTasksRemoved },
      weekly: { tasksAdded: weeklyTasksAdded, tasksRemoved: weeklyTasksRemoved },
      monthly: { tasksAdded: monthlyTasksAdded, tasksRemoved: monthlyTasksRemoved }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
