import api from '@/lib/axios'
import type {
  UpdateVideoRequest,
  VideoResponse,
  VideoUploadConstraints,
  VideoUploadResponse,
} from '@/types/video.types'

export const videoService = {
  findAll: async (): Promise<VideoResponse[]> => {
    const response = await api.get<VideoResponse[]>('/video')
    return response.data
  },

  findByCompany: async (companyId: number): Promise<VideoResponse[]> => {
    const response = await api.get<VideoResponse[]>(`/video/company/${companyId}`)
    return response.data
  },

  findById: async (id: number): Promise<VideoResponse> => {
    const response = await api.get<VideoResponse>(`/video/${id}`)
    return response.data
  },

  upload: async (formData: FormData): Promise<VideoUploadResponse> => {
    const response = await api.post<VideoUploadResponse>('/video/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },

  update: async (id: number, data: UpdateVideoRequest): Promise<VideoResponse> => {
    const response = await api.put<VideoResponse>(`/video/${id}`, data)
    return response.data
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/video/${id}`)
  },

  activate: async (id: number): Promise<void> => {
    await api.put(`/video/${id}`)
  },

  deactivate: async (id: number): Promise<void> => {
    await api.put(`/video/${id}`)
  },

  uploadConstraints: async (): Promise<VideoUploadConstraints> => {
    const response = await api.get<VideoUploadConstraints>('/video/upload-constraints')
    return response.data
  },
}
