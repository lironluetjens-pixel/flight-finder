import React, { useState } from 'react'

const s = {
  form: {
    background: '#fff',
    borderRadius: 16,
    padding: '32px',
    border: '1px solid #e8e8e4',
    marginBottom: 32,
  },
  title: { fontSize: 28, fontWeight: 600, marginBottom: 8, color: '#111' },
  subtitle: { fontSize: 15, color: '#666', marginBottom: 28 },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 },
  label: { display: 'block', fontSize: 13, fontWeight: 500, color: '#555', marginBottom: 6 },
  input: {
    width: '100%', padding: '10px 14px', fontSize: 15,
    border: '1px solid #ddd', borderRadius: 8, outline: 'none',
    transition: 'border-color 0.15s',
  },
  button: {
    width: '100%', padding: '14px', fontSize: 16, fontWeight: 600,
    background: '#2563eb', color: '#fff', border: 'none',
    borderRadius: 10, cursor: 'pointer', marginTop: 8,
    transition: 'background 0.15s',
  },
  mockBadge: {
    display: 'inline-block', fontSize: 12, background: '#fef3c7',
    color: '#92400e', padding: '4px 10px', borderRadius: 6, marginTop: 16,
  }
}

export default function SearchForm({ onSearch, loading }) {
  const [form, setForm] = useState({
    origin: 'TLV',
    destination: 'BCN',
    departDate: '',
    adults: 2,
    children: 2,
  })

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const submit = (e) => {
    e.preventDefault()
    if (!form.departDate) return alert('Please pick a departure date')
    onSearch(form)
  }

  return (
    <div style={s.form}>
      <div style={s.title}>✈️ Flight Finder</div>
      <div style={s.subtitle}>Smart flights for a family of 4 — ranked by value, timing & baggage</div>

      <form onSubmit={submit}>
        <div style={s.grid}>
          <div>
            <label style={s.label}>From</label>
            <input style={s.input} value={form.origin} onChange={set('origin')} placeholder="TLV" />
          </div>
          <div>
            <label style={s.label}>To</label>
            <input style={s.input} value={form.destination} onChange={set('destination')} placeholder="BCN" />
          </div>
          <div>
            <label style={s.label}>Departure date</label>
            <input style={s.input} type="date" value={form.departDate} onChange={set('departDate')} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={s.label}>Adults</label>
              <input style={s.input} type="number" min={1} max={9} value={form.adults} onChange={set('adults')} />
            </div>
            <div>
              <label style={s.label}>Children</label>
              <input style={s.input} type="number" min={0} max={9} value={form.children} onChange={set('children')} />
            </div>
          </div>
        </div>

        <button style={s.button} type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Find best flights →'}
        </button>
      </form>

      <div style={s.mockBadge}>⚡ Running with demo data until API key is added</div>
    </div>
  )
}
