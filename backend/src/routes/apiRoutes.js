const express = require('express');
const multer = require('multer');
const { protect, admin } = require('../middleware/authMiddleware');
const { analyzeController, getHistoryController } = require('../controllers/analyzeController');
const { getDashboardStats, getGlobalLogs, getAllUsers, getAllAnalyses, deleteAnalysis, getContactMessages } = require('../controllers/adminController');

const router = express.Router();

// Configure multer for temporary file storage
const upload = multer({ 
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Route to handle resume analysis (protected)
router.post('/analyze', protect, upload.single('resume'), analyzeController);

// Route to get analysis history (protected)
router.get('/history', protect, getHistoryController);

// Admin Routes (protected + admin only)
router.get('/admin/stats', protect, admin, getDashboardStats);
router.get('/admin/logs', protect, admin, getGlobalLogs);
router.get('/admin/users', protect, admin, getAllUsers);
router.get('/admin/analyses', protect, admin, getAllAnalyses);
router.delete('/admin/analyses/:id', protect, admin, deleteAnalysis);
router.get('/admin/contacts', protect, admin, getContactMessages);

module.exports = router;
