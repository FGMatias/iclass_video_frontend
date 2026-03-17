import { CompanyDetailPage } from '@/components/features/company/CompanyDetailPage'
import { AppLayout } from '@/components/layout/AppLayout'
import { CompanyPage } from '@/pages/company/CompanyPage'
import { SystemConfigPage } from '@/pages/configuration/SystemConfigPage'
import { LoginPage } from '@/pages/login/LoginPage'
import { UsersPage } from '@/pages/user/UserPage'
import { Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'
import { RoleRedirect } from './RoleRedirect'

export function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<RoleRedirect />} />

        <Route element={<AppLayout />}>
          <Route path="/usuarios" element={<UsersPage />} />
          <Route path="/empresas" element={<CompanyPage />} />
          <Route path="/empresas/:id" element={<CompanyDetailPage />} />
          <Route path="/configuracion" element={<SystemConfigPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
