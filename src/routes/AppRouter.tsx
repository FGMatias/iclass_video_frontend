import { AreaDetailPage } from '@/components/features/area/AreaDetailPage'
import { BranchDetailPage } from '@/components/features/branch/BranchDetailPage'
import { CompanyDetailPage } from '@/components/features/company/CompanyDetailPage'
import { AppLayout } from '@/components/layout/AppLayout'
import { ROLES } from '@/constants/roles'
import { ROUTES } from '@/constants/routes'
import { BranchPage } from '@/pages/branch/BranchPage'
import { CompanyPage } from '@/pages/company/CompanyPage'
import { SystemConfigPage } from '@/pages/configuration/SystemConfigPage'
import { LoginPage } from '@/pages/login/LoginPage'
import { UserPage } from '@/pages/user/UserPage'
import { VideoPage } from '@/pages/video/VideoPage'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'
import { RoleRoute } from './RoleAuth'
import { RootRedirect } from './RootRedirect'

const router = createBrowserRouter([
  {
    path: ROUTES.LOGIN,
    element: <LoginPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <RootRedirect />,
      },
      {
        element: <AppLayout />,
        children: [
          {
            element: <RoleRoute allowedRole={ROLES.SUPER_ADMINISTRADOR} />,
            children: [
              {
                path: ROUTES.ADMINISTRATOR.USER,
                element: <UserPage />,
                handle: { group: 'GESTIÓN', title: 'Usuarios' },
              },
              {
                path: ROUTES.ADMINISTRATOR.COMPANY,
                element: <CompanyPage />,
                handle: { group: 'GESTIÓN', title: 'Empresas' },
              },
              {
                path: ROUTES.ADMINISTRATOR.COMPANY_DETAIL,
                element: <CompanyDetailPage />,
                handle: { group: 'GESTIÓN', title: 'Detalle de Empresa' },
              },
              {
                path: ROUTES.ADMINISTRATOR.CONFIGURATION,
                element: <SystemConfigPage />,
                handle: { group: 'SISTEMA', title: 'Configuración' },
              },
            ],
          },
          {
            element: <RoleRoute allowedRole={ROLES.ADMINISTRADOR_EMPRESA} />,
            children: [
              {
                path: ROUTES.COMPANY_ADMINISTRATOR.USER,
                element: <UserPage />,
                handle: { group: 'GESTIÓN', title: 'Usuarios' },
              },
              {
                path: ROUTES.COMPANY_ADMINISTRATOR.BRANCH,
                element: <BranchPage />,
                handle: { group: 'GESTIÓN', title: 'Sucursales' },
              },
              {
                path: ROUTES.COMPANY_ADMINISTRATOR.BRANCH_DETAIL,
                element: <BranchDetailPage />,
                handle: { group: 'GESTIÓN', title: 'Detalle Sucursal' },
              },
              {
                path: ROUTES.COMPANY_ADMINISTRATOR.AREA_DETAIL,
                element: <AreaDetailPage />,
                handle: { group: 'GESTIÓN', title: 'Detalle Área' },
              },
              {
                path: ROUTES.COMPANY_ADMINISTRATOR.VIDEO,
                element: <VideoPage />,
                handle: { group: 'GESTIÓN', title: 'Videos' },
              },
            ],
          },
          {
            element: <RoleRoute allowedRole={ROLES.ADMINISTRADOR_SUCURSAL} />,
            children: [
              {
                path: ROUTES.BRANCH_ADMINISTRATOR.VIDEO,
                element: <Placeholder titulo="Video" />,
                handle: { group: 'GESTIÓN', title: 'Videos' },
              },
              {
                path: ROUTES.BRANCH_ADMINISTRATOR.AREA,
                element: <Placeholder titulo="Áreas" />,
                handle: { group: 'GESTIÓN', title: 'Áreas' },
              },
              {
                path: ROUTES.BRANCH_ADMINISTRATOR.DEVICE,
                element: <Placeholder titulo="Dispositivos" />,
                handle: { group: 'GESTIÓN', title: 'Dispositivos' },
              },
              {
                path: ROUTES.BRANCH_ADMINISTRATOR.CONFIGURATION,
                element: <Placeholder titulo="Configuración" />,
                handle: { group: 'SISTEMA', title: 'Configuración' },
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <RootRedirect />,
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}

function Placeholder({ titulo }: { titulo: string }) {
  return (
    <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white">
      <p className="text-lg text-slate-400">
        Módulo <span className="font-semibold text-slate-600">{titulo}</span> — próximamente
      </p>
    </div>
  )
}
