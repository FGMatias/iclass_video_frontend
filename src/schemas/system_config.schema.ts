import { z } from 'zod'

export const updateSystemConfigSchema = z.object({
  configValue: z.string().min(1, 'El valor es obligatorio'),
})

export type UpdateSystemConfigFormData = z.infer<typeof updateSystemConfigSchema>
