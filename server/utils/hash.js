const crypto = require('crypto');

function calculateHash(index, timestamp, data, previousHash, nonce = 0) {
  return crypto
    .createHash('sha256')
    .update(index + timestamp + JSON.stringify(data) + previousHash + nonce)
    .digest('hex');
}

module.exports = { calculateHash };
