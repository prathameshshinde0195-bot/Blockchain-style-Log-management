const mongoose = require('mongoose');

const logBlockSchema = new mongoose.Schema({
  index: { type: Number, required: true, unique: true },
  timestamp: { type: String, required: true },
  data: {
    level: {
      type: String,
      enum: ['INFO', 'WARN', 'ERROR', 'DEBUG'],
      default: 'INFO'
    },
    message: { type: String, required: true },
    source: { type: String, default: 'system' }
  },
  previousHash: { type: String, required: true },
  hash: { type: String, required: true },
  nonce: { type: Number, default: 0 }
}, {
  timestamps: false
});

module.exports = mongoose.model('LogBlock', logBlockSchema);
