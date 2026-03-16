import type { CreateBranchFormData, UpdateBranchFormData } from '@/schemas/branch.schema'
import type { BranchResponse, CreateBranchRequest, UpdateBranchRequest } from '@/types/branch.types'

export const toCreateBranch = (
  data: CreateBranchFormData,
  companyId: number,
): CreateBranchRequest => {
  return {
    ...data,
    companyId,
  }
}

export const toUpdateBranch = (
  data: UpdateBranchFormData,
  branch: BranchResponse,
): UpdateBranchRequest => {
  return {
    ...data,
    isActive: branch.isActive,
  }
}
