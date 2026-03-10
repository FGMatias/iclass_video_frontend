export const ROLES = {
  SUPER_ADMINISTRADOR: 1,
  ADMINISTRADOR_EMPRESA: 2,
  ADMINISTRADOR_SUCURSAL: 3,
  VISUALIZADOR: 4,
} as const

export type RoleId = (typeof ROLES)[keyof typeof ROLES]

export const MANAGED_ROLE_BY_USER_ROL: Record<number, number | undefined> = {
  [ROLES.SUPER_ADMINISTRADOR]: ROLES.ADMINISTRADOR_EMPRESA,
  [ROLES.ADMINISTRADOR_EMPRESA]: ROLES.ADMINISTRADOR_SUCURSAL,
  [ROLES.ADMINISTRADOR_SUCURSAL]: undefined,
}

export const ROLE_BADGE_VARIANTS: Record<number, string> = {
  [ROLES.SUPER_ADMINISTRADOR]:
    'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-100',
  [ROLES.ADMINISTRADOR_EMPRESA]: 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100',
  [ROLES.ADMINISTRADOR_SUCURSAL]:
    'bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-100',
  [ROLES.VISUALIZADOR]: 'bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-100',
}
