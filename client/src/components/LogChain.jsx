import React, { useEffect, useRef } from 'react'
import LogBlock from './LogBlock'

export default function LogChain({ blocks, loading, onDelete }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [blocks])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <div className="w-12 h-12 border-4 border-cyan border-t-purple rounded-full animate-spin shadow-lg shadow-cyan/10" />
        <p className="hash-text text-silver-dark font-extrabold uppercase tracking-widest text-xs">Synchronizing Chain...</p>
      </div>
    )
  }

  if (!blocks || blocks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4 text-silver-dark bg-white border border-silver rounded-xl shadow-inner">
        <span className="text-6xl grayscale opacity-20">⛓</span>
        <p className="hash-text font-bold uppercase tracking-widest text-xs">Genesis Block Pending...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-0 pb-8">
      {blocks.map((block, i) => (
        <div key={block._id || block.index} className="flex flex-col items-stretch">
          <LogBlock block={block} isLatest={i === blocks.length - 1} onDelete={onDelete} />
          {i < blocks.length - 1 && (
            <div className="chain-connector py-1">
              <div className="chain-line" />
              <span className="chain-icon">⛓</span>
              <div className="chain-line" />
            </div>
          )}
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  )
}
