import { z } from 'zod'

export const createCompanySchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre es obligatorio')
    .max(100, 'El nombre no puede exceder de 100 caracteres'),
  ruc: z
    .string()
    .regex(/^[0-9]{11}$/, 'El RUC debe tener 11 digitos')
    .optional()
    .or(z.literal(''))
    .transform((val) => (val === '' ? undefined : val)),
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
  email: z
    .string()
    .email('Email inválido')
    .optional()
    .or(z.literal(''))
    .transform((val) => (val === '' ? undefined : val)),
})

export type CreateCompanyFormData = z.infer<typeof createCompanySchema>

export const updateCompanySchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre es obligatorio')
    .max(100, 'El nombre no debe exceder de 100 caracteres'),
  ruc: z
    .string()
    .regex(/^[0-9]{11}$/, 'El RUC debe tener 11 digitos')
    .optional()
    .or(z.literal(''))
    .transform((val) => (val === '' ? undefined : val)),
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
  email: z
    .string()
    .email('Email inválido')
    .optional()
    .or(z.literal(''))
    .transform((val) => (val === '' ? undefined : val)),
})

export type UpdateCompanyFormData = z.infer<typeof updateCompanySchema>
