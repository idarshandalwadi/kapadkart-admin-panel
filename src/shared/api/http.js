import { clearAdminToken, getAdminToken } from '@/shared/api/adminToken'

const basePath = import.meta.env.BASE_URL.replace(/\/$/, '')
// Empty string should fall back to the Vite base path (dev proxy prefix)
const API_BASE = import.meta.env.VITE_API_BASE_URL || basePath

export async function apiFetch(path, options = {}) {
  const headers = {
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    ...options.headers,
  }

  const token = getAdminToken()
  if (token) headers.Authorization = `Bearer ${token}`

  const base = String(API_BASE).replace(/\/$/, '')
  const res = await fetch(`${base}${path}`, {
    ...options,
    headers,
  })

  const json = await res.json().catch(() => ({}))

  if (res.status === 401) {
    clearAdminToken()
  }

  if (!res.ok || json.success === false) {
    throw new Error(json.message || `Request failed (${res.status})`)
  }

  return json
}
