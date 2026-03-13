import { useEffect, useState } from 'react'
import { getMaintenance } from '../api'
import type { Maintenance } from '../types'
import { AddMaintenanceForm } from './AddMaintenanceForm'

interface MaintenanceSectionProps {
  propertyId: string
}

export function MaintenanceSection({ propertyId }: MaintenanceSectionProps) {
  const [items, setItems] = useState<Maintenance[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const data = await getMaintenance(propertyId)
      setItems(data)
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
      <p className="text-sm text-muted mb-3">New requests are triaged by Gemini (urgency: low/medium/high, category: plumbing, electrical, etc.).</p>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-primary">Maintenance</h2>
        <button
          type="button"
          onClick={() => setShowAdd(true)}
          className="text-sm font-medium text-accent hover:underline"
        >
          + Add request
        </button>
      </div>
      {showAdd && (
        <AddMaintenanceForm
          propertyId={propertyId}
          onCancel={() => setShowAdd(false)}
          onAdded={onAdded}
        />
      )}
      {loading ? (
        <p className="text-sm text-muted">Loading…</p>
      ) : items.length === 0 && !showAdd ? (
        <p className="text-sm text-muted">No maintenance requests yet.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((m) => (
            <li
              key={m._id}
              className="rounded-lg border border-[rgba(184,232,255,0.25)] bg-[rgba(255,255,255,0.5)] p-3 text-sm backdrop-blur-[8px]"
            >
              <p className="text-primary">{m.description}</p>
              <p className="mt-1 text-muted">
                {m.urgency} · {m.category}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
