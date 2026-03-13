import { useState } from 'react'
import { Link } from 'react-router-dom'
import { searchProperties } from '../api'
import type { Property } from '../types'

export function Search() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Property[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    setLoading(true)
    setError(null)
    setResults(null)
    try {
      const data = await searchProperties(query.trim())
      setResults(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Search failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-primary mb-4">Semantic search</h1>
      <p className="text-muted mb-6 max-w-2xl">
        Find properties by meaning, not just keywords. Descriptions and amenities are embedded with Gemini; results are ranked by similarity (e.g. &quot;garden&quot;, &quot;parking&quot;, &quot;river view&quot;).
      </p>
      <form onSubmit={handleSearch} className="flex gap-2 max-w-xl mb-8">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. garden, parking"
          className="input-glass flex-1"
        />
        <button
          type="submit"
          disabled={loading}
          className="btn-primary"
        >
          {loading ? 'Searching…' : 'Search'}
        </button>
      </form>

      {error && (
        <div className="card glass border-red-200 bg-red-50/80 p-4 text-red-800 mb-6">
          {error}
        </div>
      )}

      {results && (
        <div>
          <h2 className="text-lg font-medium text-primary mb-4">
            {results.length} result{results.length !== 1 ? 's' : ''}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {results.map((p) => (
              <Link
                key={p._id}
                to={`/properties/${p._id}`}
                className="card-link"
              >
                <h3 className="font-medium text-primary">{p.address}</h3>
                {p.description && (
                  <p className="mt-1 text-sm text-muted line-clamp-2">{p.description}</p>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
