const mongoose = require('mongoose');

const historyEventSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  actionType: {
    type: String,
    required: true,
    enum: [
      'CREATED_RESUME',
      'ANALYZED_RESUME',
      'OPTIMIZED_BULLET',
      'GENERATED_COVER_LETTER',
      'DELETED_RESUME',
      'DUPLICATED_RESUME'
    ]
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const HistoryEvent = mongoose.model('HistoryEvent', historyEventSchema);

module.exports = HistoryEvent;
