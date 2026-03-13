export interface Property {
  _id: string
  address: string
  amenities: string[]
  description: string
  createdAt?: string
  updatedAt?: string
}

export interface Lease {
  _id: string
  propertyId: string
  extractedTerms: Record<string, unknown>
  status: string
  originalFileName: string | null
  createdAt?: string
  updatedAt?: string
}

export interface Maintenance {
  _id: string
  propertyId: string
  description: string
  urgency: string
  category: string
  status: string
  triagedAt?: string
  createdAt?: string
  updatedAt?: string
}

export interface CreatePropertyDto {
  address: string
  description?: string
  amenities?: string[]
}

export interface CreateLeaseDto {
  extractedTerms: Record<string, unknown>
  status?: string
  originalFileName?: string | null
}

export interface CreateMaintenanceDto {
  description: string
}
