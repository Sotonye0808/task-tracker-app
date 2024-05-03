// routes/updateUserStats.js
const express = require('express');
const router = express.Router();
const UserData = require('../models/UserData');
const requestIp = require('request-ip'); // Import request-ip middleware

// Update user statistics based on the action
router.post('/', async (req, res) => {
  const { action } = req.body;

  try {
    if (!action) {
      return res.status(400).json({ message: 'Action is required' });
    }

    // Get user IP address
    const userId = requestIp.getClientIp(req);
    if (!userId) {
      return res.status(400).json({ message: 'Failed to retrieve user IP address' });
    }

    // Find or create user data
    let userData = await UserData.findOne({ userId });
    if (!userData) {
      userData = new UserData({ userId });
    }

    // Reset stats if it's the start of a new day, week, or month
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Increment the appropriate fields based on the action
    if (action === 'add') {
      userData.daily.tasksAdded++;
      userData.weekly.tasksAdded++;
      userData.monthly.tasksAdded++;
    } else if (action === 'remove') {
      userData.daily.tasksRemoved++;
      userData.weekly.tasksRemoved++;
      userData.monthly.tasksRemoved++;
    } else if (action === 'reset') {
      if (today.getTime() === startOfDay.getTime()) {
        //reset users stats daily
        userData.daily.tasksAdded = 0;
        userData.daily.tasksRemoved = 0;
      }

      if (today.getTime() === startOfWeek.getTime()) {
        //reset users stats weekly
        userData.weekly.tasksAdded = 0;
        userData.weekly.tasksRemoved = 0;
      }

      if (today.getTime() === startOfMonth.getTime()) {
        //reset users stats monthly
        userData.monthly.tasksAdded = 0;
        userData.monthly.tasksRemoved = 0;
      }
    } else {
      return res.status(400).json({ message: 'Invalid action' });
    }

    // Save the updated user data
    await userData.save();

    res.status(200).json({ message: 'User statistics updated successfully' });
  } catch (error) {
    console.error('Error updating user statistics:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
