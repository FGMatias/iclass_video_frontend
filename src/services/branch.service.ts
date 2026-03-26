import api from '@/lib/axios'
import type {
  BranchDetail,
  BranchResponse,
  CreateBranchRequest,
  UpdateBranchRequest,
} from '@/types/branch.types'

export const branchService = {
  findAll: async (companyId?: number): Promise<BranchResponse[]> => {
    const response = await api.get<BranchResponse[]>('/branch', {
      params: companyId ? { companyId } : undefined,
    })
    return response.data
  },

  findById: async (id: number): Promise<BranchResponse> => {
    const response = await api.get<BranchResponse>(`/branch/${id}`)
    return response.data
  },

  detail: async (id: number): Promise<BranchDetail> => {
    const response = await api.get<BranchDetail>(`/branch/${id}/detail`)
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
