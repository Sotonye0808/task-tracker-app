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

    // Increment the appropriate fields based on the action
    if (action === 'add') {
      userData.daily.tasksAdded = (userData.daily.tasksAdded || 0) + 1;
      userData.weekly.tasksAdded = (userData.weekly.tasksAdded || 0) + 1;
      userData.monthly.tasksAdded = (userData.monthly.tasksAdded || 0) + 1;
    } else if (action === 'remove') {
      userData.daily.tasksRemoved = (userData.daily.tasksRemoved || 0) + 1;
      userData.weekly.tasksRemoved = (userData.weekly.tasksRemoved || 0) + 1;
      userData.monthly.tasksRemoved = (userData.monthly.tasksRemoved || 0) + 1;
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
