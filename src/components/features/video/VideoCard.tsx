import { StatusBadge } from '@/components/shared/StatusBadge'
import { Card, CardContent } from '@/components/ui/card'
import type { VideoResponse } from '@/types/video.types' // Importa tu tipo real
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Clock } from 'lucide-react'

// ✅ Helper para convertir segundos a MM:SS o HH:MM:SS
function formatDuration(seconds: number | null): string {
  if (!seconds) return '00:00'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60

  const paddedM = m.toString().padStart(2, '0')
  const paddedS = s.toString().padStart(2, '0')

  if (h > 0) return `${h}:${paddedM}:${paddedS}`
  return `${paddedM}:${paddedS}`
}

interface VideoCardProps {
  video: VideoResponse
  onEdit: (video: VideoResponse) => void
  onToggleStatus: (video: VideoResponse) => void
  onDelete: (video: VideoResponse) => void
  onPlay?: (video: VideoResponse) => void
}

export function VideoCard({ video, onEdit, onToggleStatus, onDelete, onPlay }: VideoCardProps) {
  return (
    <Card className="group border-border/50 flex flex-col overflow-hidden transition-all hover:shadow-md">
      {/* Opciones Superiores (Dropdown) */}
      {/* ... (El Dropdown se mantiene igual) ... */}

      {/* Thumbnail */}
      <div className="bg-muted relative aspect-video w-full overflow-hidden">
        <img
          src={video.thumbnail || '/placeholder-video.jpg'} // Fallback si no hay imagen
          alt={video.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* ... (Botón play se mantiene igual) ... */}
      </div>

      {/* Content */}
      <CardContent className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 text-sm leading-tight font-bold" title={video.name}>
            {video.name}
          </h3>
        </div>

        <div className="text-muted-foreground mt-1 flex items-center gap-2 text-xs">
          <span className="bg-muted rounded px-1.5 py-0.5 text-[10px] font-bold tracking-wide uppercase">
            {video.fileExtension}
          </span>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {/* ✅ Aquí usamos el helper para mostrar 05:20 en lugar de 320 */}
            {formatDuration(video.duration)}
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between pt-4">
          <StatusBadge isActive={video.isActive} />
          <span className="text-muted-foreground text-[10px] font-medium">
            {format(new Date(video.createdAt), 'dd MMM yyyy', { locale: es })}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
