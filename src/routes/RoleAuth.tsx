import { ROUTES } from '@/constants/routes'
import { useAuth } from '@/hooks/useAuth'
import { Navigate, Outlet } from 'react-router-dom'

interface RoleRouteProps {
  allowedRole: number
}

export function RoleRoute({ allowedRole }: RoleRouteProps) {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  if (user.roleId !== allowedRole) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
