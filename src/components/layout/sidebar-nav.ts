import { ROLES } from '@/constants/roles'
import {
  Building2,
  GitBranch,
  Layers,
  LayoutDashboard,
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
    defaultPath: '/usuarios',
    groups: [
      {
        label: 'GESTIÓN',
        items: [
          { title: 'Usuarios', url: '/usuarios', icon: Users },
          { title: 'Empresas', url: '/empresas', icon: Building2 },
        ],
      },
      {
        label: 'SISTEMA',
        items: [{ title: 'Configuración', url: '/configuracion', icon: Settings }],
      },
    ],
  },
  [ROLES.ADMINISTRADOR_EMPRESA]: {
    defaultPath: '/dashboard',
    groups: [
      {
        label: 'GESTIÓN',
        items: [
          { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
          { title: 'Usuarios', url: '/usuarios', icon: Users },
          { title: 'Sucursales', url: '/sucursales', icon: GitBranch },
          { title: 'Videos', url: '/videos', icon: Video },
        ],
      },
    ],
  },
  [ROLES.ADMINISTRADOR_SUCURSAL]: {
    defaultPath: '/videos',
    groups: [
      {
        label: 'GESTIÓN',
        items: [
          { title: 'Videos', url: '/videos', icon: Video },
          { title: 'Areas', url: '/area', icon: Layers },
          { title: 'Dispositivos', url: '/dispositivos', icon: MonitorSmartphone },
        ],
      },
      {
        label: 'SISTEMA',
        items: [{ title: 'Configuración', url: '/configuracion', icon: Settings }],
      },
    ],
  },
}

export function getNavigation(roleId: number): RoleNavConfig {
  return navigationByRole[roleId] ?? navigationByRole[ROLES.SUPER_ADMINISTRADOR]
}
