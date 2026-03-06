import { z } from 'zod'

export const createCompanyAdminSchema = z.object({
  companyId: z.number({ required_error: 'La empresa es obligatoria' }),
  username: z
    .string()
    .min(3, 'El username debe tener minimo 3 caracteres')
    .max(50, 'El username no debe exceder de 50 caracteres')
    .regex(/^[a-zA-Z0-9._-]+$/, 'Solo letras, números, puntos y guiones'),
  name: z.string().min(1, 'El nombre es obligatorio').max(100),
  paternalSurname: z.string().max(50).optional(),
  maternalSurname: z.string().max(50).optional(),
  documentNumber: z.string().max(20).optional(),
  email: z.string().min(1, 'El correo es obligatorio').email('Email inválido'),
  phone: z
    .string()
    .regex(/^[0-9]{9,20}$/, 'Teléfono inválido')
    .optional()
    .or(z.literal('')),
})

export type CreateCompanyAdminFormData = z.infer<typeof createCompanyAdminSchema>

export const updateUserSchema = z.object({
  username: z
    .string()
    .min(3, 'El username debe tener minimo 3 caracteres')
    .max(50, 'El usuario no debe exceder de 50 caracteres')
    .regex(/^[a-zA-Z0-9._-]+$/, 'Solo letras, números, puntos y guiones')
    .optional(),
  name: z.string().min(1, 'El nombre es obligatorio').max(100),
  paternalSurname: z.string().max(50).optional(),
  maternalSurname: z.string().max(50).optional(),
  documentNumber: z.string().max(20).optional(),
  email: z.string().email('Email inválido').optional(),
  phone: z
    .string()
    .regex(/^[0-9]{9,20}$/, 'Teléfono inválido')
    .optional()
    .or(z.literal('')),
})

export type UpdateUserFormData = z.infer<typeof updateUserSchema>
