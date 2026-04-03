import { toCreateArea } from '@/adapters/area.adapter'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useCreateArea } from '@/hooks/queries/useArea'
import { createAreaSchema, type CreateAreaFormData } from '@/schemas/area.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

interface AreaModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: (newAreaId: number) => void
  branchId: number
}

export function AreaModal({ open, onOpenChange, onSuccess, branchId }: AreaModalProps) {
  const { mutate: createArea, isPending } = useCreateArea()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.input<typeof createAreaSchema>, any, CreateAreaFormData>({
    resolver: zodResolver(createAreaSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  })

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) reset()
    onOpenChange(newOpen)
  }

  const onSubmit = (data: CreateAreaFormData) => {
    const payload = toCreateArea(data, branchId)
    createArea(
      { data: payload },
      {
        onSuccess: (response) => {
          if (onSuccess && response?.id) {
            onSuccess(response.id)
          }
          handleOpenChange(false)
        },
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-6 sm:max-w-lg">
        <DialogHeader className="text-left">
          <DialogTitle className="text-lg leading-none font-semibold tracking-tight">
            Crear Área
          </DialogTitle>
          <DialogDescription className="text-muted-foreground mt-1.5 text-sm">
            Ingresa los datos de la nueva área para registrarla.
          </DialogDescription>
        </DialogHeader>

        <form id="quick-area-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">
                Nombre <span className=""></span>
              </Label>
              <Input
                id="name"
                placeholder="Ej. Recepción"
                disabled={isPending}
                {...register('name')}
              />
              {errors.name && (
                <p className="text-destructive text-sm">{errors.name.message as string}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                placeholder="Describe el propósito o ubicación de esta área"
                disabled={isPending}
                className="resize-none"
                rows={4}
                {...register('description')}
              />
              {errors.description && (
                <p className="text-destructive text-sm">{errors.description.message as string}</p>
              )}
            </div>
          </div>
        </form>

        <DialogFooter className="mt-2 sm:justify-end">
          <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={isPending}>
            Cancelar
          </Button>
          <Button type="submit" form="quick-area-form" disabled={isPending} className="bg-primary">
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              'Crear Área'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
