import { clearAdminKey, getAdminKey } from '@/shared/api/adminKey'

const API_BASE = import.meta.env.VITE_API_BASE_URL || ''

export async function apiFetch(path, options = {}) {
  const headers = {
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    ...options.headers,
  }

  const key = getAdminKey()
  if (key) headers['X-Admin-Key'] = key

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  })

  const json = await res.json().catch(() => ({}))

  if (res.status === 401) {
    clearAdminKey()
  }

  if (!res.ok || json.success === false) {
    throw new Error(json.message || `Request failed (${res.status})`)
  }

  return json
}
