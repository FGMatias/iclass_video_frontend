import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { formatDuration } from '@/lib/utils'
import type { VideoResponse } from '@/types/video.types'
import { Check } from 'lucide-react'
import { useState } from 'react'

interface PlaylistFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  availableVideos: VideoResponse[]
  currentPlaylistIds?: number[]
  onConfirm: (selectedIds: number[]) => void
  onUploadNew?: () => void
  isLoading?: boolean
}

export function PlaylistForm({
  open,
  onOpenChange,
  availableVideos,
  currentPlaylistIds = [],
  onConfirm,
  onUploadNew,
  isLoading,
}: PlaylistFormProps) {
  const [selectedIds, setSelectedIds] = useState<number[]>(currentPlaylistIds)

  const toggleSelection = (videoId: number) => {
    setSelectedIds((prev) =>
      prev.includes(videoId) ? prev.filter((id) => id !== videoId) : [...prev, videoId],
    )
  }

  const handleConfirm = () => {
    onConfirm(selectedIds)
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="flex h-full w-full flex-col sm:max-w-md md:max-w-lg">
        <DrawerHeader className="border-border relative shrink-0 border-b p-6 pb-4 text-left">
          <DrawerTitle className="text-lg font-semibold">Gestionar Playlist</DrawerTitle>
          <DrawerDescription className="text-sm">
            Selecciona o sube nuevos videos para esta área.
          </DrawerDescription>
          <DrawerClose asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground absolute top-4 right-4 opacity-70 hover:opacity-100"
            >
              <span className="sr-only">Close</span>
            </Button>
          </DrawerClose>
        </DrawerHeader>

        <div className="no-scrollbar flex-1 space-y-6 overflow-y-auto p-6">
          <div className="space-y-3">
            {availableVideos.map((video) => {
              const isSelected = selectedIds.includes(video.id)

              return (
                <div
                  key={video.id}
                  className={`flex items-center gap-3 rounded-lg border p-3 shadow-sm transition-all ${
                    isSelected
                      ? 'border-primary bg-primary/5'
                      : 'border-border bg-card hover:border-primary/50'
                  }`}
                >
                  <div className="border-border bg-muted flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded border">
                    {video.thumbnail && (
                      <img
                        src={video.thumbnail}
                        alt={video.name}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>

                  <div className="flex flex-1 flex-col justify-center gap-0.5 overflow-hidden">
                    <span className="truncate text-sm leading-none font-medium">{video.name}</span>
                    <span className="text-muted-foreground text-xs">
                      {formatDuration(video.duration)}
                    </span>
                  </div>

                  <Button
                    type="button"
                    variant={isSelected ? 'secondary' : 'default'}
                    size="sm"
                    className="h-8 px-3 text-xs"
                    onClick={() => toggleSelection(video.id)}
                  >
                    {isSelected ? (
                      <>
                        <Check className="mr-1.5 h-3 w-3" />
                        Agregado
                      </>
                    ) : (
                      'Agregar'
                    )}
                  </Button>
                </div>
              )
            })}

            {availableVideos.length === 0 && (
              <div className="text-muted-foreground rounded-lg border border-dashed py-8 text-center text-sm">
                No hay videos disponibles.
              </div>
            )}
          </div>

          <div className="text-muted-foreground text-sm">
            ¿No encuentras el video?{' '}
            <button
              type="button"
              onClick={onUploadNew}
              className="text-primary font-medium hover:underline focus:outline-none"
            >
              Subir nuevo
            </button>
          </div>
        </div>

        <DrawerFooter className="border-border bg-muted/20 shrink-0 flex-row justify-end gap-3 border-t p-6">
          <DrawerClose asChild>
            <Button variant="outline" disabled={isLoading}>
              Cancelar
            </Button>
          </DrawerClose>
          <Button onClick={handleConfirm} disabled={isLoading}>
            Confirmar Playlist
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
