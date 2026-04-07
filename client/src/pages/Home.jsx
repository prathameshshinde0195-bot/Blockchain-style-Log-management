import React, { useState, useEffect, useCallback } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import api from '../api/axios'
import LogChain from '../components/LogChain'
import AddLogForm from '../components/AddLogForm'
import ChainVerifier from '../components/ChainVerifier'
import Dashboard from '../components/Dashboard'

export default function Home() {
  const [blocks, setBlocks] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')

  const fetchBlocks = useCallback(async () => {
    try {
      const res = await api.get('/logs')
      setBlocks(res.data)
    } catch (err) {
      console.error('Failed to fetch logs:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBlocks()
  }, [fetchBlocks])

  const handleLogAdded = (newBlock) => {
    setBlocks(prev => [...prev, newBlock])
  }

  const handleDeleteBlock = async (index) => {
    if (index === 0) {
      toast.error('Cannot delete Genesis block');
      return;
    }
    const toastId = toast.loading('Deleting block and rebuilding chain...');
    try {
      await api.delete(`/logs/block/${index}`);
      await fetchBlocks();
      toast.success('Block deleted and chain maintained', { id: toastId });
    } catch (err) {
      console.error('Failed to delete log:', err);
      toast.error('Failed to delete block', { id: toastId });
    }
  }

  const LEVELS = ['ALL', 'INFO', 'WARN', 'ERROR', 'DEBUG']
  const FILTER_STYLES = {
    ALL:   'text-white border-white/30 bg-white/5',
    INFO:  'text-blue-400 border-blue-500/40 bg-blue-500/10',
    WARN:  'text-yellow-400 border-yellow-500/40 bg-yellow-500/10',
    ERROR: 'text-red-400 border-red-500/40 bg-red-500/10',
    DEBUG: 'text-slate-400 border-slate-500/40 bg-slate-500/10'
  }

  const filteredBlocks = filter === 'ALL'
    ? blocks
    : blocks.filter(b => b.data?.level === filter)

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: '#1a1a2e', color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.1)' }
        }}
      />

      {/* Header */}
      <header className="border-b border-white/5 bg-[#0d0d16]/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⛓</span>
            <div>
              <h1 className="hash-text text-white font-bold text-lg tracking-tight">BlockLog</h1>
              <p className="text-[10px] text-slate-600">Blockchain-Style Log Management</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="hash-text text-xs text-slate-500">MongoDB Connected</span>
          </div>
        </div>
      </header>

      {/* Main layout */}
      <div className="max-w-7xl mx-auto px-6 py-8 flex gap-6">

        {/* Left sidebar */}
        <aside className="w-72 shrink-0 flex flex-col gap-4 sticky top-24 self-start">
          <AddLogForm onLogAdded={handleLogAdded} />
          <ChainVerifier />
          <Dashboard blocks={blocks} />
        </aside>

        {/* Main chain view */}
        <main className="flex-1 min-w-0">
          {/* Filter bar */}
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            <span className="text-xs text-slate-600 mr-1">Filter:</span>
            {LEVELS.map(lvl => (
              <button
                key={lvl}
                onClick={() => setFilter(lvl)}
                className={`hash-text text-xs px-3 py-1 rounded border transition-all ${
                  filter === lvl
                    ? FILTER_STYLES[lvl]
                    : 'text-slate-600 border-slate-800 hover:border-slate-600'
                }`}
              >
                {lvl}
              </button>
            ))}
            <span className="ml-auto hash-text text-xs text-slate-600">
              {filteredBlocks.length} block{filteredBlocks.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Chain */}
          <LogChain blocks={filteredBlocks} loading={loading} onDelete={handleDeleteBlock} />
        </main>
      </div>
    </div>
  )
}
