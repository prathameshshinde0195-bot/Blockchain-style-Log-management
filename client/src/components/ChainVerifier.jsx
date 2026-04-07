import React, { useState } from 'react'
import api from '../api/axios'

export default function ChainVerifier() {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const verify = async () => {
    setLoading(true)
    setResult(null)
    try {
      const res = await api.get('/logs/verify')
      setResult(res.data)
    } catch (err) {
      setResult({ valid: false, reason: err.response?.data?.error || 'Verification failed' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-[#111118] border border-white/10 rounded-xl p-5">
      <h2 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
        <span className="text-purple-400">✦</span> Chain Integrity
      </h2>

      <button
        onClick={verify}
        disabled={loading}
        className="w-full py-2.5 rounded-lg border border-purple-500/40 bg-purple-500/10 hover:bg-purple-500/20 disabled:opacity-50 text-purple-300 text-sm font-semibold transition-colors flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
            Verifying...
          </>
        ) : (
          '🔍 Verify Chain'
        )}
      </button>

      {result && (
        <div className={`mt-4 p-3 rounded-lg border text-sm ${
          result.valid
            ? 'bg-green-500/10 border-green-500/30 text-green-300'
            : 'bg-red-500/10 border-red-500/30 text-red-300'
        }`}>
          <div className="flex items-center gap-2 font-semibold mb-1">
            {result.valid ? '✅ Chain is Valid' : '❌ Chain Tampered'}
          </div>
          <p className="text-xs opacity-80">
            {result.valid
              ? `${result.totalBlocks} blocks verified successfully`
              : result.reason || `Broken at block #${result.brokenAt}`}
          </p>
        </div>
      )}
    </div>
  )
}
