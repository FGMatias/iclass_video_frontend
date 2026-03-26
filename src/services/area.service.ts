import api from '@/lib/axios'
import type {
  AreaDetail,
  AreaResponse,
  CreateAreaRequest,
  UpdateAreaRequest,
} from '@/types/area.types'

export const areaService = {
  findAll: async (branchId?: number): Promise<AreaResponse[]> => {
    const response = await api.get<AreaResponse[]>('/area', {
      params: branchId ? { branchId } : undefined,
    })
    return response.data
  },

  findById: async (id: number): Promise<AreaResponse> => {
    const response = await api.get<AreaResponse>(`/area/${id}`)
    return response.data
  },

  detail: async (id: number): Promise<AreaDetail> => {
    const response = await api.get<AreaDetail>(`/area/${id}/detail`)
    return response.data
  },

  create: async (data: CreateAreaRequest): Promise<AreaResponse> => {
    const response = await api.post<AreaResponse>('/area', data)
    return response.data
  },

  update: async (id: number, data: UpdateAreaRequest): Promise<AreaResponse> => {
    const response = await api.put<AreaResponse>(`/area/${id}`, data)
    return response.data
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/area/${id}`)
  },

  activate: async (id: number): Promise<void> => {
    await api.put(`/area/${id}/activate`)
  },

  deactivate: async (id: number): Promise<void> => {
    await api.put(`/area/${id}/deactivate`)
  },
}
