import { areaService } from '@/services/area.service'
import type { CreateAreaRequest, UpdateAreaRequest } from '@/types/area.types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { BRANCH_DETAIL_KEY } from './useBranch'

export const AREAS_KEYS = ['areas']
export const AREA_DETAIL_KEY = 'area-detail'

export function useAreas(branchId?: number) {
  return useQuery({
    queryKey: branchId ? [...AREAS_KEYS, branchId] : AREAS_KEYS,
    queryFn: () => areaService.findAll(branchId),
  })
}

export function useDetailArea(id: number | undefined) {
  return useQuery({
    queryKey: [AREA_DETAIL_KEY, id],
    queryFn: () => areaService.detail(id!),
    enabled: !!id,
  })
}

export function useCreateArea(branchId?: number) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ data }: { data: CreateAreaRequest }) => areaService.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: AREAS_KEYS })
      toast.success('Área creada correctamente')

      if (branchId) {
        qc.invalidateQueries({ queryKey: [BRANCH_DETAIL_KEY, branchId] })
      }
    },
    onError: () => toast.error('Error al crea el área'),
  })
}

export function useUpdateArea(branchId?: number) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateAreaRequest }) =>
      areaService.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: AREAS_KEYS })
      toast.success('Área editada correctamente')

      if (branchId) {
        qc.invalidateQueries({ queryKey: [BRANCH_DETAIL_KEY, branchId] })
      }
    },
    onError: () => toast.error('Error al editar el área'),
  })
}

export function useDeleteBranch() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id }: { id: number }) => areaService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: AREAS_KEYS })
      toast.success('Área eliminada correctamente')
    },
    onError: () => toast.error('Error al eliminar el área'),
  })
}

export function useActivateArea() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id }: { id: number }) => areaService.activate(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: AREAS_KEYS })
      toast.success('Área activada correctamente')
    },
    onError: () => toast.error('Error al activar el área'),
  })
}

export function useDeactivateArea() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id }: { id: number }) => areaService.deactivate(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: AREAS_KEYS })
      toast.success('Área desactivada correctamente')
    },
    onError: () => toast.error('Error al desactivar el área'),
  })
}
