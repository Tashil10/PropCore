import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getProperty } from '../api'
import type { Property } from '../types'
import { LeaseSection } from '../components/LeaseSection'
import { MaintenanceSection } from '../components/MaintenanceSection'

export function PropertyDetail() {
  const { id } = useParams<{ id: string }>()
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    let cancelled = false
    setLoading(true)
    setError(null)
    getProperty(id)
      .then((data) => {
        if (!cancelled) setProperty(data)
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [id])

  if (!id) return null
  if (loading) return <p className="text-muted">Loading…</p>
  if (error) return <p className="text-red-600">{error}</p>
  if (!property) return <p className="text-muted">Property not found.</p>

  return (
    <div>
      <Link to="/" className="link-back mb-4 inline-block">
        ← Back to properties
      </Link>
      <p className="text-muted mb-6 max-w-2xl">
        Property details, leases (stored as extracted terms), and maintenance requests. New requests are triaged by AI (urgency and category).
      </p>
      <div className="card glass mb-8">
        <h1 className="text-2xl font-semibold text-primary">{property.address}</h1>
        {property.description && (
          <p className="mt-2 text-muted">{property.description}</p>
        )}
        {property.amenities?.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {property.amenities.map((a) => (
              <span key={a} className="pill">
                {a}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <LeaseSection propertyId={id} />
        <MaintenanceSection propertyId={id} />
      </div>
    </div>
  )
}
