import { z } from 'zod'

export const createCompanyAdminSchema = z.object({
  companyId: z.number({ required_error: 'La empresa es obligatoria' }),
  username: z
    .string()
    .min(3, 'El username debe tener minimo 3 caracteres')
    .max(50, 'El username no debe exceder de 50 caracteres')
    .regex(/^[a-zA-Z0-9._-]+$/, 'Solo letras, números, puntos y guiones'),
  name: z.string().min(1, 'El nombre es obligatorio').max(100),
  paternalSurname: z
    .string()
    .max(50)
    .optional()
    .or(z.literal(''))
    .transform((val) => (val === '' ? undefined : val)),
  maternalSurname: z
    .string()
    .max(50)
    .optional()
    .or(z.literal(''))
    .transform((val) => (val === '' ? undefined : val)),
  documentNumber: z
    .string()
    .max(20)
    .optional()
    .or(z.literal(''))
    .transform((val) => (val === '' ? undefined : val)),
  email: z.string().min(1, 'El correo es obligatorio').email('Email inválido'),
  phone: z
    .string()
    .regex(/^[0-9]{9,20}$/, 'Teléfono inválido')
    .optional()
    .or(z.literal(''))
    .transform((val) => (val === '' ? undefined : val)),
})

export type CreateCompanyAdminFormData = z.infer<typeof createCompanyAdminSchema>

export const createBranchAdminSchema = z.object({
  branchId: z.number({ required_error: 'La sucursal es obligatoria' }),
  username: z
    .string()
    .min(3, 'El username debe tener minimo 3 caracteres')
    .max(50, 'El username no debe exceder de 50 caracteres')
    .regex(/^[a-zA-Z0-9._-]+$/, 'Solo letras, números, puntos y guiones'),
  name: z.string().min(1, 'El nombre es obligatorio').max(100),
  paternalSurname: z
    .string()
    .max(50)
    .optional()
    .or(z.literal(''))
    .transform((val) => (val === '' ? undefined : val)),
  maternalSurname: z
    .string()
    .max(50)
    .optional()
    .or(z.literal(''))
    .transform((val) => (val === '' ? undefined : val)),
  documentNumber: z
    .string()
    .max(20)
    .optional()
    .or(z.literal(''))
    .transform((val) => (val === '' ? undefined : val)),
  email: z.string().min(1, 'El correo es obligatorio').email('Email inválido'),
  phone: z
    .string()
    .regex(/^[0-9]{9,20}$/, 'Teléfono inválido')
    .optional()
    .or(z.literal(''))
    .transform((val) => (val === '' ? undefined : val)),
})

export type CreateBranchAdminFormData = z.infer<typeof createBranchAdminSchema>

export const updateUserSchema = z.object({
  username: z
    .string()
    .min(3, 'El username debe tener minimo 3 caracteres')
    .max(50, 'El usuario no debe exceder de 50 caracteres')
    .regex(/^[a-zA-Z0-9._-]+$/, 'Solo letras, números, puntos y guiones')
    .optional(),
  name: z.string().min(1, 'El nombre es obligatorio').max(100),
  paternalSurname: z
    .string()
    .max(50)
    .optional()
    .or(z.literal(''))
    .transform((val) => (val === '' ? undefined : val)),
  maternalSurname: z
    .string()
    .max(50)
    .optional()
    .or(z.literal(''))
    .transform((val) => (val === '' ? undefined : val)),
  documentNumber: z
    .string()
    .max(20)
    .optional()
    .or(z.literal(''))
    .transform((val) => (val === '' ? undefined : val)),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  phone: z
    .string()
    .regex(/^[0-9]{9,20}$/, 'Teléfono inválido')
    .optional()
    .or(z.literal(''))
    .transform((val) => (val === '' ? undefined : val)),
})

export type UpdateUserFormData = z.infer<typeof updateUserSchema>

export const changePasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(1, 'La contraseña es obligatoria')
      .min(8, 'La contraseña debe tener al menos 8 caracteres'),
    confirmPassword: z.string().min(1, 'Debes confirmar la contraseña'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  })

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>
