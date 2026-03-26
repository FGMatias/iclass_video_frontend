import type { AreaResponse } from './area.types'
import type { UserResponse } from './user.types'

export interface BranchResponse {
  id: number
  companyId: number
  companyName: string
  name: string
  direction: string | null
  phone: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface BranchDetail extends BranchResponse {
  administrators: UserResponse[]
  areas: AreaResponse[]
}

export interface CreateBranchRequest {
  companyId: number
  name: string
  direction?: string
  phone?: string
}

export interface UpdateBranchRequest {
  name: string
  direction?: string
  phone?: string
  isActive: boolean
}
