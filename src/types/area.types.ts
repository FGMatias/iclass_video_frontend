import type { DeviceInfo } from "./device.types"
import type { VideoSimple } from "./video.types"

export interface AreaResponse {
    id: number
    branchId: number
    branchName: string
    companyId: number
    companyName: string
    name: string
    description: string | null
    isActive: boolean
    createdAt: string
    updatedAt: string
}

export interface AreaDetail extends AreaResponse {
    totalVideos: number
    totalDevices: number
    totalDuration: number
    playlist: VideoSimple[]
    devices: DeviceInfo[]
}

export interface CreateAreaRequest {
    branchId: number
    name: string
    description?: string
}

export interface UpdateAreaRequest {
    name: string
    description?: string
    isActive: boolean
}