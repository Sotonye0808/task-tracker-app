require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const requestIp = require('request-ip'); // Import request-ip middleware

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(requestIp.mw()); // Use request-ip middleware to get user's IP address

// Routes
const tasksRouter = require('./routes/tasks');
const statsRouter = require('./routes/stats'); // Import the stats router
const updateUserStatsRouter = require('./routes/updateUserStats'); // Import the userStats router
app.use('/tasks', tasksRouter);
app.use('/stats', statsRouter); // Add the stats route
app.use('/updateUserStats', updateUserStatsRouter); // Add the updateUserStats route

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Error connecting to MongoDB:', err));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
