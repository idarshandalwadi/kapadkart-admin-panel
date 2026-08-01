import { Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from '@/features/auth/LoginPage'
import ProtectedRoute from '@/features/auth/ProtectedRoute'
import ShopFormPage from '@/features/shops/ShopFormPage'
import ShopListPage from '@/features/shops/ShopListPage'
import AdminLayout from '@/shared/components/AdminLayout'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/" element={<Navigate to="/shops" replace />} />
          <Route path="/shops" element={<ShopListPage />} />
          <Route path="/shops/new" element={<ShopFormPage />} />
          <Route path="/shops/:slug/edit" element={<ShopFormPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/shops" replace />} />
    </Routes>
  )
}
