const express = require('express');
const router = express.Router();
const UserStats = require('../models/UserStats');
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

    // Handle potential errors related to IP address retrieval
    if (!userId) {
      return res.status(400).json({ message: 'Failed to retrieve user IP address' });
    }

    // Find or create user stats
    let userStats = await UserStats.findOneAndUpdate(
      { userId },
      { $setOnInsert: { userId, daily: {}, weekly: {}, monthly: {} } },
      { upsert: true, new: true }
    );

    // Increment the appropriate fields based on the action
    if (action === 'add') {
      userStats.daily.tasksAdded = (userStats.daily.tasksAdded || 0) + 1;
      userStats.weekly.tasksAdded = (userStats.weekly.tasksAdded || 0) + 1;
      userStats.monthly.tasksAdded = (userStats.monthly.tasksAdded || 0) + 1;
    } else if (action === 'remove') {
      userStats.daily.tasksRemoved = (userStats.daily.tasksRemoved || 0) + 1;
      userStats.weekly.tasksRemoved = (userStats.weekly.tasksRemoved || 0) + 1;
      userStats.monthly.tasksRemoved = (userStats.monthly.tasksRemoved || 0) + 1;
    } else {
      return res.status(400).json({ message: 'Invalid action' });
    }

    // Save the updated user statistics
    await userStats.save();
    
    res.status(200).json({ message: 'User statistics updated successfully' });
  } catch (error) {
    console.error('Error updating user statistics:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


module.exports = router;
