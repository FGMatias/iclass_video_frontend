import type { CreateDeviceFormData, UpdateDeviceFormData } from '@/schemas/device.schema'
import type { CreateDeviceRequest, DeviceResponse, UpdateDeviceRequest } from '@/types/device.types'

export const toCreateDevice = (data: CreateDeviceFormData, areaId: number): CreateDeviceRequest => {
  return {
    deviceName: data.deviceName,
    deviceTypeId: data.deviceTypeId,
    deviceUsername: data.deviceUsername,
    areaId: data.areaId ?? areaId,
    notes: data.notes,
  }
}

export const toUpdateDevice = (
  data: UpdateDeviceFormData,
  device: DeviceResponse,
): UpdateDeviceRequest => {
  return {
    ...data,
    isActive: device.isActive,
  }
}
