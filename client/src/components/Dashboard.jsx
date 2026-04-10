import React from 'react'

const LEVEL_STYLES = {
  INFO:  { color: 'text-cyan-dark',    bg: 'bg-cyan-light',   border: 'border-cyan/30'   },
  WARN:  { color: 'text-golden-dark',  bg: 'bg-golden-light', border: 'border-golden/30' },
  ERROR: { color: 'text-purple-dark',  bg: 'bg-purple-light', border: 'border-purple/30' },
  DEBUG: { color: 'text-silver-dark',  bg: 'bg-silver-light', border: 'border-silver/30'  }
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
    <div className="bg-white border border-silver rounded-xl p-6 shadow-sm">
      <h2 className="text-sm font-extrabold text-purple-dark mb-5 flex items-center gap-2 uppercase tracking-tight">
        <span className="text-cyan text-lg">◈</span> Analytics
      </h2>

      {/* Total blocks */}
      <div className="mb-6 p-4 rounded-xl bg-silver-light/20 border border-silver text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 p-1">
          <div className="w-12 h-12 rounded-full bg-cyan/5 -mr-6 -mt-6 border border-cyan/10"></div>
        </div>
        <div className="hash-text text-4xl font-extrabold text-purple-dark relative z-10">{blocks.length}</div>
        <div className="text-[10px] font-extrabold text-silver-dark mt-1 uppercase tracking-widest relative z-10">Chain Length</div>
      </div>

      {/* Level breakdown */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {Object.entries(counts).map(([level, count]) => {
          const s = LEVEL_STYLES[level]
          return (
            <div key={level} className={`p-3 rounded-xl border ${s.bg} ${s.border} transition-all hover:scale-[1.02] cursor-default shadow-sm`}>
              <div className={`hash-text text-xl font-extrabold ${s.color}`}>{count}</div>
              <div className="text-[9px] font-extrabold text-silver-dark opacity-70 uppercase tracking-tighter">{level}</div>
            </div>
          )
        })}
      </div>

      {/* Latest block hash */}
      {latest && (
        <div className="border-t border-silver/30 pt-4">
          <div className="text-[9px] font-extrabold text-silver-dark mb-2 uppercase tracking-widest">Active Head Hash</div>
          <div className="hash-text text-[9px] text-purple-dark/60 break-all leading-relaxed bg-silver-light/30 p-2 rounded border border-silver/20 font-bold">
            {latest.hash}
          </div>
        </div>
      )}
    </div>
  )
}
