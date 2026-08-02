const TOKEN_STORAGE = 'kapadkart_admin_token'

export function getAdminToken() {
  return sessionStorage.getItem(TOKEN_STORAGE) || ''
}

export function setAdminToken(token) {
  sessionStorage.setItem(TOKEN_STORAGE, token)
}

export function clearAdminToken() {
  sessionStorage.removeItem(TOKEN_STORAGE)
}
