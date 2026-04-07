const mongoose = require('mongoose');

const LEVELS = ['INFO', 'WARN', 'ERROR', 'DEBUG'];

const logBlockSchema = new mongoose.Schema({
  index: { type: Number, required: true },
  timestamp: { type: String, required: true },
  data: {
    level: {
      type: String,
      enum: LEVELS,
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

function collectionNameForLevel(level) {
  const lvl = String(level || 'INFO').toUpperCase();
  if (!LEVELS.includes(lvl)) return 'logblocks_info';
  return `logblocks_${lvl.toLowerCase()}`;
}

function getLogBlockLevelModel(level) {
  const collectionName = collectionNameForLevel(level);
  const modelName = `LogBlock_${collectionName}`;

  // Prevent model overwrite errors in dev (nodemon).
  if (mongoose.models[modelName]) return mongoose.models[modelName];
  return mongoose.model(modelName, logBlockSchema, collectionName);
}

function getAllLevelCollectionNames() {
  return LEVELS.map((lvl) => collectionNameForLevel(lvl));
}

module.exports = { getLogBlockLevelModel, getAllLevelCollectionNames, LEVELS };
