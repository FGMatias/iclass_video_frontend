import { ROUTES } from '@/constants/routes'
import { useAuth } from '@/hooks/useAuth'
import { useAuthStore } from '@/stores/auth.store'
import { Navigate, Outlet } from 'react-router-dom'

export function ProtectedRoute() {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated && useAuthStore.isTokenExpired()) {
    useAuthStore.logout()
    return <Navigate to={ROUTES.LOGIN} replace state={{ reason: 'expired' }} />
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  return <Outlet />
}
