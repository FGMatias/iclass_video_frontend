import { formatDuration } from '@/lib/utils'
import type { VideoSimple } from '@/types/video.types'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Clock, GripVertical, PlayCircle, X } from 'lucide-react'

interface SortablePlaylistItemProps {
  id: number
  item: VideoSimple
  index: number
  onRemove: (videoId: number) => void
}

export function SortablePlaylistItem({ id, item, index, onRemove }: SortablePlaylistItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group border-border bg-card relative flex items-center gap-3 rounded-lg border p-3 shadow-sm transition-all ${
        isDragging ? 'border-primary/50 shadow-md' : 'hover:border-primary/50 hover:shadow-md'
      }`}
    >
      <div
        {...attributes}
        {...listeners}
        className="text-muted-foreground/50 hover:text-foreground cursor-grab p-1 active:cursor-grabbing"
      >
        <GripVertical className="h-5 w-5" />
      </div>

      <div className="bg-secondary text-secondary-foreground flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium">
        {index}
      </div>

      <div className="bg-muted border-border flex h-10 w-16 shrink-0 items-center justify-center overflow-hidden rounded border">
        {item.thumbnail ? (
          <img src={item.thumbnail} alt={item.name} className="h-full w-full object-cover" />
        ) : (
          <PlayCircle className="text-muted-foreground/70 h-4 w-4" />
        )}
      </div>

      <div className="flex flex-1 flex-col justify-center gap-0.5 overflow-hidden">
        <span className="truncate text-sm leading-none font-medium">{item.name}</span>
        <span className="text-muted-foreground text-xs">{item.fileExtension}</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="text-muted-foreground bg-secondary/50 flex items-center rounded px-2 py-1 text-xs">
          <Clock className="mr-1 h-3 w-3" /> {formatDuration(item.duration)}
        </div>
        <button
          className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive focus-visible:ring-ring flex h-8 w-8 shrink-0 items-center justify-center rounded-md transition-colors focus-visible:ring-1 focus-visible:outline-none"
          onClick={() => onRemove(item.id)}
        >
          <span className="sr-only">Remover</span>
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
