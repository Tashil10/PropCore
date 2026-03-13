import { useState } from 'react'
import { createLease } from '../api'
import type { CreateLeaseDto } from '../types'

interface AddLeaseFormProps {
  propertyId: string
  onCancel: () => void
  onAdded: () => void
}

const defaultTerms = {
  monthlyRent: 1200,
  deposit: 2400,
  startDate: '2025-01-01',
  endDate: '2026-01-01',
}

export function AddLeaseForm({ propertyId, onCancel, onAdded }: AddLeaseFormProps) {
  const [termsJson, setTermsJson] = useState(JSON.stringify(defaultTerms, null, 2))
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    let extractedTerms: Record<string, unknown>
    try {
      extractedTerms = JSON.parse(termsJson)
    } catch {
      setError('Invalid JSON')
      return
    }
    setSubmitting(true)
    const dto: CreateLeaseDto = { extractedTerms, status: 'draft' }
    try {
      await createLease(propertyId, dto)
      onAdded()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4 p-4 rounded-lg bg-[rgba(255,255,255,0.5)] border border-[rgba(184,232,255,0.3)] backdrop-blur-[8px]">
      <label className="block text-sm font-medium text-primary mb-1">Extracted terms (JSON)</label>
      <textarea
        value={termsJson}
        onChange={(e) => setTermsJson(e.target.value)}
        rows={6}
        className="input-glass font-mono text-sm"
      />
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
      <div className="flex gap-2 mt-2">
        <button type="submit" disabled={submitting} className="btn-primary">
          {submitting ? 'Adding…' : 'Add lease'}
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
      </div>
    </form>
  )
}
