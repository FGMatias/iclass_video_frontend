import type { VideoSimple } from '@/types/video.types'
import {
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { useState } from 'react'

export function usePlaylist(
  serverPlaylist: VideoSimple[],
  onSyncPlaylist: (selectedIds: number[]) => void,
) {
  const [playlistOverride, setPlaylistOverride] = useState<VideoSimple[] | null>(null)
  const [activeId, setActiveId] = useState<number | null>(null)
  const localPlaylist = playlistOverride ?? serverPlaylist
  const totalDuration = localPlaylist.reduce((sum, v) => sum + (v.duration ?? 0), 0)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null)
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = localPlaylist.findIndex((item) => item.id === active.id)
      const newIndex = localPlaylist.findIndex((item) => item.id === over.id)
      const reordered = arrayMove(localPlaylist, oldIndex, newIndex)

      setPlaylistOverride(reordered)
      onSyncPlaylist(reordered.map((v) => v.id))
    }
  }

  const handleRemoveFromPlaylist = (videoId: number) => {
    const updated = localPlaylist.filter((v) => v.id !== videoId)
    setPlaylistOverride(updated)
    onSyncPlaylist(updated.map((v) => v.id))
  }

  return {
    localPlaylist,
    totalDuration,
    activeId,
    sensors,
    handleDragStart,
    handleDragEnd,
    handleRemoveFromPlaylist,
  }
}
