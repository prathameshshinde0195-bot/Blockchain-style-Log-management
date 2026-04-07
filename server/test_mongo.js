const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/blockchain_logs', { serverSelectionTimeoutMS: 5000 })
  .then(() => {
    console.log('MongoDB is running locally.');
    process.exit(0);
  })
  .catch(err => {
    console.error('MongoDB error:', err.message);
    process.exit(1);
  });
