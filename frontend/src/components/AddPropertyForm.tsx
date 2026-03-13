import { useState } from 'react'
import { createProperty } from '../api'
import type { CreatePropertyDto } from '../types'

interface AddPropertyFormProps {
  onCancel: () => void
  onAdded: () => void
}

export function AddPropertyForm({ onCancel, onAdded }: AddPropertyFormProps) {
  const [address, setAddress] = useState('')
  const [description, setDescription] = useState('')
  const [amenitiesStr, setAmenitiesStr] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    const amenities = amenitiesStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    const dto: CreatePropertyDto = { address, description: description || undefined, amenities }
    try {
      await createProperty(dto)
      onAdded()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="card glass mb-8">
      <h2 className="text-lg font-semibold text-primary mb-4">Add property</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-primary mb-1">Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            className="input-glass"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-primary mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="input-glass"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-primary mb-1">Amenities (comma-separated)</label>
          <input
            type="text"
            value={amenitiesStr}
            onChange={(e) => setAmenitiesStr(e.target.value)}
            placeholder="e.g. parking, garden, gym"
            className="input-glass"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex gap-2">
          <button type="submit" disabled={submitting} className="btn-primary">
            {submitting ? 'Adding…' : 'Add property'}
          </button>
          <button type="button" onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
