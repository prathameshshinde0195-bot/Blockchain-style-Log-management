# ⛓ BlockLog — Blockchain-Style Log Management System

A tamper-evident audit log system where every entry is cryptographically chained to the previous one using SHA-256 hashing.

## Tech Stack
- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: MongoDB (via Mongoose — use MongoDB Compass to view data)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB running locally on port 27017
- MongoDB Compass (optional, for visual DB inspection)

### 1. Install all dependencies
```bash
npm run install-all
```

### 2. Start both servers (dev mode)
```bash
npm run dev
```

This runs:
- **Backend** → http://localhost:5000
- **Frontend** → http://localhost:5173

---

## 📁 Project Structure

```
blockchain-log-system/
├── client/                     # React frontend (Vite)
│   └── src/
│       ├── api/axios.js         # Axios instance (proxied to backend)
│       ├── components/
│       │   ├── LogChain.jsx     # Renders all blocks with chain connectors
│       │   ├── LogBlock.jsx     # Individual block card
│       │   ├── AddLogForm.jsx   # Form to submit new log entries
│       │   ├── ChainVerifier.jsx # Integrity check button
│       │   └── Dashboard.jsx    # Stats overview
│       └── pages/
│           ├── Home.jsx         # Main page
│           └── Verify.jsx       # Detailed verification page
│
└── server/                     # Node.js + Express backend
    ├── models/LogBlock.js       # Mongoose schema
    ├── routes/logs.js           # REST API routes
    ├── utils/hash.js            # SHA-256 hash calculator
    ├── index.js                 # Server entry + genesis block init
    └── .env                     # MongoDB URI + PORT config
```

---

## 🔌 API Endpoints

| Method | Endpoint           | Description                         |
|--------|--------------------|-------------------------------------|
| GET    | /api/logs          | Get all blocks (sorted by index)    |
| POST   | /api/logs          | Add a new log block                 |
| GET    | /api/logs/:id      | Get single block by index           |
| GET    | /api/logs/verify   | Validate entire chain integrity     |
| DELETE | /api/logs/reset    | Reset chain (dev only)              |
| GET    | /api/health        | Server health check                 |

### POST /api/logs — Request Body
```json
{
  "level": "ERROR",
  "message": "Disk usage exceeded 90%",
  "source": "storage-monitor"
}
```

---

## 🔐 How the Blockchain Works

Each log block contains:
- `index` — sequential block number
- `timestamp` — ISO date string
- `data` — `{ level, message, source }`
- `previousHash` — SHA-256 hash of the previous block
- `hash` — SHA-256 of `(index + timestamp + data + previousHash + nonce)`
- `nonce` — for future proof-of-work extension

**Chain validation**: For every block `i`, the system checks:
1. `block[i].previousHash === block[i-1].hash`
2. `block[i].hash === recalculate(block[i])`

If any block is tampered, verification will catch it immediately.

---

## 🗄 MongoDB Compass

Connect Compass to: `mongodb://localhost:27017`

- **Database**: `blockchain_logs`
- **Collection**: `logblocks`

---

## ✅ First Run Behavior

On server start, if the database is empty, a **Genesis Block** is automatically created:
```json
{
  "index": 0,
  "previousHash": "0000",
  "data": { "level": "INFO", "message": "Genesis Block — Chain Initialized", "source": "system" }
}
```
