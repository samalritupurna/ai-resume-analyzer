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

module.exports = {
  getDashboardStats,
  getGlobalLogs,
};
