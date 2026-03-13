import { useState } from 'react'
import { createMaintenance } from '../api'
import type { CreateMaintenanceDto } from '../types'

interface AddMaintenanceFormProps {
  propertyId: string
  onCancel: () => void
  onAdded: () => void
}

export function AddMaintenanceForm({ propertyId, onCancel, onAdded }: AddMaintenanceFormProps) {
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    const dto: CreateMaintenanceDto = { description }
    try {
      await createMaintenance(propertyId, dto)
      onAdded()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4 p-4 rounded-lg bg-[rgba(255,255,255,0.5)] border border-[rgba(184,232,255,0.3)] backdrop-blur-[8px]">
      <label className="block text-sm font-medium text-primary mb-1">Description</label>
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="e.g. Broken tap in kitchen"
        required
        className="input-glass"
      />
      <p className="text-xs text-muted mt-1">AI will triage urgency and category.</p>
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
      <div className="flex gap-2 mt-2">
        <button type="submit" disabled={submitting} className="btn-primary">
          {submitting ? 'Adding…' : 'Add request'}
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
      </div>
    </form>
  )
}
