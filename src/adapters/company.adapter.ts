import type { CreateCompanyFormData, UpdateCompanyFormData } from '@/schemas/company.schema'
import type {
  CompanyResponse,
  CreateCompanyRequest,
  UpdateCompanyRequest,
} from '@/types/company.types'

export const toCreateCompany = (data: CreateCompanyFormData): CreateCompanyRequest => {
  return {
    ...data,
  }
}

export const toUpdateCompany = (
  data: UpdateCompanyFormData,
  company: CompanyResponse,
): UpdateCompanyRequest => {
  return {
    ...data,
    isActive: company.isActive,
  }
}
