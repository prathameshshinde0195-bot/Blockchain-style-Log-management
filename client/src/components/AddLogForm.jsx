import React, { useState } from 'react'
import toast from 'react-hot-toast'
import api from '../api/axios'

const LEVELS = ['INFO', 'WARN', 'ERROR', 'DEBUG']

const LEVEL_COLORS = {
  INFO:  'text-blue-400 border-blue-500/50 bg-blue-500/10',
  WARN:  'text-yellow-400 border-yellow-500/50 bg-yellow-500/10',
  ERROR: 'text-red-400 border-red-500/50 bg-red-500/10',
  DEBUG: 'text-slate-400 border-slate-500/50 bg-slate-500/10'
}

export default function AddLogForm({ onLogAdded }) {
  const [form, setForm] = useState({ level: 'INFO', message: '', source: 'system' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.message.trim()) {
      toast.error('Message cannot be empty')
      return
    }

    setLoading(true)
    try {
      const res = await api.post('/logs', form)
      toast.success(`Block #${res.data.index} added to chain`)
      setForm(prev => ({ ...prev, message: '', source: 'system' }))
      onLogAdded && onLogAdded(res.data)
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to add log')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-[#111118] border border-white/10 rounded-xl p-5">
      <h2 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
        <span className="text-green-400">+</span> Add New Log Block
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Level selector */}
        <div>
          <label className="block text-xs text-slate-500 mb-2">Log Level</label>
          <div className="flex gap-2 flex-wrap">
            {LEVELS.map(lvl => (
              <button
                key={lvl}
                type="button"
                onClick={() => setForm(prev => ({ ...prev, level: lvl }))}
                className={`hash-text text-xs px-3 py-1.5 rounded border transition-all ${
                  form.level === lvl
                    ? LEVEL_COLORS[lvl]
                    : 'text-slate-600 border-slate-700/50 bg-transparent hover:border-slate-600'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Source */}
        <div>
          <label className="block text-xs text-slate-500 mb-2">Source</label>
          <input
            type="text"
            value={form.source}
            onChange={e => setForm(prev => ({ ...prev, source: e.target.value }))}
            placeholder="e.g. auth-service, api-gateway"
            className="w-full bg-[#0d0d14] border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-blue-500/50 transition-colors hash-text"
          />
        </div>

        {/* Message */}
        <div>
          <label className="block text-xs text-slate-500 mb-2">Message</label>
          <textarea
            value={form.message}
            onChange={e => setForm(prev => ({ ...prev, message: e.target.value }))}
            placeholder="Describe the log event..."
            rows={3}
            className="w-full bg-[#0d0d14] border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-blue-500/50 transition-colors resize-none font-sans"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Mining block...
            </>
          ) : (
            '⛏ Mine Block'
          )}
        </button>
      </form>
    </div>
  )
}
