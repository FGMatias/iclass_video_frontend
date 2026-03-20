import api from '@/lib/axios'
import type {
  ChangePasswordRequest,
  CreateBranchAdminRequest,
  CreateCompanyAdminRequest,
  UpdateUserRequest,
  UserResponse,
} from '@/types/user.types'

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

  createBranchAdmin: async (data: CreateBranchAdminRequest): Promise<UserResponse> => {
    const response = await api.post<UserResponse>('/user/branch-admin', data)
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

  reassignCompany: async (userId: number, companyId: number): Promise<void> => {
    await api.put(`/user/${userId}/reassign-company`, { companyId })
  },

  reassignBranch: async (userId: number, branchId: number): Promise<void> => {
    await api.put(`/user/${userId}/reassign-branch`, { branchId })
  },

  resetPassword: async (id: number): Promise<void> => {
    await api.put(`/user/${id}/reset-password`)
  },

  changePassword: async (id: number, data: ChangePasswordRequest): Promise<void> => {
    await api.put(`/user/${id}/change-password`, data)
  },
}
