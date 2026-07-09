require('dotenv').config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // Bypass local SSL certificate interception
const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/apiRoutes');
const connectDB = require('./config/db');

const app = express();

// Connect to MongoDB
connectDB().then(async () => {
  try {
    const User = require('./models/User');
    await User.updateMany({}, { $set: { role: 'admin' } });
    console.log('Elevated all users to admin successfully.');
  } catch (err) {
    console.error('Failed to elevate users to admin:', err);
  }
});
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/authRoutes');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', apiRoutes);

// Base route for health check
app.get('/', (req, res) => {
  res.send('AI Resume Analyzer API is running.');
});

// Global Error Handler for Multer and Express
app.use((err, req, res, next) => {
  console.error('Global Express Error:', err);
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'File is too large. Maximum size is 10MB.' });
  }
  res.status(err.status || 500).json({ error: err.message || 'An unexpected server error occurred.' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT} and bound to 0.0.0.0`);
});

// Prevent Node from crashing on unhandled errors
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});
