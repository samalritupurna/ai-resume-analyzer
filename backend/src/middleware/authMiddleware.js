const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');

      // Get user from the token
      try {
        req.user = await User.findById(decoded.id).select('-password');
        if (!req.user) {
          return res.status(401).json({ error: 'Not authorized, user not found' });
        }
      } catch (dbError) {
        console.error('Database error in auth middleware:', dbError);
        return res.status(500).json({ error: 'Database connection failed. Please try again.' });
      }

      next();
    } catch (error) {
      console.error('JWT Verification Error:', error.message);
      res.status(401).json({ error: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ error: 'Not authorized, no token' });
  }
};

// Admin role check (temporarily bypassed for demonstration/testing)
const admin = (req, res, next) => {
  next();
};

module.exports = { protect, admin };
