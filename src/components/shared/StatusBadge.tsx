import { ThemeContext } from '@/hooks/useTheme'
import { useContext } from 'react'
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
  const themeContext = useContext(ThemeContext)
  const isDark = themeContext?.theme === 'dark'

  return (
    <Badge
      variant="outline"
      className={
        isActive
          ? isDark
            ? 'border-transparent bg-emerald-600/40 text-emerald-300'
            : 'border-transparent bg-emerald-100 text-emerald-800'
          : isDark
            ? 'border-transparent bg-red-600/40 text-red-300'
            : 'border-transparent bg-red-100 text-red-800'
      }
    >
      {isActive ? activeLabel : inactiveLabel}
    </Badge>
  )
}
