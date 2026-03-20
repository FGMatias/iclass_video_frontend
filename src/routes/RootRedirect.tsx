import { ROLES } from '@/constants/roles'
import { ROUTES } from '@/constants/routes'
import { useAuth } from '@/hooks/useAuth'
import { Navigate } from 'react-router-dom'

export function RootRedirect() {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  switch (user.roleId) {
    case ROLES.SUPER_ADMINISTRADOR:
      return <Navigate to={ROUTES.ADMINISTRATOR.USER} replace />
    case ROLES.ADMINISTRADOR_EMPRESA:
      return <Navigate to={ROUTES.COMPANY_ADMINISTRATOR.USER} replace />
    case ROLES.ADMINISTRADOR_SUCURSAL:
      return <Navigate to={ROUTES.BRANCH_ADMINISTRATOR.VIDEO} replace />
    default:
      return <Navigate to={ROUTES.LOGIN} replace />
  }
}
