const express = require('express');
const router = express.Router();
const LogBlock = require('../models/LogBlock');
const { getAllLevelCollectionNames, getLogBlockLevelModel } = require('../models/LogBlockByLevel');
const { calculateHash } = require('../utils/hash');

// GET /api/logs/verify — must be before /:id route
router.get('/verify', async (req, res) => {
  try {
    const blocks = await LogBlock.find().sort({ index: 1 });

    if (blocks.length === 0) {
      return res.json({ valid: true, brokenAt: null, totalBlocks: 0, message: 'Chain is empty' });
    }

    for (let i = 1; i < blocks.length; i++) {
      const current = blocks[i];
      const previous = blocks[i - 1];

      // Check previousHash linkage
      if (current.previousHash !== previous.hash) {
        return res.json({
          valid: false,
          brokenAt: current.index,
          totalBlocks: blocks.length,
          reason: `Block ${current.index} previousHash does not match Block ${previous.index} hash`
        });
      }

      // Recalculate and verify hash
      const recalculated = calculateHash(
        current.index,
        current.timestamp,
        current.data,
        current.previousHash,
        current.nonce
      );

      if (recalculated !== current.hash) {
        return res.json({
          valid: false,
          brokenAt: current.index,
          totalBlocks: blocks.length,
          reason: `Block ${current.index} hash has been tampered`
        });
      }
    }

    res.json({ valid: true, brokenAt: null, totalBlocks: blocks.length, message: 'Chain is intact' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/logs — all blocks
router.get('/', async (req, res) => {
  try {
    const blocks = await LogBlock.find().sort({ index: 1 });
    res.json(blocks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/logs — add new log block
router.post('/', async (req, res) => {
  try {
    const { level = 'INFO', message, source = 'system' } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Get last block
    const lastBlock = await LogBlock.findOne().sort({ index: -1 });

    const index = lastBlock ? lastBlock.index + 1 : 0;
    const previousHash = lastBlock ? lastBlock.hash : '0000';
    const timestamp = new Date().toISOString();
    const data = { level, message, source };
    const nonce = 0;
    const hash = calculateHash(index, timestamp, data, previousHash, nonce);

    const newBlock = new LogBlock({
      index,
      timestamp,
      data,
      previousHash,
      hash,
      nonce
    });

    await newBlock.save();
    // Duplicate into level-specific collection.
    const LogBlockLevel = getLogBlockLevelModel(level);
    await LogBlockLevel.create(newBlock.toObject());
    res.status(201).json(newBlock);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/logs/reset — clear chain (dev only)
// Must be before /:id route to avoid being interpreted as an "id".
router.delete('/reset', async (req, res) => {
  try {
    await LogBlock.deleteMany({});
    // Clear per-level collections too.
    const perLevelCollections = getAllLevelCollectionNames();
    for (const collectionName of perLevelCollections) {
      // collection name -> model
      const level = collectionName.replace('logblocks_', '').toUpperCase();
      const Model = getLogBlockLevelModel(level);
      await Model.deleteMany({});
    }

    // Recreate genesis block
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
    const LogBlockINFO = getLogBlockLevelModel(data.level);
    await LogBlockINFO.create(genesis.toObject());
    res.json({ message: 'Chain reset. Genesis block created.', genesis });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/logs/block/:id - delete a specific block and maintain chain
router.delete('/block/:id', async (req, res) => {
  try {
    const blockIndex = parseInt(req.params.id);
    if (blockIndex === 0) {
      return res.status(400).json({ error: 'Cannot delete Genesis block' });
    }

    let blocks = await LogBlock.find().sort({ index: 1 });
    const blockToDelete = blocks.find(b => b.index === blockIndex);
    if (!blockToDelete) return res.status(404).json({ error: 'Block not found' });

    // Remove the block
    blocks = blocks.filter(b => b.index !== blockIndex);

    // Rebuild the chain from start to end to maintain hashes
    let previousHash = '0000';
    for (let i = 0; i < blocks.length; i++) {
      blocks[i].index = i;
      if (i > 0) {
        previousHash = blocks[i - 1].hash;
      } else {
        previousHash = '0000';
      }
      blocks[i].previousHash = previousHash;
      blocks[i].hash = calculateHash(blocks[i].index, blocks[i].timestamp, blocks[i].data, blocks[i].previousHash, blocks[i].nonce);
    }

    // Clear db and reinsert
    await LogBlock.deleteMany({});
    const perLevelCollections = getAllLevelCollectionNames();
    for (const collectionName of perLevelCollections) {
      const level = collectionName.replace('logblocks_', '').toUpperCase();
      const Model = getLogBlockLevelModel(level);
      await Model.deleteMany({});
    }

    for (const b of blocks) {
      const newBlock = new LogBlock({
        index: b.index,
        timestamp: b.timestamp,
        data: b.data,
        previousHash: b.previousHash,
        hash: b.hash,
        nonce: b.nonce
      });
      await newBlock.save();
      const LogBlockLevel = getLogBlockLevelModel(b.data.level);
      await LogBlockLevel.create(newBlock.toObject());
    }

    res.json({ message: 'Block deleted and chain maintained successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/logs/:id — single block by index
router.get('/:id', async (req, res) => {
  try {
    const block = await LogBlock.findOne({ index: parseInt(req.params.id) });
    if (!block) return res.status(404).json({ error: 'Block not found' });
    res.json(block);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
