import { z } from 'zod'

export const createBranchSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre es obligatorio')
    .max(100, 'El nombre no puede exceder de 100 caracteres'),
  direction: z
    .string()
    .max(500, 'La dirección no puede exceder 500 caracteres')
    .optional()
    .or(z.literal(''))
    .transform((val) => (val === '' ? undefined : val)),
  phone: z
    .string()
    .regex(/^[0-9]{9,20}$/, 'Teléfono inválido')
    .optional()
    .or(z.literal(''))
    .transform((val) => (val === '' ? undefined : val)),
})

export type CreateBranchFormData = z.infer<typeof createBranchSchema>

export const updateBranchSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre es obligatorio')
    .max(100, 'El nombre no puede exceder de 100 caracteres'),
  direction: z
    .string()
    .max(500, 'La dirección no debe exceder 500 caracteres')
    .optional()
    .or(z.literal(''))
    .transform((val) => (val === '' ? undefined : val)),
  phone: z
    .string()
    .regex(/^[0-9]{9,20}$/, 'Teléfono inválido')
    .optional()
    .or(z.literal(''))
    .transform((val) => (val === '' ? undefined : val)),
})

export type UpdateBranchFormData = z.infer<typeof updateBranchSchema>
