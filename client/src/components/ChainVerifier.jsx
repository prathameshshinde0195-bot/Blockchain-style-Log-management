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
    <div className="bg-white border border-silver rounded-xl p-6 shadow-sm">
      <h2 className="text-sm font-extrabold text-purple-dark mb-5 flex items-center gap-2 uppercase tracking-tight">
        <span className="text-purple text-lg">✦</span> Integrity Status
      </h2>

      <button
        onClick={verify}
        disabled={loading}
        className="w-full py-3 rounded-xl border-2 border-purple/20 bg-purple-light/30 hover:bg-purple-light/50 disabled:opacity-50 text-purple-dark text-xs font-extrabold uppercase tracking-widest transition-all flex items-center justify-center gap-3"
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-purple border-t-transparent rounded-full animate-spin" />
            Scanning...
          </>
        ) : (
          <>
            <span className="text-lg">🔍</span>
            <span>Verify Chain</span>
          </>
        )}
      </button>

      {result && (
        <div className={`mt-5 p-4 rounded-xl border-2 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300 ${
          result.valid
            ? 'bg-cyan-light/30 border-cyan/30 text-cyan-dark'
            : 'bg-purple-light/40 border-purple/30 text-purple-dark'
        }`}>
          <div className="flex items-center gap-3 font-extrabold mb-2 uppercase tracking-tight text-xs">
            {result.valid ? (
              <span className="bg-cyan text-white w-5 h-5 flex items-center justify-center rounded-full text-[10px]">✓</span>
            ) : (
              <span className="bg-purple text-white w-5 h-5 flex items-center justify-center rounded-full text-[10px]">✕</span>
            )}
            {result.valid ? 'Chain Integrity Intact' : 'Tamper Detected'}
          </div>
          <p className="text-[11px] font-bold opacity-70 leading-relaxed">
            {result.valid
              ? `Cryptographic proof confirmed for ${result.totalBlocks} blocks.`
              : result.reason || `Inconsistency found at block sequence #${result.brokenAt}`}
          </p>
        </div>
      )}
    </div>
  )
}
