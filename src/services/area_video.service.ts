import api from '@/lib/axios'

export const areaVideoService = {
  syncPlaylist: async (areaId: number, videoIds: number[]): Promise<void> => {
    await api.put(`/area-video/area/${areaId}/sync`, { videoIds })
  },
}
