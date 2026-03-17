import api from '@/lib/axios'
import type { SystemConfigResponse, UpdateSystemConfigRequest } from '@/types/system_config.types'

export const systemConfigService = {
  findAll: async (): Promise<SystemConfigResponse[]> => {
    const response = await api.get<SystemConfigResponse[]>('/system-config')
    return response.data
  },

  findById: async (id: number): Promise<SystemConfigResponse> => {
    const response = await api.get<SystemConfigResponse>(`/system-config/${id}`)
    return response.data
  },

  findByKey: async (key: string): Promise<SystemConfigResponse> => {
    const response = await api.get(`/system-config/key/${key}`)
    return response.data
  },

  update: async (id: number, data: UpdateSystemConfigRequest): Promise<SystemConfigResponse> => {
    const response = await api.put<SystemConfigResponse>(`/system-config/${id}`, data)
    return response.data
  },

  resetToDefault: async (id: number): Promise<void> => {
    await api.put(`/system-config/${id}/reset`)
  },
}
