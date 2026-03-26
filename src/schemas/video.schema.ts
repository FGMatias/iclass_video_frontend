import type { VideoUploadConstraints } from '@/types/video.types'
import { z } from 'zod'

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']

function getFileExtension(fileName: string): string {
  const lastDot = fileName.lastIndexOf('.')
  return lastDot >= 0 ? fileName.substring(lastDot).toLowerCase() : ''
}

export function createUploadVideoSchema(constraints: VideoUploadConstraints) {
  const maxSizeBytes = constraints.maxSizeMb * 1024 * 1024

  const extensionLabel = constraints.allowedExtensions
    .map((ext) => ext.replace('.', '').toUpperCase())
    .join(', ')

  return z.object({
    name: z
      .string()
      .min(1, 'El nombre es obligatorio')
      .max(100, 'El nombre no debe exceder 100 caracteres'),
    file: z
      .instanceof(File, { message: 'El video es obligatorio' })
      .refine(
        (file) => file.size <= maxSizeBytes,
        `El archivo no debe exceder ${constraints.maxSizeMb}MB`,
      )
      .refine(
        (file) => constraints.allowedExtensions.includes(getFileExtension(file.name)),
        `Formato no permitido. Use ${extensionLabel}`,
      ),
    thumbnail: z
      .instanceof(File)
      .refine((file) => file.size <= 5 * 1024 * 1024, 'La imagen no debe exceder 5MB')
      .refine(
        (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
        'Formato no permitido. Use JPG, PNG o WebP',
      )
      .nullish()
      .transform((val) => val ?? undefined),
  })
}

export type UploadVideoFormData = z.infer<ReturnType<typeof createUploadVideoSchema>>

export const updateVideoSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre es obligatorio')
    .max(100, 'El nombre no debe exceder 100 caracteres'),
})

export type UpdateVideoFormData = z.infer<typeof updateVideoSchema>
