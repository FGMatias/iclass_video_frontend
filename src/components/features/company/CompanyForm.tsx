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
import {
  createCompanySchema,
  updateCompanySchema,
  type CreateCompanyFormData,
  type UpdateCompanyFormData,
} from '@/schemas/company.schema'
import type { CompanyResponse } from '@/types/company.types'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

interface CompanyFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CreateCompanyFormData | UpdateCompanyFormData) => void
  company?: CompanyResponse | null
  isLoading?: boolean
}

export function CompanyForm({
  open,
  onOpenChange,
  onSubmit,
  company,
  isLoading,
}: CompanyFormProps) {
  const isEditing = !!company
  const formSchema = isEditing ? updateCompanySchema : createCompanySchema

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
  })

  useEffect(() => {
    if (open && company) {
      reset({
        name: company.name,
        phone: company.phone ?? '',
        ruc: company.ruc ?? '',
        direction: company.direction ?? '',
        email: company.email ?? '',
      })
    } else if (open && !company) {
      reset({
        name: '',
        phone: '',
        ruc: '',
        direction: '',
        email: '',
      })
    }
  }, [open, company, reset])

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="flex h-full w-full flex-col sm:max-w-xl">
        <DrawerHeader className="shrink-0 pb-4 text-left">
          <DrawerTitle>{isEditing ? 'Editar Empresa' : 'Crear Empresa'}</DrawerTitle>
          <DrawerDescription>
            {isEditing
              ? 'Modifica la información de la empresa en el sistema.'
              : 'Completa la información para registrar una nueva empresa en el sistema.'}
          </DrawerDescription>
        </DrawerHeader>

        <div className="no-scrollbar flex-1 overflow-y-auto px-4 sm:px-6">
          <form
            id="company-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 px-1 pt-2 pb-6"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="name">
                  Nombre <span className="text-red-500">*</span>
                </Label>
              </div>
              <Input
                id="name"
                placeholder="Ej. TechGroup Solutions"
                disabled={isLoading}
                {...register('name')}
              />
              {errors.name && <p className="text-destructive text sm">{errors.name.message}</p>}
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">Telefono</Label>
                <Input
                  id="phone"
                  placeholder="+51 999 999 999"
                  disabled={isLoading}
                  {...register('phone')}
                />
                {errors.phone && <p className="text-destructive text-sm">{errors.phone.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="ruc">RUC</Label>
                <Input
                  id="ruc"
                  placeholder="10203040501"
                  disabled={isLoading}
                  {...register('ruc')}
                />
                {errors.ruc && <p className="text-destructive text-sm">{errors.ruc.message}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="direction">Dirección</Label>
              </div>
              <Input
                id="direction"
                placeholder="Av. Principal 123, Of. 405"
                disabled={isLoading}
                {...register('direction')}
              />
              {errors.direction && (
                <p className="text-destructive text sm">{errors.direction.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="email">Correo</Label>
              </div>
              <Input
                id="email"
                placeholder="contacto@empresa.com"
                disabled={isLoading}
                {...register('email')}
              />
              {errors.email && <p className="text-destructive text sm">{errors.email.message}</p>}
            </div>
          </form>
        </div>

        <DrawerFooter className="shrink-0 flex-row justify-end gap-3 border-t px-4 pt-4 pb-6 sm:px-6">
          <DrawerClose asChild>
            <Button variant="outline" disabled={isLoading}>
              Cancelar
            </Button>
          </DrawerClose>
          <Button type="submit" form="company-form" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Guardando...
              </>
            ) : isEditing ? (
              'Guardar Cambios'
            ) : (
              'Guardar Empresa'
            )}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
