import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { type CreateCompanyAdminFormData, type UpdateUserFormData } from '@/schemas/user.schema'
import type { UserResponse } from '@/types/user.types'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import type z from 'zod'
import { BranchSelector } from '../branch/BranchSelector'
import { CompanySelector } from '../company/CompanySelector'

interface UserFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CreateCompanyAdminFormData | UpdateUserFormData) => void
  user?: UserResponse | null
  isLoading?: boolean
  fixedCompanyId?: number
  fixedBranchId?: number
  showCompanySelect?: boolean
  showBranchSelect?: boolean
  schema: z.ZodType<any, any>
}

export function UserForm({
  open,
  onOpenChange,
  onSubmit,
  user,
  isLoading,
  fixedCompanyId,
  fixedBranchId,
  showCompanySelect,
  showBranchSelect,
  schema,
}: UserFormProps) {
  const isEditing = !!user

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  })

  const currentCompanyId = watch('companyId')
  const currentBranchId = watch('branchId')

  useEffect(() => {
    if (open && user) {
      reset({
        username: user.username,
        name: user.name,
        paternalSurname: user.paternalSurname ?? '',
        maternalSurname: user.maternalSurname ?? '',
        documentNumber: user.documentNumber ?? '',
        email: user.email ?? '',
        phone: user.phone ?? '',
        companyId: undefined,
        branchId: undefined,
      })
    } else if (open && !user) {
      reset({
        companyId: fixedCompanyId,
        branchId: fixedBranchId,
        username: '',
        name: '',
        paternalSurname: '',
        maternalSurname: '',
        documentNumber: '',
        email: '',
        phone: '',
      })
    }
  }, [open, user, reset, fixedCompanyId, fixedBranchId])

  return (
    <>
      <Drawer open={open} onOpenChange={onOpenChange} direction="right">
        <DrawerContent className="flex h-full w-full flex-col sm:max-w-xl">
          <DrawerHeader className="shrink-0 pb-4 text-left">
            <DrawerTitle>{isEditing ? 'Editar Usuario' : 'Crear Usuario'}</DrawerTitle>
            <DrawerDescription>
              {isEditing
                ? 'Modifica los datos del usuario.'
                : 'Completa la información para registrar un nuevo usuario en la plataforma.'}
            </DrawerDescription>
          </DrawerHeader>

          <div className="no-scrollbar flex-1 overflow-y-auto px-4 sm:px-6">
            <form
              id="user-form"
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6 px-1 pt-2 pb-6"
            >
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="username">
                    Usuario <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="username"
                    placeholder="Ej. juan.perez"
                    disabled={isLoading}
                    {...register('username')}
                  />
                  {errors.username && (
                    <p className="text-destructive text-sm">{errors.username.message as string}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Nombre <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="Ej. Juan"
                    disabled={isLoading}
                    {...register('name')}
                  />
                  {errors.name && (
                    <p className="text-destructive text-sm">{errors.name.message as string}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="paternalSurname">Apellido Paterno</Label>
                  <Input
                    id="paternalSurname"
                    placeholder="Ej. Pérez"
                    disabled={isLoading}
                    {...register('paternalSurname')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maternalSurname">Apellido Materno</Label>
                  <Input
                    id="maternalSurname"
                    placeholder="Ej. González"
                    disabled={isLoading}
                    {...register('maternalSurname')}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="documentNumber">Número de documento</Label>
                </div>
                <Input
                  id="documentNumber"
                  placeholder="DNI / Pasaporte"
                  disabled={isLoading}
                  {...register('documentNumber')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Correo</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nombre@ejemplo.com"
                  disabled={isLoading}
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-destructive text-sm">{errors.email.message as string}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="phone">Teléfono</Label>
                </div>
                <Input
                  id="phone"
                  placeholder="+51 999 999 999"
                  disabled={isLoading}
                  {...register('phone')}
                />
                {errors.phone && (
                  <p className="text-destructive text-sm">{errors.phone.message as string}</p>
                )}
              </div>

              {!isEditing && (showCompanySelect || showBranchSelect) && (
                <div className="pt-2">
                  <Separator className="mb-6" />

                  {showCompanySelect && (
                    <CompanySelector
                      value={currentCompanyId}
                      onChange={(id) => setValue('companyId', id, { shouldValidate: true })}
                      error={errors.companyId?.message as string}
                      disabled={isLoading}
                    />
                  )}

                  {showBranchSelect && (
                    <BranchSelector
                      value={currentBranchId}
                      onChange={(id) => setValue('branchId', id, { shouldValidate: true })}
                      error={errors.branchId?.message as string}
                      disabled={isLoading || !currentCompanyId}
                      companyId={currentCompanyId}
                    />
                  )}
                </div>
              )}
            </form>
          </div>

          <DrawerFooter className="shrink-0 flex-row justify-end gap-3 border-t px-4 pt-4 pb-6 sm:px-6">
            <DrawerClose asChild>
              <Button variant="outline" disabled={isLoading}>
                Cancelar
              </Button>
            </DrawerClose>
            <Button type="submit" form="user-form" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Guardando...
                </>
              ) : isEditing ? (
                'Guardar Cambios'
              ) : (
                'Guardar Usuario'
              )}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}
