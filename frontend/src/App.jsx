import React, { useState } from 'react'
import axios from 'axios'
import SearchForm from './components/SearchForm'
import FlightCard from './components/FlightCard'

export default function App() {
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchMeta, setSearchMeta] = useState(null)

  const handleSearch = async (formData) => {
    setLoading(true)
    setError(null)
    setResults(null)

    try {
      const { data } = await axios.post('/api/search', formData)
      setResults(data.results)
      setSearchMeta(data)
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  const s = {
    page: { maxWidth: 800, margin: '0 auto', padding: '40px 20px' },
    resultsHeader: {
      display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
      marginBottom: 16,
    },
    heading: { fontSize: 20, fontWeight: 600, color: '#111' },
    meta: { fontSize: 13, color: '#999' },
    error: {
      background: '#fee2e2', color: '#991b1b', padding: '14px 18px',
      borderRadius: 10, border: '1px solid #fecaca', marginBottom: 20,
    },
    loading: {
      textAlign: 'center', padding: '60px 20px', color: '#888', fontSize: 16,
    },
    empty: {
      textAlign: 'center', padding: '60px 20px', color: '#aaa', fontSize: 15,
    },
    legend: {
      display: 'flex', gap: 20, marginBottom: 20, fontSize: 13, color: '#666',
    },
    dot: (color) => ({
      display: 'inline-block', width: 10, height: 10,
      borderRadius: '50%', background: color, marginRight: 5,
    })
  }

  return (
    <div style={s.page}>
      <SearchForm onSearch={handleSearch} loading={loading} />

      {error && <div style={s.error}>⚠️ {error}</div>}

      {loading && (
        <div style={s.loading}>
          ✈️ Searching for the best flights...
        </div>
      )}

      {results && (
        <>
          <div style={s.resultsHeader}>
            <div style={s.heading}>
              Top {results.length} flights · {searchMeta?.origin} → {searchMeta?.destination}
            </div>
            <div style={s.meta}>
              {searchMeta?.usingMockData ? '⚡ Demo data' : '🔴 Live prices'} · {searchMeta?.departDate}
            </div>
          </div>

          <div style={s.legend}>
            <span><span style={s.dot('#16a34a')} />Book — great deal, act now</span>
            <span><span style={s.dot('#ca8a04')} />Wait — decent, check back</span>
            <span><span style={s.dot('#dc2626')} />Ignore — not worth it</span>
          </div>

          {results.length === 0 ? (
            <div style={s.empty}>No flights found for this route and date.</div>
          ) : (
            results.map((flight, i) => (
              <FlightCard key={i} flight={flight} rank={i + 1} />
            ))
          )}
        </>
      )}
    </div>
  )
}
