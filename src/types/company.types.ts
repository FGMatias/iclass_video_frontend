import type { BranchResponse } from './branch.types'
import type { UserResponse } from './user.types'

export interface CompanyResponse {
  id: number
  name: string
  ruc: string | null
  direction: string | null
  phone: string | null
  email: string | null
  logo: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CompanyDetail {
  id: number
  name: string
  ruc: string | null
  direction: string | null
  phone: string | null
  email: string | null
  logo: string | null
  isActive: boolean
  totalBranches: number
  totalVideos: number
  administrators: UserResponse[]
  branches: BranchResponse[]
  createdAt: string
}

export interface CreateCompanyRequest {
  name: string
  ruc?: string
  direction?: string
  phone?: string
  email?: string
  logo?: string
}

export interface UpdateCompanyRequest {
  name: string
  ruc?: string
  direction?: string
  phone?: string
  email?: string
  logo?: string
  isActive: boolean
}
