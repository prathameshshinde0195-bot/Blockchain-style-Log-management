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
    <div className="min-h-screen bg-silver-light">
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: '#ffffff', color: '#1e293b', border: '1px solid #e5e7eb' }
        }}
      />

      {/* Header */}
      <header className="border-b border-silver bg-white/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">⛓</span>
            <div>
              <h1 className="hash-text text-purple-dark font-extrabold text-xl tracking-tight">BlockLog</h1>
              <p className="text-[10px] text-silver-dark font-bold uppercase tracking-wider">Blockchain-Style Log Management</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-silver shadow-sm">
            <span className="w-2 h-2 rounded-full bg-cyan animate-pulse" />
            <span className="hash-text text-xs text-silver-dark font-medium">Network Secured</span>
          </div>
        </div>
      </header>

      {/* Main layout */}
      <div className="max-w-7xl mx-auto px-6 py-10 flex gap-8">

        {/* Left sidebar */}
        <aside className="w-80 shrink-0 flex flex-col gap-6 sticky top-28 self-start">
          <AddLogForm onLogAdded={handleLogAdded} />
          <ChainVerifier />
          <Dashboard blocks={blocks} />
        </aside>

        {/* Main chain view */}
        <main className="flex-1 min-w-0">
          {/* Filter bar */}
          <div className="flex items-center gap-3 mb-8 bg-white p-3 rounded-lg border border-silver shadow-sm">
            <span className="text-xs text-silver-dark font-bold px-2 uppercase">Filter</span>
            <div className="flex items-center gap-2">
              {LEVELS.map(lvl => (
                <button
                  key={lvl}
                  onClick={() => setFilter(lvl)}
                  className={`hash-text text-xs px-4 py-1.5 rounded-md border font-bold transition-all ${
                    filter === lvl
                      ? (lvl === 'INFO' ? 'text-cyan-dark border-cyan bg-cyan-light' : 
                         lvl === 'WARN' ? 'text-golden-dark border-golden bg-golden-light' :
                         lvl === 'ERROR' ? 'text-purple-dark border-purple bg-purple-light' :
                         lvl === 'DEBUG' ? 'text-silver-dark border-silver bg-silver-light' :
                         'text-purple-dark border-purple bg-purple-light')
                      : 'text-silver-dark border-silver hover:border-cyan hover:text-cyan-dark'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
            <span className="ml-auto hash-text text-xs text-silver-dark font-medium px-2">
              Showing {filteredBlocks.length} records
            </span>
          </div>

          {/* Chain */}
          <LogChain blocks={filteredBlocks} loading={loading} onDelete={handleDeleteBlock} />
        </main>
      </div>
    </div>
  )
}
