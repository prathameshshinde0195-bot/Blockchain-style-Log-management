import React from 'react'

const LEVEL_STYLES = {
  INFO:  { border: 'border-blue-500/40',  badge: 'bg-blue-500/20 text-blue-300',  dot: 'bg-blue-400',  glow: 'shadow-blue-500/20'  },
  WARN:  { border: 'border-yellow-500/40', badge: 'bg-yellow-500/20 text-yellow-300', dot: 'bg-yellow-400', glow: 'shadow-yellow-500/20' },
  ERROR: { border: 'border-red-500/40',   badge: 'bg-red-500/20 text-red-300',    dot: 'bg-red-400',   glow: 'shadow-red-500/20'   },
  DEBUG: { border: 'border-slate-500/40', badge: 'bg-slate-500/20 text-slate-300', dot: 'bg-slate-400', glow: 'shadow-slate-500/20' }
}

export default function LogBlock({ block, isLatest, onDelete }) {
  const level = block.data?.level || 'INFO'
  const style = LEVEL_STYLES[level] || LEVEL_STYLES.INFO
  const hashShort = block.hash ? `${block.hash.substring(0, 12)}...` : ''
  const prevHashShort = block.previousHash ? `${block.previousHash.substring(0, 12)}...` : ''

  return (
    <div className={`block-card block-animate ${style.border} border shadow-lg ${style.glow} ${isLatest ? 'ring-1 ring-white/10' : ''}`}>
      {/* Header row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${style.dot} ${isLatest ? 'glow-pulse' : ''}`} style={{ color: style.dot.replace('bg-', '') }} />
          <span className="hash-text text-slate-400">Block</span>
          <span className="hash-text text-white font-bold">#{block.index}</span>
          {isLatest && <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/10">LATEST</span>}
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-xs font-mono px-2 py-0.5 rounded ${style.badge} font-semibold`}>{level}</span>
          {block.index > 0 && onDelete && (
            <button
              onClick={() => onDelete(block.index)}
              className="text-slate-500 hover:text-red-400 p-1 rounded hover:bg-red-500/10 transition-colors"
              title="Delete block and maintain chain"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18"></path>
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Message */}
      <p className="text-sm text-slate-200 mb-3 font-sans leading-relaxed">{block.data?.message}</p>

      {/* Source + timestamp */}
      <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
        <span className="hash-text">⬡ {block.data?.source || 'system'}</span>
        <span>{new Date(block.timestamp).toLocaleString()}</span>
      </div>

      {/* Hashes */}
      <div className="space-y-1.5 border-t border-white/5 pt-3">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-600 w-20 shrink-0">PREV HASH</span>
          <span className="hash-text text-slate-500 truncate">{prevHashShort}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-600 w-20 shrink-0">HASH</span>
          <span className={`hash-text truncate ${style.badge.includes('blue') ? 'text-blue-400' : style.badge.includes('yellow') ? 'text-yellow-400' : style.badge.includes('red') ? 'text-red-400' : 'text-slate-400'}`}>
            {hashShort}
          </span>
        </div>
      </div>
    </div>
  )
}
