import { Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from '@/features/auth/LoginPage'
import ProtectedRoute from '@/features/auth/ProtectedRoute'
import { useAuth } from '@/features/auth/AuthContext'
import PlatformDashboardPage from '@/features/dashboard/PlatformDashboardPage'
import ShopFormPage from '@/features/shops/ShopFormPage'
import ShopListPage from '@/features/shops/ShopListPage'
import EmailLogsPage from '@/features/emails/EmailLogsPage'
import AdminLayout from '@/shared/components/AdminLayout'

function CatchAllRedirect() {
  const { authenticated } = useAuth()
  return <Navigate to={authenticated ? '/dashboard' : '/login'} replace />
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<PlatformDashboardPage />} />
          <Route path="/shops" element={<ShopListPage />} />
          <Route path="/shops/new" element={<ShopFormPage key="new" />} />
          <Route path="/shops/:slug/edit" element={<ShopFormPage key="edit" />} />
          <Route path="/emails" element={<EmailLogsPage />} />
        </Route>
      </Route>
      <Route path="*" element={<CatchAllRedirect />} />
    </Routes>
  )
}
