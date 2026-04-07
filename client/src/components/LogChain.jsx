import React, { useEffect, useRef } from 'react'
import LogBlock from './LogBlock'

export default function LogChain({ blocks, loading, onDelete }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [blocks])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="hash-text text-slate-500">Loading chain...</p>
      </div>
    )
  }

  if (!blocks || blocks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-2 text-slate-600">
        <span className="text-4xl">⛓</span>
        <p className="hash-text">No blocks in chain</p>
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
