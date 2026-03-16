import { Badge } from '../ui/badge'

interface StatusBadgeProps {
  isActive: boolean
  activeLabel?: string
  inactiveLabel?: string
}

export function StatusBadge({
  isActive,
  activeLabel = 'Activo',
  inactiveLabel = 'Inactivo',
}: StatusBadgeProps) {
  return (
    <Badge
      variant={isActive ? 'default' : 'secondary'}
      className={isActive ? 'bg-emerald-600/40 text-emerald-300' : 'bg-red-600/40 text-red-300'}
    >
      {isActive ? activeLabel : inactiveLabel}
    </Badge>
  )
}
