const User = require('../models/User');
const Analysis = require('../models/Analysis');

const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalAnalyses = await Analysis.countDocuments();
    
    // Calculate average ATS score
    const analyses = await Analysis.find().select('atsScore');
    let totalScore = 0;
    analyses.forEach(a => {
      totalScore += (a.atsScore || 0);
    });
    const avgAtsScore = totalAnalyses > 0 ? Math.round(totalScore / totalAnalyses) : 0;

    res.status(200).json({
      totalUsers,
      totalAnalyses,
      avgAtsScore
    });
  } catch (error) {
    console.error('Admin Stats Error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
};

const getGlobalLogs = async (req, res) => {
  try {
    const logs = await Analysis.find()
      .populate('user', 'name email')
      .select('atsScore jobMatchScore recommendation createdAt user')
      .sort({ createdAt: -1 })
      .limit(50); // Get latest 50 for performance

    res.status(200).json(logs);
  } catch (error) {
    console.error('Admin Logs Error:', error);
    res.status(500).json({ error: 'Failed to fetch global logs' });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    console.error('Get All Users Error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

const getAllAnalyses = async (req, res) => {
  try {
    const analyses = await Analysis.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.status(200).json(analyses);
  } catch (error) {
    console.error('Get All Analyses Error:', error);
    res.status(500).json({ error: 'Failed to fetch analyses' });
  }
};

const deleteAnalysis = async (req, res) => {
  try {
    const { id } = req.params;
    const analysis = await Analysis.findById(id);
    if (!analysis) {
      return res.status(404).json({ error: 'Analysis not found' });
    }
    await Analysis.deleteOne({ _id: id });
    res.status(200).json({ message: 'Analysis deleted successfully' });
  } catch (error) {
    console.error('Delete Analysis Error:', error);
    res.status(500).json({ error: 'Failed to delete analysis' });
  }
};

const getContactMessages = async (req, res) => {
  try {
    // Requires Contact model
    const Contact = require('../models/Contact');
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (error) {
    console.error('Get Contact Messages Error:', error);
    res.status(500).json({ error: 'Failed to fetch contact messages' });
  }
};

module.exports = {
  getDashboardStats,
  getGlobalLogs,
  getAllUsers,
  getAllAnalyses,
  deleteAnalysis,
  getContactMessages
};
