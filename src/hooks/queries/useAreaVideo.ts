import { areaVideoService } from '@/services/area_video.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { AREA_DETAIL_KEY } from './useArea'

export function useSyncPlaylist(areaId: number) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (videoIds: number[]) => areaVideoService.syncPlaylist(areaId, videoIds),
    onSuccess: () => {
      toast.success('Playlist actualizada')

      if (areaId) {
        qc.invalidateQueries({ queryKey: [AREA_DETAIL_KEY, areaId] })
      }
    },
    onError: () => toast.error('Error al actualizar la playlist'),
  })
}
