export const ROLES = {
  SUPER_ADMINISTRADOR: 'SUPER_ADMINISTRADOR',
  ADMINISTRADOR_EMPRESA: 'ADMINISTRADOR_EMPRESA',
  ADMINISTRADOR_SUCURSAL: 'ADMINISTRADOR_SUCURSAL',
} as const

export type RoleName = (typeof ROLES)[keyof typeof ROLES]

export const roleLabels: Record<string, string> = {
  SUPER_ADMINISTRADOR: 'Super Administrador',
  ADMINISTRADOR_EMPRESA: 'Administrador Empresa',
  ADMINISTRADOR_SUCURSAL: 'Administrador Sucursal',
}

export const roleBadgeVariants: Record<string, string> = {
  SUPER_ADMINISTRADOR: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  ADMINISTRADOR_EMPRESA: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  ADMINISTRADOR_SUCURSAL: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
}
