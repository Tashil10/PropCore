import type { Property, Lease, Maintenance, CreatePropertyDto, CreateLeaseDto, CreateMaintenanceDto } from './types'

const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

async function fetchApi<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }))
    throw new Error((err as { message?: string }).message ?? res.statusText)
  }
  return res.json()
}

export async function getProperties(limit = 50, skip = 0) {
  return fetchApi<Property[]>(`/properties?limit=${limit}&skip=${skip}`)
}

export async function getProperty(id: string) {
  return fetchApi<Property>(`/properties/${id}`)
}

export async function createProperty(dto: CreatePropertyDto) {
  return fetchApi<Property>('/properties', {
    method: 'POST',
    body: JSON.stringify(dto),
  })
}

export async function searchProperties(query: string) {
  return fetchApi<Property[]>('/properties/search', {
    method: 'POST',
    body: JSON.stringify({ query }),
  })
}

export async function getLeases(propertyId: string) {
  return fetchApi<Lease[]>(`/properties/${propertyId}/leases`)
}

export async function createLease(propertyId: string, dto: CreateLeaseDto) {
  return fetchApi<Lease>(`/properties/${propertyId}/leases`, {
    method: 'POST',
    body: JSON.stringify(dto),
  })
}

export async function getMaintenance(propertyId: string) {
  return fetchApi<Maintenance[]>(`/properties/${propertyId}/maintenance`)
}

export async function createMaintenance(propertyId: string, dto: CreateMaintenanceDto) {
  return fetchApi<Maintenance>(`/properties/${propertyId}/maintenance`, {
    method: 'POST',
    body: JSON.stringify(dto),
  })
}

