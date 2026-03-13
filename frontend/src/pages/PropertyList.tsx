import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getProperties } from '../api'
import type { Property } from '../types'
import { AddPropertyForm } from '../components/AddPropertyForm'

export function PropertyList() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAdd, setShowAdd] = useState(false)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getProperties()
      setProperties(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load properties')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const onAdded = () => {
    setShowAdd(false)
    load()
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <p className="text-muted">Loading properties…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card glass border-red-200 bg-red-50/80 p-4 text-red-800">
        <p>{error}</p>
        <p className="text-sm mt-2">Make sure the API is running (e.g. docker compose up).</p>
      </div>
    )
  }

  return (
    <div>
      <p className="text-muted mb-6 max-w-2xl">
        All your properties in one place. Each property can have leases (with extracted terms) and maintenance requests. Click a card to open details.
      </p>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-semibold text-primary">Properties</h1>
        <button
          type="button"
          onClick={() => setShowAdd(true)}
          className="btn-primary"
        >
          Add property
        </button>
      </div>

      {showAdd && (
        <AddPropertyForm
          onCancel={() => setShowAdd(false)}
          onAdded={onAdded}
        />
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {properties.map((p) => (
          <Link
            key={p._id}
            to={`/properties/${p._id}`}
            className="card-link"
          >
            <h2 className="font-medium text-primary">{p.address}</h2>
            {p.description && (
              <p className="mt-1 text-sm text-muted line-clamp-2">{p.description}</p>
            )}
            {p.amenities?.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {p.amenities.slice(0, 3).map((a) => (
                  <span key={a} className="pill text-xs">
                    {a}
                  </span>
                ))}
              </div>
            )}
          </Link>
        ))}
      </div>
      {properties.length === 0 && !showAdd && (
        <p className="text-muted py-8">No properties yet. Add one to get started.</p>
      )}
    </div>
  )
}
