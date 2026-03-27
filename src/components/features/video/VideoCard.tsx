import { StatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { formatDuration } from '@/lib/utils'
import type { VideoResponse } from '@/types/video.types'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Clock, MoreVertical, Pencil, Play, ShieldCheck, ShieldOff, Trash2 } from 'lucide-react'

interface VideoCardProps {
  video: VideoResponse
  onEdit: (video: VideoResponse) => void
  onToggleStatus: (video: VideoResponse) => void
  onDelete: (video: VideoResponse) => void
  onPlay?: (video: VideoResponse) => void
}

export function VideoCard({ video, onEdit, onToggleStatus, onDelete, onPlay }: VideoCardProps) {
  return (
    <Card className="group flex flex-col gap-0 overflow-hidden p-0 transition-all hover:shadow-md">
      <div className="bg-muted relative aspect-video w-full overflow-hidden">
        <div className="absolute top-2 right-2 z-10">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60 focus-visible:ring-0"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => onEdit(video)}>
                <Pencil className="mr-2 h-4 w-4" />
                Editar Información
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onToggleStatus(video)}>
                {video.isActive ? (
                  <>
                    <ShieldOff className="text-destructive mr-2 h-4 w-4" />
                    <span className="text-destructive">Desactivar</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    Activar
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(video)}
                className="text-destructive focus:bg-destructive focus:text-destructive-foreground"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <img
          src={video.thumbnail || '/placeholder-video.jpg'}
          alt={video.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={() => onPlay?.(video)}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-colors hover:bg-white/30"
          >
            <Play className="ml-1 h-6 w-6 fill-white text-white" />
          </button>
        </div>
      </div>

      <CardContent className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="line-clamp-2 text-lg leading-tight font-semibold" title={video.name}>
          {video.name}
        </h3>

        <div className="text-muted-foreground flex items-center gap-2 text-xs">
          <span className="bg-secondary text-secondary-foreground rounded px-1.5 py-0.5 font-semibold uppercase">
            {video.fileExtension}
          </span>
          <span>•</span>
          <div className="flex items-center gap-1 text-sm font-medium">
            <Clock className="h-3.5 w-3.5" />
            {formatDuration(video.duration)}
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between pt-2">
          <StatusBadge isActive={video.isActive} />
          <span className="text-muted-foreground text-sm font-medium">
            {format(new Date(video.createdAt), 'dd MMM yyyy', { locale: es })}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
