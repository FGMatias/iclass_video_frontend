import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDuration } from '@/lib/utils'
import type { VideoSimple } from '@/types/video.types'
import { closestCenter, DndContext, DragOverlay } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { GripVertical, Plus, Timer } from 'lucide-react'
import { SortablePlaylistItem } from './SortablePlaylistItem'
import { usePlaylist } from './usePlaylist'

interface CurrentPlaylistCardProps {
  serverPlaylist: VideoSimple[]
  onSyncPlaylist: (selectedIds: number[]) => void
  onAddVideoClick: () => void
}

export function CurrentPlaylistCard({
  serverPlaylist,
  onSyncPlaylist,
  onAddVideoClick,
}: CurrentPlaylistCardProps) {
  const {
    localPlaylist,
    totalDuration,
    activeId,
    sensors,
    handleDragStart,
    handleDragEnd,
    handleRemoveFromPlaylist,
  } = usePlaylist(serverPlaylist, onSyncPlaylist)

  return (
    <Card className="flex flex-col shadow-sm lg:col-span-2">
      <CardHeader className="border-border/40 flex flex-row items-center justify-between border-b pb-4">
        <div className="space-y-1">
          <CardTitle className="text-lg">Playlist Actual</CardTitle>
          <CardDescription>Reordena los videos arrastrando los items.</CardDescription>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-3 p-6 pt-0">
        {localPlaylist.length > 0 ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={localPlaylist.map((p) => p.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="no-scrollbar relative max-h-[260px] overflow-y-auto pr-1">
                <div className="space-y-3 pb-2">
                  {localPlaylist.map((item, index) => (
                    <SortablePlaylistItem
                      key={item.id}
                      id={item.id}
                      item={item}
                      index={index + 1}
                      onRemove={handleRemoveFromPlaylist}
                    />
                  ))}
                </div>
              </div>
            </SortableContext>

            <DragOverlay>
              {activeId ? (
                <div className="border-primary bg-card flex cursor-grabbing items-center gap-3 rounded-lg border p-3 opacity-80 shadow-lg">
                  <GripVertical className="text-muted-foreground h-5 w-5" />
                  <div className="flex-1">
                    <span className="text-sm font-medium">
                      {localPlaylist.find((p) => p.id === activeId)?.name ?? 'Moviendo...'}
                    </span>
                  </div>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        ) : (
          <div className="text-muted-foreground flex flex-1 items-center justify-center rounded-lg border border-dashed py-12 text-center text-sm">
            No hay videos en la playlist.
          </div>
        )}

        <div className="bg-muted/20 border-border/50 mt-4 flex flex-col items-center justify-between gap-4 rounded-lg border p-4 sm:flex-row">
          <div className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
            <Timer className="h-4 w-4" />
            Duración Total:{' '}
            <span className="text-foreground font-bold">{formatDuration(totalDuration)}</span>
          </div>
          <Button size="sm" className="h-9 w-full sm:w-auto" onClick={onAddVideoClick}>
            <Plus className="mr-2 h-4 w-4" /> Agregar Video
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
