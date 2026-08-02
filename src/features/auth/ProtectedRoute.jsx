import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/features/auth/AuthContext'
import { getAdminToken } from '@/shared/api/adminToken'

export default function ProtectedRoute() {
  const { authenticated } = useAuth()
  if (!authenticated || !getAdminToken()) return <Navigate to="/login" replace />
  return <Outlet />
}
