import type { CreateAreaFormData, UpdateAreaFormData } from '@/schemas/area.schema'
import type { AreaResponse, CreateAreaRequest, UpdateAreaRequest } from '@/types/area.types'

export const toCreateArea = (data: CreateAreaFormData, branchId: number): CreateAreaRequest => {
  return {
    ...data,
    branchId,
  }
}

export const toUpdateArea = (data: UpdateAreaFormData, area: AreaResponse): UpdateAreaRequest => {
  return {
    ...data,
    isActive: area.isActive,
  }
}
