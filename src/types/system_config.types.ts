import type { ConfigType } from '@/constants/config_type'

export interface SystemConfigResponse {
  id: number
  configKey: string
  configValue: string
  configType: ConfigType
  defaultValue: string
  description: string
  validationRule: string
  displayOrder: number
  updatedByUser: number | null
  updatedAt: string
}

export interface UpdateSystemConfigRequest {
  configValue: string
}
