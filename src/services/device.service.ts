import api from '@/lib/axios'
import type {
  CreateDeviceRequest,
  DeviceInfo,
  DeviceResponse,
  UpdateDeviceRequest,
} from '@/types/device.types'

export const deviceService = {
  findAll: async (branchId?: number, areaId?: number): Promise<DeviceInfo[]> => {
    const params: Record<string, number> = {}
    if (areaId) params.areaId = areaId
    else if (branchId) params.branchId = branchId

    const response = await api.get<DeviceInfo[]>('/device', {
      params: Object.keys(params).length > 0 ? params : undefined,
    })

    return response.data
  },

  findById: async (id: number): Promise<DeviceResponse> => {
    const response = await api.get<DeviceResponse>(`/device/${id}`)
    return response.data
  },

  create: async (data: CreateDeviceRequest): Promise<DeviceResponse> => {
    const response = await api.post<DeviceResponse>('/device', data)
    return response.data
  },

  update: async (id: number, data: UpdateDeviceRequest): Promise<DeviceResponse> => {
    const response = await api.put<DeviceResponse>(`/device/${id}`, data)
    return response.data
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/device/${id}`)
  },

  activate: async (id: number): Promise<void> => {
    await api.put(`/device/${id}/activate`)
  },

  deactivate: async (id: number): Promise<void> => {
    await api.put(`/device/${id}/deactivate`)
  },

  reassign: async (deviceId: number, areaId: number): Promise<void> => {
    await api.put(`/device/${deviceId}/reassign`, { areaId })
  },
}
