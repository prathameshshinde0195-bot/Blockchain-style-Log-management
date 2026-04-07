import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

export default function Verify() {
  const [blocks, setBlocks] = useState([])
  const [verifyResult, setVerifyResult] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.get('/logs').then(res => setBlocks(res.data)).catch(console.error)
  }, [])

  const runVerify = async () => {
    setLoading(true)
    try {
      const res = await api.get('/logs/verify')
      setVerifyResult(res.data)
    } catch (err) {
      setVerifyResult({ valid: false, reason: 'Server error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] p-6">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="hash-text text-xs text-slate-500 hover:text-slate-300 transition-colors mb-6 inline-block">
          ← Back to Chain
        </Link>

        <h1 className="hash-text text-2xl font-bold text-white mb-2">Chain Verification</h1>
        <p className="text-sm text-slate-500 mb-8">Cryptographically validate every block in the chain</p>

        <button
          onClick={runVerify}
          disabled={loading}
          className="mb-8 px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-semibold transition-colors flex items-center gap-2"
        >
          {loading ? (
            <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Verifying all {blocks.length} blocks...</>
          ) : (
            `🔍 Verify All ${blocks.length} Blocks`
          )}
        </button>

        {verifyResult && (
          <div className={`p-5 rounded-xl border mb-8 ${verifyResult.valid ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
            <div className={`text-lg font-bold mb-2 ${verifyResult.valid ? 'text-green-300' : 'text-red-300'}`}>
              {verifyResult.valid ? '✅ Chain is Intact' : '❌ Chain Compromised'}
            </div>
            <p className="text-sm text-slate-400">
              {verifyResult.valid
                ? `All ${verifyResult.totalBlocks} blocks verified. Hashes match throughout the entire chain.`
                : verifyResult.reason || `Integrity broken at block #${verifyResult.brokenAt}`}
            </p>
          </div>
        )}

        {/* Block list */}
        <div className="space-y-2">
          {blocks.map(block => (
            <div key={block._id} className="bg-[#111118] border border-white/5 rounded-lg p-4 flex items-center gap-4">
              <span className="hash-text text-slate-600 w-10">#{block.index}</span>
              <span className={`text-xs px-2 py-0.5 rounded font-mono ${
                block.data?.level === 'ERROR' ? 'bg-red-500/20 text-red-300' :
                block.data?.level === 'WARN' ? 'bg-yellow-500/20 text-yellow-300' :
                block.data?.level === 'DEBUG' ? 'bg-slate-500/20 text-slate-300' :
                'bg-blue-500/20 text-blue-300'
              }`}>{block.data?.level}</span>
              <span className="text-sm text-slate-300 flex-1 truncate">{block.data?.message}</span>
              <span className="hash-text text-[10px] text-slate-600 truncate w-32">{block.hash.substring(0, 16)}...</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
