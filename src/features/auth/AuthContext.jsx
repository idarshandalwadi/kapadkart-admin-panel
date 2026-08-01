import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { clearAdminKey, getAdminKey, setAdminKey } from '@/shared/api/adminKey'
import { apiFetch } from '@/shared/api/http'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [authenticated, setAuthenticated] = useState(() => Boolean(getAdminKey()))

  const login = useCallback(async (adminKey) => {
    setAdminKey(adminKey.trim())
    try {
      // Verify key by listing tenants
      await apiFetch('/api/tenants')
      setAuthenticated(true)
    } catch (error) {
      clearAdminKey()
      setAuthenticated(false)
      throw error
    }
  }, [])

  const logout = useCallback(() => {
    clearAdminKey()
    setAuthenticated(false)
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
