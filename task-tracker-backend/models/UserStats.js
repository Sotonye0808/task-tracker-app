// models/UserStats.js
const mongoose = require('mongoose');

const userStatsSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  daily: {
    tasksAdded: {
      type: Number,
      default: 0
    },
    tasksRemoved: {
      type: Number,
      default: 0
    }
  },
  weekly: {
    tasksAdded: {
      type: Number,
      default: 0
    },
    tasksRemoved: {
      type: Number,
      default: 0
    }
  },
  monthly: {
    tasksAdded: {
      type: Number,
      default: 0
    },
    tasksRemoved: {
      type: Number,
      default: 0
    }
  }
});

module.exports = mongoose.model('UserStats', userStatsSchema);
