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
  createBranchSchema,
  updateBranchSchema,
  type CreateBranchFormData,
  type UpdateBranchFormData,
} from '@/schemas/branch.schema'
import type { BranchResponse } from '@/types/branch.types'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

interface BranchFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CreateBranchFormData | UpdateBranchFormData) => void
  branch?: BranchResponse | null
  isLoading?: boolean
}

export function BranchForm({ open, onOpenChange, onSubmit, branch, isLoading }: BranchFormProps) {
  const isEditing = !!branch
  const formSchema = isEditing ? updateBranchSchema : createBranchSchema

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
  })

  useEffect(() => {
    if (open && branch) {
      reset({
        name: branch.name,
        direction: branch.direction ?? '',
        phone: branch.phone ?? '',
      })
    } else if (open && !branch) {
      reset({
        name: '',
        direction: '',
        phone: '',
      })
    }
  }, [open, branch, reset])

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="flex h-full w-full flex-col sm:max-w-xl">
        <DrawerHeader className="shrink-0 pb-4 text-left">
          <DrawerTitle>{isEditing ? 'Editar Sucursal' : 'Crear Sucursal'}</DrawerTitle>
          <DrawerDescription>
            {isEditing
              ? 'Modifica la información de la sucursal en el sistema'
              : 'Completa la información para registrar una nueva sucursal en el sistema'}
          </DrawerDescription>
        </DrawerHeader>

        <div className="no-scrollbar flex-1 overflow-y-auto px-4 sm:px-6">
          <form
            id="branch-form"
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
                placeholder="Ej. Sucursal Central"
                disabled={isLoading}
                {...register('name')}
              />
              {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="direction">Dirección</Label>
              </div>
              <Input
                id="direction"
                placeholder="Ej. Av. Principal 123"
                disabled={isLoading}
                {...register('direction')}
              />
              {errors.direction && (
                <p className="text-destructive text-sm">{errors.direction.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="phone">Teléfono</Label>
              </div>
              <Input
                id="phone"
                placeholder="Ej. Sucursal Central"
                disabled={isLoading}
                {...register('phone')}
              />
              {errors.phone && <p className="text-destructive text-sm">{errors.phone.message}</p>}
            </div>
          </form>
        </div>

        <DrawerFooter className="shrink-0 flex-row justify-end gap-3 border-t px-4 pt-4 pb-6 sm:px-6">
          <DrawerClose asChild>
            <Button variant="outline" disabled={isLoading}>
              Cancelar
            </Button>
          </DrawerClose>
          <Button type="submit" form="branch-form" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Guardando...
              </>
            ) : isEditing ? (
              'Guardar Cambios'
            ) : (
              'Guardar Sucursal'
            )}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
