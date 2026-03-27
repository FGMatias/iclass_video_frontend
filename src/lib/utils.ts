import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getInitials(name: string): string {
  if (!name) return '??'

  return name
    .trim()
    .split(' ')
    .filter((word) => word.length > 0)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function formatDuration(seconds: number | null): string {
  if (!seconds) return '00:00'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60

  const paddedM = m.toString().padStart(2, '0')
  const paddedS = s.toString().padStart(2, '0')

  if (h > 0) return `${h}:${paddedM}:${paddedS}`
  return `${paddedM}:${paddedS}`
}
