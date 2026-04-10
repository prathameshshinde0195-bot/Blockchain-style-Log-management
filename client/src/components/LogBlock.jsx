import React from 'react'

const LEVEL_STYLES = {
  INFO:  { border: 'border-cyan/40', badge: 'bg-cyan-light text-cyan-dark',  dot: 'bg-cyan',   glow: 'shadow-cyan/10' },
  WARN:  { border: 'border-golden/40', badge: 'bg-golden-light text-golden-dark', dot: 'bg-golden', glow: 'shadow-golden/10' },
  ERROR: { border: 'border-purple/40', badge: 'bg-purple-light text-purple-dark', dot: 'bg-purple', glow: 'shadow-purple/10' },
  DEBUG: { border: 'border-silver/40', badge: 'bg-silver-light text-silver-dark', dot: 'bg-silver', glow: 'shadow-silver/10' }
}

export default function LogBlock({ block, isLatest, onDelete }) {
  const level = block.data?.level || 'INFO'
  const style = LEVEL_STYLES[level] || LEVEL_STYLES.INFO
  const hashShort = block.hash ? `${block.hash.substring(0, 12)}...` : ''
  const prevHashShort = block.previousHash ? `${block.previousHash.substring(0, 12)}...` : ''

  return (
    <div className={`block-card block-animate ${style.border} ${style.glow} ${isLatest ? 'ring-2 ring-purple-light shadow-lg' : 'shadow-sm'}`}>
      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${style.dot} ${isLatest ? 'glow-pulse' : ''}`} />
          <span className="hash-text text-silver-dark font-bold uppercase tracking-wider">Block</span>
          <span className="hash-text text-purple-dark font-extrabold text-sm">#{block.index}</span>
          {isLatest && <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-light text-cyan-dark border border-cyan/20 font-bold">LATEST</span>}
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md ${style.badge} font-extrabold uppercase tracking-tight border border-current/10`}>{level}</span>
          {block.index > 0 && onDelete && (
            <button
              onClick={() => onDelete(block.index)}
              className="text-silver-dark hover:text-purple-dark p-1.5 rounded-full hover:bg-purple-light transition-all"
              title="Delete block and maintain chain"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18"></path>
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Message */}
      <div className="mb-4">
        <p className="text-sm text-slate-700 font-medium leading-relaxed bg-silver-light/30 p-3 rounded-lg border border-silver/20">
          {block.data?.message}
        </p>
      </div>

      {/* Source + timestamp */}
      <div className="flex items-center justify-between text-[11px] text-silver-dark mb-5 px-1 font-bold">
        <span className="hash-text bg-white px-2 py-0.5 rounded border border-silver">⬡ {block.data?.source || 'system'}</span>
        <span className="opacity-80">{new Date(block.timestamp).toLocaleString()}</span>
      </div>

      {/* Hashes */}
      <div className="space-y-2 border-t border-silver/30 pt-4 bg-silver-light/10 -mx-6 px-6 -mb-6 pb-6 rounded-b-xl">
        <div className="flex items-center gap-3">
          <span className="text-[9px] text-silver-dark font-extrabold uppercase w-16 shrink-0 tracking-tighter">Prev Hash</span>
          <span className="hash-text text-silver-dark truncate text-[10px] font-bold bg-white px-2 py-1 rounded border border-silver w-full">{prevHashShort || '000000000000...'}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[9px] text-purple-dark font-extrabold uppercase w-16 shrink-0 tracking-tighter">Hash</span>
          <span className={`hash-text truncate text-[10px] font-bold bg-white px-2 py-1 rounded border border-silver w-full ${style.badge.includes('cyan') ? 'text-cyan-dark' : style.badge.includes('golden') ? 'text-golden-dark' : style.badge.includes('purple') ? 'text-purple-dark' : 'text-silver-dark'}`}>
            {hashShort}
          </span>
        </div>
      </div>
    </div>
  )
}
