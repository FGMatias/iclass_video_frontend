import { videoService } from '@/services/video.service'
import type { UpdateVideoRequest } from '@/types/video.types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const VIDEO_KEYS = ['videos']
export const VIDEO_CONSTRAINTS_KEY = ['video-constraints']

export function useVideos(companyId?: number) {
  return useQuery({
    queryKey: companyId ? [...VIDEO_KEYS, companyId] : VIDEO_KEYS,
    queryFn: () => (companyId ? videoService.findByCompany(companyId) : videoService.findAll()),
  })
}

export function useUploadVideo() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (formData: FormData) => videoService.upload(formData),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: VIDEO_KEYS })
      toast.success('Video subido exitosamente')
    },
    onError: () => toast.error('Error al subir el video'),
  })
}

export function useUpdateVideo() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateVideoRequest }) =>
      videoService.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: VIDEO_KEYS })
      toast.success('Video actualizado correctamente')
    },
    onError: () => toast.error('Error al actualizar el video'),
  })
}

export function useDeleteVideo() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id }: { id: number }) => videoService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: VIDEO_KEYS })
      toast.success('Video eliminado exitosamente')
    },
    onError: () => toast.error('Error al eliminar el video'),
  })
}

export function useActivateVideo() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id }: { id: number }) => videoService.activate(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: VIDEO_KEYS })
      toast.success('Video activado correctamente')
    },
    onError: () => toast.error('Error al activar el video'),
  })
}

export function useDeactivateVideo() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id }: { id: number }) => videoService.deactivate(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: VIDEO_KEYS })
      toast.success('Video desactivado correctamente')
    },
    onError: () => toast.error('Error al desactivar el video'),
  })
}

export function useVideoUploadConstraints() {
  return useQuery({
    queryKey: VIDEO_CONSTRAINTS_KEY,
    queryFn: videoService.uploadConstraints,
    staleTime: 1000 * 60 * 30,
  })
}
