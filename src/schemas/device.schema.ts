import { z } from 'zod'

export const createDeviceSchema = z.object({
  deviceName: z
    .string()
    .min(1, 'El nombre es obligatorio')
    .max(100, 'El nombre no debe exceder los 100 caracteres'),
  deviceTypeId: z.number({ required_error: 'El tipo de dispositivo es obligatorio' }),
  deviceUsername: z
    .string()
    .min(4, 'El username debe tener al menos 4 caracteres')
    .max(50, 'El username no debe exceder los 50 caracteres')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Solo letras, números, puntos y guiones'),
  areaId: z.number({ required_error: 'El área es obligatoria' }),
  notes: z
    .string()
    .max(500, 'Las notas no deben exceder los 500 caracteres')
    .optional()
    .or(z.literal(''))
    .transform((val) => (val === '' ? undefined : val)),
})

export type CreateDeviceFormData = z.infer<typeof createDeviceSchema>

export const updateDeviceSchema = z.object({
  deviceName: z
    .string()
    .min(1, 'El nombre es obligatorio')
    .max(100, 'El nombre no debe exceder 100 caracteres'),
  deviceTypeId: z.number({ required_error: 'El tipo de dispositivo es obligatorio' }),
  deviceUsername: z
    .string()
    .min(4, 'El username debe tener mínimo 4 caracteres')
    .max(50, 'El username no debe exceder 50 caracteres')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Solo letras, números, puntos y guiones'),
})

export type UpdateDeviceFormData = z.infer<typeof updateDeviceSchema>
