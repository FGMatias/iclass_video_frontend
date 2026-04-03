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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { DEVICE_TYPES } from '@/constants/device_type'
import {
  createDeviceSchema,
  updateDeviceSchema,
  type CreateDeviceFormData,
  type UpdateDeviceFormData,
} from '@/schemas/device.schema'
import type { DeviceResponse } from '@/types/device.types'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { AreaSelector } from '../area/AreaSelector'

interface DeviceFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CreateDeviceFormData | UpdateDeviceFormData) => void
  device?: DeviceResponse | null
  fixedAreaId?: number
  branchId?: number
  isLoading: boolean
}

export function DeviceForm({ open, onOpenChange, onSubmit, device, fixedAreaId, branchId, isLoading }: DeviceFormProps) {
  const isEditing = !!device
  const formSchema = isEditing ? updateDeviceSchema : createDeviceSchema

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
  })

  const currentAreaId = watch('areaId')

  useEffect(() => {
    if (open && device) {
      const deviceType = DEVICE_TYPES.find((dt) => dt.name === device.deviceType)
      reset({
        deviceName: device.deviceName,
        deviceTypeId: deviceType?.id,
        deviceUsername: device.deviceUsername,
      })
    } else if (open && !device) {
      reset({
        deviceName: '',
        deviceTypeId: undefined,
        deviceUsername: '',
        notes: '',
      })
    }
  }, [open, device, reset])

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="flex h-full flex-col sm:max-w-xl">
        <DrawerHeader className="shrink-0 pb-4 text-left">
          <DrawerTitle>{isEditing ? 'Editar Dispositivo' : 'Crear Dispositivo'}</DrawerTitle>
          <DrawerDescription>
            {isEditing
              ? 'Modifica la información del dispositivo'
              : 'Registra un nuevo dispositivo en el sistema'}
          </DrawerDescription>
        </DrawerHeader>

        <div className="no-scrollbar flex-1 overflow-y-auto px-4 sm:px-6">
          <form
            id="device-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 px-1 pt-2 pb-6"
          >
            <div className="space-y-2">
              <Label htmlFor="deviceName">
                Nombre <span className="text-red-500">*</span>
              </Label>
              <Input
                id="deviceName"
                placeholder="Ej. TV Recepción"
                disabled={isLoading}
                {...register('deviceName')}
              />
              {errors.deviceName && (
                <p className="text-destructive text-sm">{errors.deviceName.message as string}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>
                Tipo <span className="text-red-500">*</span>
              </Label>
              <Controller
                name="deviceTypeId"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value?.toString()}
                    onValueChange={(val) => field.onChange(Number(val))}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un Tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {DEVICE_TYPES.map((type) => (
                        <SelectItem key={type.id} value={type.id.toString()}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.deviceTypeId && (
                <p className="text-destructive text-sm">{errors.deviceTypeId.message as string}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="deviceUsername">
                Username <span className="text-red-500">*</span>
              </Label>
              <Input
                id="deviceUsername"
                placeholder="Ej. tv_03"
                disabled={isLoading}
                {...register('deviceUsername')}
              />
              {errors.deviceUsername && (
                <p className="text-destructive text-sm">
                  {errors.deviceUsername.message as string}
                </p>
              )}
            </div>

            {!isEditing && !fixedAreaId && branchId && (
                <AreaSelector 
                    value={currentAreaId}
                    onChange={(id) => setValue('areaId', id, { shouldValidate: true})}
                    error={errors.areaId?.message as string}
                    disabled={isLoading}
                    branchId={branchId}
                />

              <div className="space-y-2">
                <Label htmlFor="notes">Notas</Label>
                <Textarea
                  id="notes"
                  placeholder="Observaciones sobre este dispositivo..."
                  disabled={isLoading}
                  {...register('notes')}
                />
                {errors.notes && (
                  <p className="text-destructive text-sm">{errors.notes.message as string}</p>
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
          <Button type="submit" form="device-form" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Guardando...
              </>
            ) : isEditing ? (
              'Guardar Cambios'
            ) : (
              'Guardar Dispositivo'
            )}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
