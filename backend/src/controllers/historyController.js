const HistoryEvent = require('../models/HistoryEvent');

const getHistoryEvents = async (req, res) => {
  try {
    const events = await HistoryEvent.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    res.status(200).json(events);
  } catch (error) {
    console.error('Get History Events Error:', error);
    res.status(500).json({ error: 'Failed to fetch history events' });
  }
};

module.exports = {
  getHistoryEvents
};
