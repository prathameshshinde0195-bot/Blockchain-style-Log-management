require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const LogBlock = require('./models/LogBlock');
const { getLogBlockLevelModel } = require('./models/LogBlockByLevel');
const { calculateHash } = require('./utils/hash');
const logsRouter = require('./routes/logs');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:3000'] }));
app.use(express.json());

// Routes
app.use('/api/logs', logsRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Initialize Genesis Block if chain is empty
async function initGenesisBlock() {
  const count = await LogBlock.countDocuments();
  if (count === 0) {
    const timestamp = new Date().toISOString();
    const data = { level: 'INFO', message: 'Genesis Block — Chain Initialized', source: 'system' };
    const hash = calculateHash(0, timestamp, data, '0000', 0);

    const genesis = new LogBlock({
      index: 0,
      timestamp,
      data,
      previousHash: '0000',
      hash,
      nonce: 0
    });

    await genesis.save();
    // Also store in level-specific collection (INFO).
    const LogBlockINFO = getLogBlockLevelModel(data.level);
    await LogBlockINFO.create(genesis.toObject());
    console.log('✅ Genesis block created:', genesis.hash.substring(0, 16) + '...');
  } else {
    console.log(`✅ Chain loaded with ${count} blocks`);
  }
}

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB connected:', process.env.MONGO_URI);
    await initGenesisBlock();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });
