import React, { useState } from 'react'
import toast from 'react-hot-toast'
import api from '../api/axios'

const LEVELS = ['INFO', 'WARN', 'ERROR', 'DEBUG']

const LEVEL_COLORS = {
  INFO:  'text-cyan-dark border-cyan/50 bg-cyan-light',
  WARN:  'text-golden-dark border-golden/50 bg-golden-light',
  ERROR: 'text-purple-dark border-purple/50 bg-purple-light',
  DEBUG: 'text-silver-dark border-silver/30 bg-silver-light'
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
    <div className="bg-white border border-silver rounded-xl p-6 shadow-sm">
      <h2 className="text-sm font-extrabold text-purple-dark mb-5 flex items-center gap-2 uppercase tracking-tight">
        <span className="text-cyan">✚</span> Add New Block
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Level selector */}
        <div>
          <label className="block text-xs font-bold text-silver-dark mb-2 uppercase tracking-wider">Log Level</label>
          <div className="grid grid-cols-2 gap-2">
            {LEVELS.map(lvl => (
              <button
                key={lvl}
                type="button"
                onClick={() => setForm(prev => ({ ...prev, level: lvl }))}
                className={`hash-text text-[10px] px-3 py-2 rounded-md border font-extrabold transition-all tracking-tighter ${
                  form.level === lvl
                    ? LEVEL_COLORS[lvl]
                    : 'text-silver-dark border-silver/50 bg-silver-light/20 hover:border-cyan/40'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Source */}
        <div>
          <label className="block text-xs font-bold text-silver-dark mb-2 uppercase tracking-wider">Source Identity</label>
          <input
            type="text"
            value={form.source}
            onChange={e => setForm(prev => ({ ...prev, source: e.target.value }))}
            placeholder="e.g. auth-service"
            className="w-full bg-white border border-silver rounded-lg px-4 py-2.5 text-sm text-purple-dark placeholder-silver focus:outline-none focus:ring-2 focus:ring-cyan/20 focus:border-cyan transition-all hash-text font-bold"
          />
        </div>

        {/* Message */}
        <div>
          <label className="block text-xs font-bold text-silver-dark mb-2 uppercase tracking-wider">Log Message</label>
          <textarea
            value={form.message}
            onChange={e => setForm(prev => ({ ...prev, message: e.target.value }))}
            placeholder="Describe the log event..."
            rows={3}
            className="w-full bg-white border border-silver rounded-lg px-4 py-2.5 text-sm text-purple-dark placeholder-silver focus:outline-none focus:ring-2 focus:ring-cyan/20 focus:border-cyan transition-all resize-none shadow-inner"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-purple-dark hover:bg-purple disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-extrabold uppercase tracking-widest transition-all shadow-md shadow-purple/20 flex items-center justify-center gap-3"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Mining...
            </>
          ) : (
            <>
              <span>⛏</span>
              <span>Mine Block</span>
            </>
          )}
        </button>
      </form>
    </div>
  )
}
