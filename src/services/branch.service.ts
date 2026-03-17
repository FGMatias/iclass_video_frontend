import api from '@/lib/axios'
import type { BranchResponse, CreateBranchRequest, UpdateBranchRequest } from '@/types/branch.types'

export const branchService = {
  findAll: async (): Promise<BranchResponse[]> => {
    const response = await api.get<BranchResponse[]>('/branch')
    return response.data
  },

  findById: async (id: number): Promise<BranchResponse> => {
    const response = await api.get<BranchResponse>(`/branch/${id}`)
    return response.data
  },

  create: async (data: CreateBranchRequest): Promise<BranchResponse> => {
    console.log({ data })
    const response = await api.post<BranchResponse>('/branch', data)
    return response.data
  },

  update: async (id: number, data: UpdateBranchRequest): Promise<BranchResponse> => {
    const response = await api.put<BranchResponse>(`/branch/${id}`, data)
    return response.data
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/branch/${id}`)
  },

  activate: async (id: number): Promise<void> => {
    await api.put(`/branch/${id}/activate`)
  },

  deactivate: async (id: number): Promise<void> => {
    await api.put(`/branch/${id}/deactivate`)
  },
}
