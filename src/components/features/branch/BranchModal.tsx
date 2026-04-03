import { toCreateBranch } from '@/adapters/branch.adapter'
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
import { useCreateBranch } from '@/hooks/queries/useBranch'
import { createBranchSchema, type CreateBranchFormData } from '@/schemas/branch.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

interface BranchModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: (newBranchId: number) => void
  companyId: number
}

export function BranchModal({ open, onOpenChange, onSuccess, companyId }: BranchModalProps) {
  const { mutate: createBranch, isPending } = useCreateBranch()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.input<typeof createBranchSchema>, any, CreateBranchFormData>({
    resolver: zodResolver(createBranchSchema),
    defaultValues: {
      name: '',
      direction: '',
      phone: '',
    },
  })

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) reset()
    onOpenChange(newOpen)
  }

  const onSubmit = (data: CreateBranchFormData) => {
    const payload = toCreateBranch(data, companyId)
    createBranch(
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
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="p-6 sm:max-w-lg">
        <DialogHeader className="text-left">
          <DialogTitle className="text-lg leading-none font-semibold tracking-tight">
            Crear Sucursal
          </DialogTitle>
          <DialogDescription className="text-muted-foreground mt-1.5 text-sm">
            Ingresa los datos de la nueva sucursal para registrarla.
          </DialogDescription>
        </DialogHeader>

        <form id="quick-company-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">
                Nombre <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Ej. TechCorp Solutions"
                disabled={isPending}
                {...register('name')}
              />
              {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="direction">Dirección</Label>
              <Input
                id="direction"
                placeholder="Av. Principal 123, Of. 405"
                disabled={isPending}
                {...register('direction')}
              />
              {errors.direction && (
                <p className="text-destructive text-sm">{errors.direction.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                placeholder="+34 600..."
                disabled={isPending}
                {...register('phone')}
              />
              {errors.phone && <p className="text-destructive text-sm">{errors.phone.message}</p>}
            </div>
          </div>
        </form>

        <DialogFooter className="mt-2 sm:justify-end">
          <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={isPending}>
            Cancelar
          </Button>
          <Button
            type="submit"
            form="quick-company-form"
            disabled={isPending}
            className="bg-primary"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              'Crear Empresa'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
