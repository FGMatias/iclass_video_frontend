import type { UpdateVideoFormData, UploadVideoFormData } from '@/schemas/video.schema'
import type { UpdateVideoRequest } from '@/types/video.types'

export const toUploadVideo = (data: UploadVideoFormData, companyId: number): FormData => {
  const formData = new FormData()

  formData.append('file', data.file)
  formData.append('companyId', companyId.toString())
  formData.append('name', data.name)

  if (data.thumbnail) {
    formData.append('thumbnail', data.thumbnail)
  }

  return formData
}

export const toUpdate = (data: UpdateVideoFormData): UpdateVideoRequest => {
  return { name: data.name }
}
