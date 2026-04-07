import React from 'react'

const LEVEL_STYLES = {
  INFO:  { color: 'text-blue-400',   bg: 'bg-blue-500/10',   border: 'border-blue-500/20'   },
  WARN:  { color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
  ERROR: { color: 'text-red-400',    bg: 'bg-red-500/10',    border: 'border-red-500/20'    },
  DEBUG: { color: 'text-slate-400',  bg: 'bg-slate-500/10',  border: 'border-slate-500/20'  }
}

export default function Dashboard({ blocks }) {
  if (!blocks || blocks.length === 0) return null

  const counts = { INFO: 0, WARN: 0, ERROR: 0, DEBUG: 0 }
  blocks.forEach(b => {
    const lvl = b.data?.level || 'INFO'
    if (counts[lvl] !== undefined) counts[lvl]++
  })

  const latest = blocks[blocks.length - 1]

  return (
    <div className="bg-[#111118] border border-white/10 rounded-xl p-5">
      <h2 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
        <span className="text-cyan-400">◈</span> Dashboard
      </h2>

      {/* Total blocks */}
      <div className="mb-4 p-3 rounded-lg bg-white/5 border border-white/10 text-center">
        <div className="hash-text text-3xl font-bold text-white">{blocks.length}</div>
        <div className="text-xs text-slate-500 mt-1">Total Blocks</div>
      </div>

      {/* Level breakdown */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {Object.entries(counts).map(([level, count]) => {
          const s = LEVEL_STYLES[level]
          return (
            <div key={level} className={`p-2.5 rounded-lg border ${s.bg} ${s.border}`}>
              <div className={`hash-text text-lg font-bold ${s.color}`}>{count}</div>
              <div className="text-[10px] text-slate-500">{level}</div>
            </div>
          )
        })}
      </div>

      {/* Latest block hash */}
      {latest && (
        <div className="border-t border-white/5 pt-3">
          <div className="text-[10px] text-slate-600 mb-1">LATEST HASH</div>
          <div className="hash-text text-[10px] text-slate-400 break-all leading-relaxed">
            {latest.hash}
          </div>
        </div>
      )}
    </div>
  )
}
