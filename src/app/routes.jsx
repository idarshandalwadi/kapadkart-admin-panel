import { Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from '@/features/auth/LoginPage'
import ProtectedRoute from '@/features/auth/ProtectedRoute'
import { useAuth } from '@/features/auth/AuthContext'
import ShopFormPage from '@/features/shops/ShopFormPage'
import ShopListPage from '@/features/shops/ShopListPage'
import AdminLayout from '@/shared/components/AdminLayout'

function CatchAllRedirect() {
  const { authenticated } = useAuth()
  return <Navigate to={authenticated ? '/shops' : '/login'} replace />
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/" element={<Navigate to="/shops" replace />} />
          <Route path="/shops" element={<ShopListPage />} />
          <Route path="/shops/new" element={<ShopFormPage key="new" />} />
          <Route path="/shops/:slug/edit" element={<ShopFormPage key="edit" />} />
        </Route>
      </Route>
      <Route path="*" element={<CatchAllRedirect />} />
    </Routes>
  )
}
