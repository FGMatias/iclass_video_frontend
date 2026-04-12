import { deviceService } from '@/services/device.service'
import type { CreateDeviceRequest, UpdateDeviceRequest } from '@/types/device.types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { AREA_DETAIL_KEY } from './useArea'
import { BRANCH_DETAIL_KEY } from './useBranch'

interface DeviceQueryParams {
  branchId?: number
  areaId?: number
}

export const deviceKeys = {
  all: ['devices'] as const,
  lists: () => [...deviceKeys.all, 'list'] as const,
  list: (filters: DeviceQueryParams) => [...deviceKeys.lists(), filters] as const,
  singles: () => [deviceKeys.all, 'single'] as const,
  single: (id: number | null) => [...deviceKeys.singles(), id] as const,
  details: () => [...deviceKeys.all, 'detail'] as const,
  detail: (id: number | null) => [...deviceKeys.details(), id] as const,
}

export function useDevices(options: DeviceQueryParams = {}) {
  return useQuery({
    queryKey: deviceKeys.list(options),
    queryFn: () => deviceService.findAll(options.branchId, options.areaId),
  })
}

export function useDevice(id: number | null) {
  return useQuery({
    queryKey: deviceKeys.single(id),
    queryFn: () => deviceService.findById(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  })
}

export function useCreateDevice(options: DeviceQueryParams = {}) {
  const qc = useQueryClient()
  const { branchId, areaId } = options

  return useMutation({
    mutationFn: ({ data }: { data: CreateDeviceRequest }) => deviceService.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: deviceKeys.all })
      toast.success('Dispositivo creado exitosamente')

      if (areaId) qc.invalidateQueries({ queryKey: [AREA_DETAIL_KEY, areaId] })
      if (branchId) qc.invalidateQueries({ queryKey: [BRANCH_DETAIL_KEY, branchId] })
    },
    onError: () => toast.error('Error al crear el dispositivo'),
  })
}

export function useUpdateDevice(options: DeviceQueryParams = {}) {
  const qc = useQueryClient()
  const { branchId, areaId } = options

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateDeviceRequest }) =>
      deviceService.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: deviceKeys.all })
      toast.success('Dispositivo actualizado exitosamente')

      if (areaId) qc.invalidateQueries({ queryKey: [AREA_DETAIL_KEY, areaId] })
      if (branchId) qc.invalidateQueries({ queryKey: [BRANCH_DETAIL_KEY, branchId] })
    },
    onError: () => toast.error('Error al actualizar el dispositivo'),
  })
}

export function useDeleteDevice() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id }: { id: number }) => deviceService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: deviceKeys.all })
      toast.success('Dispositivo eliminado')
    },
    onError: () => toast.error('Error al eliminar el dispositivo'),
  })
}

export function useActivateDevice(options: DeviceQueryParams = {}) {
  const qc = useQueryClient()
  const { branchId, areaId } = options

  return useMutation({
    mutationFn: ({ id }: { id: number }) => deviceService.activate(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: deviceKeys.all })
      toast.success('Dispositivo activado')

      if (areaId) qc.invalidateQueries({ queryKey: [AREA_DETAIL_KEY, areaId] })
      if (branchId) qc.invalidateQueries({ queryKey: [BRANCH_DETAIL_KEY, branchId] })
    },
    onError: () => toast.error('Error al activar el dispositivo'),
  })
}

export function useDeactivateDevice(options: DeviceQueryParams = {}) {
  const qc = useQueryClient()
  const { branchId, areaId } = options

  return useMutation({
    mutationFn: ({ id }: { id: number }) => deviceService.deactivate(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: deviceKeys.all })
      toast.success('Dispositivo desactivado')

      if (areaId) qc.invalidateQueries({ queryKey: [AREA_DETAIL_KEY, areaId] })
      if (branchId) qc.invalidateQueries({ queryKey: [BRANCH_DETAIL_KEY, branchId] })
    },
    onError: () => toast.error('Error al desactivar el dispositivo'),
  })
}

export function useReassignDevice(options: DeviceQueryParams = {}) {
  const qc = useQueryClient()
  const { branchId, areaId } = options

  return useMutation({
    mutationFn: ({ deviceId, areaId }: { deviceId: number; areaId: number }) =>
      deviceService.reassign(deviceId, areaId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: deviceKeys.all })
      toast.success('Dispositivo reasignado exitosamente')

      if (areaId) qc.invalidateQueries({ queryKey: [AREA_DETAIL_KEY, areaId] })
      if (branchId) qc.invalidateQueries({ queryKey: [BRANCH_DETAIL_KEY, branchId] })
    },
    onError: () => toast.error('Error al reasignar el dispositivo'),
  })
}
