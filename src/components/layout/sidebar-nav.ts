import { ROLES } from '@/constants/roles'
import { ROUTES } from '@/constants/routes'
import {
  Building2,
  GitBranch,
  Layers,
  MonitorSmartphone,
  Settings,
  Users,
  Video,
  type LucideIcon,
} from 'lucide-react'

export interface NavItem {
  title: string
  url: string
  icon: LucideIcon
}

export interface NavGroup {
  label: string
  items: NavItem[]
}

export interface RoleNavConfig {
  groups: NavGroup[]
  defaultPath: string
}

export const navigationByRole: Record<number, RoleNavConfig> = {
  [ROLES.SUPER_ADMINISTRADOR]: {
    defaultPath: ROUTES.ADMINISTRATOR.USER,
    groups: [
      {
        label: 'GESTIÓN',
        items: [
          { title: 'Usuarios', url: ROUTES.ADMINISTRATOR.USER, icon: Users },
          { title: 'Empresas', url: ROUTES.ADMINISTRATOR.COMPANY, icon: Building2 },
        ],
      },
      {
        label: 'SISTEMA',
        items: [
          { title: 'Configuración', url: ROUTES.ADMINISTRATOR.CONFIGURATION, icon: Settings },
        ],
      },
    ],
  },
  [ROLES.ADMINISTRADOR_EMPRESA]: {
    defaultPath: ROUTES.COMPANY_ADMINISTRATOR.USER,
    groups: [
      {
        label: 'GESTIÓN',
        items: [
          { title: 'Usuarios', url: ROUTES.COMPANY_ADMINISTRATOR.USER, icon: Users },
          { title: 'Sucursales', url: ROUTES.COMPANY_ADMINISTRATOR.BRANCH, icon: GitBranch },
          { title: 'Videos', url: ROUTES.COMPANY_ADMINISTRATOR.VIDEO, icon: Video },
        ],
      },
    ],
  },
  [ROLES.ADMINISTRADOR_SUCURSAL]: {
    defaultPath: ROUTES.BRANCH_ADMINISTRATOR.VIDEO,
    groups: [
      {
        label: 'GESTIÓN',
        items: [
          { title: 'Videos', url: ROUTES.BRANCH_ADMINISTRATOR.VIDEO, icon: Video },
          { title: 'Areas', url: ROUTES.BRANCH_ADMINISTRATOR.AREA, icon: Layers },
          {
            title: 'Dispositivos',
            url: ROUTES.BRANCH_ADMINISTRATOR.DEVICE,
            icon: MonitorSmartphone,
          },
        ],
      },
      {
        label: 'SISTEMA',
        items: [
          {
            title: 'Configuración',
            url: ROUTES.BRANCH_ADMINISTRATOR.CONFIGURATION,
            icon: Settings,
          },
        ],
      },
    ],
  },
}

export function getNavigation(roleId: number): RoleNavConfig {
  return navigationByRole[roleId] ?? navigationByRole[ROLES.SUPER_ADMINISTRADOR]
}
