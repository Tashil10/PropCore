import { useEffect, useState } from 'react'
import { getLeases } from '../api'
import type { Lease } from '../types'
import { AddLeaseForm } from './AddLeaseForm'

interface LeaseSectionProps {
  propertyId: string
}

export function LeaseSection({ propertyId }: LeaseSectionProps) {
  const [leases, setLeases] = useState<Lease[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const data = await getLeases(propertyId)
      setLeases(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [propertyId])

  const onAdded = () => {
    setShowAdd(false)
    load()
  }

  return (
    <div className="card glass">
      <p className="text-sm text-muted mb-3">Leases store extracted terms (rent, deposit, dates) as JSON; no PDF upload in this demo.</p>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-primary">Leases</h2>
        <button
          type="button"
          onClick={() => setShowAdd(true)}
          className="text-sm font-medium text-accent hover:underline"
        >
          + Add lease
        </button>
      </div>
      {showAdd && (
        <AddLeaseForm
          propertyId={propertyId}
          onCancel={() => setShowAdd(false)}
          onAdded={onAdded}
        />
      )}
      {loading ? (
        <p className="text-sm text-muted">Loading…</p>
      ) : leases.length === 0 && !showAdd ? (
        <p className="text-sm text-muted">No leases yet.</p>
      ) : (
        <ul className="space-y-3">
          {leases.map((lease) => (
            <li
              key={lease._id}
              className="rounded-lg border border-[rgba(184,232,255,0.25)] bg-[rgba(255,255,255,0.5)] p-3 text-sm backdrop-blur-[8px]"
            >
              <span className="font-medium text-primary">{lease.status}</span>
              {lease.extractedTerms && typeof lease.extractedTerms === 'object' && (
                <div className="mt-1 text-muted">
                  {Object.entries(lease.extractedTerms).slice(0, 4).map(([k, v]) =>
                    v != null ? (
                      <span key={k} className="mr-3">
                        {k}: {String(v)}
                      </span>
                    ) : null
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
