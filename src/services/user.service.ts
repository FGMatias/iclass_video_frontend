import api from '@/lib/axios'
import { CreateCompanyAdminRequest, UpdateUserRequest, UserResponse } from '@/types/user.types'

export const userService = {
  findAll: async (roleId?: number): Promise<UserResponse[]> => {
    const response = await api.get<UserResponse[]>('/user', {
      params: roleId ? { roleId } : undefined,
    })
    return response.data
  },

  findById: async (id: number): Promise<UserResponse> => {
    const response = await api.get<UserResponse>(`/user/${id}`)
    return response.data
  },

  createCompanyAdmin: async (data: CreateCompanyAdminRequest): Promise<UserResponse> => {
    const response = await api.post<UserResponse>('/user/company-admin', data)
    return response.data
  },

  update: async (id: number, data: UpdateUserRequest): Promise<UserResponse> => {
    const response = await api.put<UserResponse>(`/user/${id}`, data)
    return response.data
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/user/${id}`)
  },

  activate: async (id: number): Promise<void> => {
    await api.put(`/user/${id}/activate`)
  },

  deactivate: async (id: number): Promise<void> => {
    await api.put(`/user/${id}/deactivate`)
  },

  resetPassword: async (id: number, newPassword: string): Promise<void> => {
    await api.put(`/user/${id}/reset-password`, { newPassword })
  },
}
