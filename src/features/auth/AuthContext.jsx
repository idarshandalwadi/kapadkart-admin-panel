import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { clearAdminToken, getAdminToken, setAdminToken } from '@/shared/api/adminToken'
import { apiFetch } from '@/shared/api/http'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [authenticated, setAuthenticated] = useState(() => Boolean(getAdminToken()))

  const login = useCallback(async (username, password) => {
    const json = await apiFetch('/api/platform-auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    })
    const token = json?.data?.token
    if (!token) {
      throw new Error('Login failed')
    }
    setAdminToken(token)
    setAuthenticated(true)
    return json.data
  }, [])

  const logout = useCallback(async () => {
    try {
      if (getAdminToken()) {
        await apiFetch('/api/platform-auth/logout', { method: 'POST' })
      }
    } catch {
      // ignore logout API errors — clear local session either way
    } finally {
      clearAdminToken()
      setAuthenticated(false)
    }
  }, [])

  const value = useMemo(
    () => ({ authenticated, login, logout }),
    [authenticated, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
