import { apiFetch } from '@/shared/api/http'

export async function listShops({ includeDeleted = false } = {}) {
  const qs = includeDeleted ? '?include_deleted=true' : ''
  const json = await apiFetch(`/api/tenants${qs}`)
  return json.data
}

export async function getShop(slug) {
  const json = await apiFetch(`/api/tenants/${encodeURIComponent(slug)}`)
  return json.data
}

export async function createShop(payload) {
  return apiFetch('/api/tenants', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function updateShop(slug, payload) {
  return apiFetch(`/api/tenants/${encodeURIComponent(slug)}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export async function softDeleteShop(slug) {
  return apiFetch(`/api/tenants/${encodeURIComponent(slug)}`, {
    method: 'DELETE',
  })
}

export async function restoreShop(slug) {
  return apiFetch(`/api/tenants/${encodeURIComponent(slug)}/restore`, {
    method: 'POST',
  })
}

export async function setShopStatus(slug, status) {
  return apiFetch(`/api/tenants/${encodeURIComponent(slug)}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
}
