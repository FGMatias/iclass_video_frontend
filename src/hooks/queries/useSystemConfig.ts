import { systemConfigService } from '@/services/system_config.service'
import type { UpdateSystemConfigRequest } from '@/types/system_config.types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const SYSTEM_CONFIG_KEYS = ['system-config']

export function useSystemConfig() {
  return useQuery({ queryKey: SYSTEM_CONFIG_KEYS, queryFn: systemConfigService.findAll })
}

export function useUpdateSystemConfig() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateSystemConfigRequest }) =>
      systemConfigService.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SYSTEM_CONFIG_KEYS })
      toast.success('Configuración modificada correctamente')
    },
    onError: () => toast.error('Error al modificar la configuración'),
  })
}

export function useResetSystemConfig() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id }: { id: number }) => systemConfigService.resetToDefault(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SYSTEM_CONFIG_KEYS })
      toast.success('Configuración restaurada a su valor por defecto')
    },
    onError: () => toast.error('Error al restaurar la configuración'),
  })
}
