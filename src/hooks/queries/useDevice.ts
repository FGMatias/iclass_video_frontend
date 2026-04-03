import { deviceService } from '@/services/device.service'
import type { CreateDeviceRequest, UpdateDeviceRequest } from '@/types/device.types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { AREA_DETAIL_KEY, AREAS_KEYS } from './useArea'
import { BRANCH_DETAIL_KEY, BRANCHES_KEYS } from './useBranch'

export const DEVICE_KEYS = ['devices']

interface DeviceQueryParams {
  branchId?: number
  areaId?: number
}

export function useDevices(options: DeviceQueryParams = {}) {
  const { branchId, areaId } = options

  return useQuery({
    queryKey: areaId
      ? [...DEVICE_KEYS, AREAS_KEYS, areaId]
      : branchId
        ? [...DEVICE_KEYS, BRANCHES_KEYS, branchId]
        : DEVICE_KEYS,
    queryFn: () => deviceService.findAll(branchId, areaId),
  })
}

export function useCreateDevice(options: DeviceQueryParams = {}) {
  const qc = useQueryClient()
  const { branchId, areaId } = options

  return useMutation({
    mutationFn: ({ data }: { data: CreateDeviceRequest }) => deviceService.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: DEVICE_KEYS })
      toast.success('Dispositivo creado exitosamente')

      if (areaId) {
        qc.invalidateQueries({ queryKey: [AREA_DETAIL_KEY, areaId] })
      }
      if (branchId) {
        qc.invalidateQueries({ queryKey: [BRANCH_DETAIL_KEY, branchId] })
      }
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
      qc.invalidateQueries({ queryKey: DEVICE_KEYS })
      toast.success('Dispositivo actualizado exitosamente')

      if (areaId) {
        qc.invalidateQueries({ queryKey: [AREA_DETAIL_KEY, areaId] })
      }
      if (branchId) {
        qc.invalidateQueries({ queryKey: [BRANCH_DETAIL_KEY, branchId] })
      }
    },
    onError: () => toast.error('Error al actualizar el dispositivo'),
  })
}

export function useDeleteDevice() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: deviceService.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: DEVICE_KEYS })
      toast.success('Dispositivo eliminado')
    },
    onError: () => toast.error('Error al eliminar el dispositivo'),
  })
}

export function useActivateDevice() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deviceService.activate(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: DEVICE_KEYS })
      toast.success('Dispositivo activado')
    },
    onError: () => toast.error('Error al activar el dispositivo'),
  })
}

export function useDeactivateDevice() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deviceService.deactivate(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: DEVICE_KEYS })
      toast.success('Dispositivo desactivado')
    },
    onError: () => toast.error('Error al desactivar el dispositivo'),
  })
}
