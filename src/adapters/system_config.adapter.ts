import type { UpdateSystemConfigFormData } from '@/schemas/system_config.schema'
import type { UpdateSystemConfigRequest } from '@/types/system_config.types'

export const toUpdateSystemConfig = (
  data: UpdateSystemConfigFormData,
): UpdateSystemConfigRequest => {
  return {
    ...data,
  }
}
