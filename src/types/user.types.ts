export interface UserAssignment {
  companyId: number
  companyName: string
  branchId: number | null
  branchName: string | null
}

export interface UserResponse {
  id: number
  username: string
  name: string
  paternalSurname: string
  maternalSurname: string
  email: string | null
  phone: string | null
  documentNumber: string | null
  roleId: number
  roleName: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  assignment: UserAssignment | null
}

export interface CreateCompanyAdminRequest {
  companyId: number
  username: string
  name: string
  paternalSurname?: string
  maternalSurname?: string
  documentNumber?: string
  email: string
  phone?: string
}

export interface CreateBranchAdminRequest {
  branchId: number
  username: string
  name: string
  paternalSurname?: string
  maternalSurname?: string
  documentNumber?: string
  email: string
  phone?: string
}

export interface UpdateUserRequest {
  username?: string
  name?: string
  paternalSurname?: string
  maternalSurname?: string
  documentNumber?: string
  email?: string
  phone?: string
  isActive: boolean
}

export interface ChangePasswordRequest {
  newPassword: string
}
