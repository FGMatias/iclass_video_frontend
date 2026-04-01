export const DEVICE_TYPES = [
  { id: 1, name: 'TV' },
  { id: 2, name: 'TABLET' },
] as const

export type DeviceTypeId = (typeof DEVICE_TYPES)[number]['id']
