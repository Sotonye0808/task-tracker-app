// models/UserData.js
const mongoose = require('mongoose');

const UserData = new mongoose.Schema({
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
  },
  tasks: [{
    title: {
      type: String,
      required: true,
    },
    description: String,
    date: Date,
    reminder: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    }
  }]
});

module.exports = mongoose.model('UserData', UserData);
