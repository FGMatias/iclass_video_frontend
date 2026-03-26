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
import { Textarea } from '@/components/ui/textarea'
import {
  createAreaSchema,
  updateAreaSchema,
  type CreateAreaFormData,
  type UpdateAreaFormData,
} from '@/schemas/area.schema'
import type { AreaResponse } from '@/types/area.types'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

interface AreaFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CreateAreaFormData | UpdateAreaFormData) => void
  area?: AreaResponse | null
  isLoading?: boolean
}

export function AreaForm({ open, onOpenChange, onSubmit, area, isLoading }: AreaFormProps) {
  const isEditing = !!area
  const formSchema = isEditing ? updateAreaSchema : createAreaSchema

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
  })

  useEffect(() => {
    if (open) {
      if (area) {
        reset({
          name: area.name || '',
          description: area.description || '',
        })
      } else {
        reset({
          name: '',
          description: '',
        })
      }
    }
  }, [open, area, reset])

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="flex h-full w-full flex-col sm:max-w-xl">
        <DrawerHeader className="shrink-0 pb-4 text-left">
          <DrawerTitle>{isEditing ? 'Editar Área' : 'Crear Área'}</DrawerTitle>
          <DrawerDescription>
            {isEditing
              ? 'Modifica la información del área en el sistema'
              : 'Completa la información para registrar una nueva área en el sistema'}
          </DrawerDescription>
        </DrawerHeader>

        <div className="no-scrollbar flex-1 overflow-y-auto px-4 sm:px-6">
          <form
            id="area-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 px-1 pt-2 pb-6"
          >
            <div className="space-y-2">
              <Label htmlFor="name">
                Nombre <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Ej. Recepción"
                disabled={isLoading}
                {...register('name')}
              />
              {errors.name && (
                <p className="text-destructive text-sm">{errors.name.message as string}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                placeholder="Describe el propósito o ubicación de esta área"
                disabled={isLoading}
                className="resize-none"
                rows={4}
                {...register('description')}
              />
              {errors.description && (
                <p className="text-destructive text-sm">{errors.description.message as string}</p>
              )}
            </div>
          </form>
        </div>

        <DrawerFooter className="shrink-0 flex-row justify-end gap-3 border-t px-4 pt-4 pb-6 sm:px-6">
          <DrawerClose asChild>
            <Button variant="outline" disabled={isLoading}>
              Cancelar
            </Button>
          </DrawerClose>
          <Button type="submit" form="area-form" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Guardando...
              </>
            ) : isEditing ? (
              'Guardar cambios'
            ) : (
              'Guardar Área'
            )}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
