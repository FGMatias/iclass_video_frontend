export interface DeviceResponse {
  id: number
  deviceName: string
  deviceIdentifier: string
  deviceUsername: string
  deviceType: string
  currentAreaId: number
  currentAreaName: string
  currentBranchId: number
  currentBranchName: string
  currentCompanyId: number
  currentCompanyName: string
  configuredByUsername: string
  isActive: boolean
  assignedAt: string
  lastLogin: string | null
  lastSync: string | null
  createdAt: string
}

export interface DeviceInfo {
  id: number
  deviceName: string
  deviceUsername: string
  deviceType: string
  isActive: boolean
  lastLogin: string
  lastSync: string
}

export interface CreateDeviceRequest {
  deviceName: string
  deviceTypeId: number
  areaId: number
  deviceUsername: string
  notes?: string
}

export interface UpdateDeviceRequest {
  deviceName: string
  deviceTypeId: number
  deviceUsername: string
  isActive: boolean
}
