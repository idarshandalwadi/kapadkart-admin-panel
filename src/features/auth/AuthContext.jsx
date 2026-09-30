import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { getAdminToken, setAdminToken } from '@/shared/api/adminToken'
import { apiFetch, retireAdminSession } from '@/shared/api/http'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [authenticated, setAuthenticated] = useState(() => Boolean(getAdminToken()))

  const login = useCallback(async (email, password) => {
    const json = await apiFetch('/api/platform-auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: String(email).trim(), password }),
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
    const token = getAdminToken()
    // Drop the local session before the logout request. The login route sends a
    // still-authenticated admin back to the dashboard, and those calls then fail
    // once the server revokes the token.
    retireAdminSession()
    setAuthenticated(false)
    if (!token) return
    try {
      await apiFetch('/api/platform-auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
    } catch {
      // Local session is already cleared.
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
