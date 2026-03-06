import api from '@/lib/axios'
import { CompanyResponse, CreateCompanyRequest, UpdateCompanyRequest } from '@/types/company.types'

export const companyService = {
  findAll: async (): Promise<CompanyResponse[]> => {
    const response = await api.get<CompanyResponse[]>('/company')
    return response.data
  },

  findById: async (id: number): Promise<CompanyResponse> => {
    const response = await api.get<CompanyResponse>(`/company/${id}`)
    return response.data
  },

  create: async (data: CreateCompanyRequest): Promise<CompanyResponse> => {
    const response = await api.post<CompanyResponse>('/company', data)
    return response.data
  },

  update: async (id: number, data: UpdateCompanyRequest): Promise<CompanyResponse> => {
    const response = await api.put<CompanyResponse>(`/company/${id}`, data)
    return response.data
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/company/${id}`)
  },

  activate: async (id: number): Promise<void> => {
    await api.put(`/company/${id}/activate`)
  },

  deactivate: async (id: number): Promise<void> => {
    await api.put(`/company/${id}/deactivate`)
  },
}
