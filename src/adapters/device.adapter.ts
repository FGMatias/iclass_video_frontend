import { DEVICE_TYPES } from '@/constants/device_type'
import type { CreateDeviceFormData, UpdateDeviceFormData } from '@/schemas/device.schema'
import type { CreateDeviceRequest, DeviceResponse, UpdateDeviceRequest } from '@/types/device.types'

export interface DeviceFormInitialData {
  deviceName: string
  deviceTypeId: number | undefined
  deviceUsername: string
  areaId?: number
}

export const toDeviceFormInitialData = (device: DeviceResponse): DeviceFormInitialData => {
  const type = DEVICE_TYPES.find((dt) => dt.name === device.deviceType)

  return {
    deviceName: device.deviceName,
    deviceTypeId: type?.id,
    deviceUsername: device.deviceUsername,
    areaId: device.currentAreaId,
  }
}

export const toCreateDevice = (data: CreateDeviceFormData): CreateDeviceRequest => {
  return {
    deviceName: data.deviceName,
    deviceTypeId: data.deviceTypeId,
    deviceUsername: data.deviceUsername,
    areaId: data.areaId,
  }
}

export const toUpdateDevice = (data: UpdateDeviceFormData): UpdateDeviceRequest => {
  return {
    deviceName: data.deviceName,
    deviceTypeId: data.deviceTypeId,
    deviceUsername: data.deviceUsername,
  }
}
