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

    // Check if it's a new day/week/month and reset stats if necessary
    const today = new Date();
    const lastUpdated = userData.lastUpdated || new Date(0); // Initialize to epoch if not set
    const isNewDay = today.getDate() !== lastUpdated.getDate();
    const isNewWeek = today.getFullYear() !== lastUpdated.getFullYear() ||
                      Math.floor(today.getDate() / 7) !== Math.floor(lastUpdated.getDate() / 7);
    const isNewMonth = today.getMonth() !== lastUpdated.getMonth();

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
      if (isNewDay) {
        userData.daily.tasksAdded = 0;
        userData.daily.tasksRemoved = 0;
      }
  
      if (isNewWeek) {
        userData.weekly.tasksAdded = 0;
        userData.weekly.tasksRemoved = 0;
      }
  
      if (isNewMonth) {
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
