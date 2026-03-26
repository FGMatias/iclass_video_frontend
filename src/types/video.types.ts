export interface VideoResponse {
  id: number
  companyId: number
  companyName: string
  name: string
  urlVideo: string | null
  thumbnail: string | null
  duration: number | null
  fileSize: number
  fileExtension: string
  checksum: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface VideoUploadResponse {
  id: number
  companyId: number
  companyName: string
  name: string
  urlVideo: string | null
  thumbnail: string | null
  duration: number | null
  fileSize: number
  fileExtension: string
  checksum: string
  isActive: boolean
  createdAt: string
}

export interface VideoSimple {
  id: number
  name: string
  urlVideo: string | null
  thumbnail: string | null
  duration: number | null
  orden?: number
  fileSize?: number
  checksum?: string
}

export interface UpdateVideoRequest {
  name: string
}

export interface VideoUploadConstraints {
  maxSizeMb: number
  allowedExtensions: string[]
}
