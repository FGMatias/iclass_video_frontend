import type {
  CreateBranchAdminFormData,
  CreateCompanyAdminFormData,
  UpdateUserFormData,
} from '@/schemas/user.schema'
import type {
  CreateBranchAdminRequest,
  CreateCompanyAdminRequest,
  UpdateUserRequest,
  UserResponse,
} from '@/types/user.types'

export const toCreateCompanyAdmin = (
  data: CreateCompanyAdminFormData,
  companyId: number,
): CreateCompanyAdminRequest => {
  return {
    ...data,
    companyId,
  }
}

export const toCreateBranchAdmin = (
  data: CreateBranchAdminFormData,
  branchId: number,
): CreateBranchAdminRequest => {
  return {
    ...data,
    branchId,
  }
}

export const toUpdateUser = (data: UpdateUserFormData, user: UserResponse): UpdateUserRequest => {
  return {
    ...data,
    isActive: user.isActive,
  }
}
