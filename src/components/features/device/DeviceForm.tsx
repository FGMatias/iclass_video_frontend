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
import { Separator } from '@/components/ui/separator'
import { DEVICE_TYPES } from '@/constants/device_type'
import { useDevice } from '@/hooks/queries/useDevice'
import { type CreateDeviceFormData, type UpdateDeviceFormData } from '@/schemas/device.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { AreaSelector } from '../area/AreaSelector'

interface DeviceFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CreateDeviceFormData | UpdateDeviceFormData) => void
  deviceId?: number | null
  isLoadingAction: boolean
  fixedAreaId?: number
  branchId?: number
  showAreaSelect?: boolean
  schema: z.ZodType<any, any>
}

export function DeviceForm({
  open,
  onOpenChange,
  onSubmit,
  deviceId,
  isLoadingAction,
  fixedAreaId,
  branchId,
  showAreaSelect,
  schema,
}: DeviceFormProps) {
  const isEditing = !!deviceId
  const { data: device, isLoading: isLoadingDetails } = useDevice(open ? (deviceId ?? null) : null)

  const formValues =
    isEditing && device
      ? {
          deviceName: device.deviceName,
          deviceTypeId: DEVICE_TYPES.find((type) => type.name === device.deviceType)?.id,
          deviceUsername: device.deviceUsername,
          areaId: device.currentAreaId || undefined,
        }
      : {
          deviceName: '',
          deviceTypeId: undefined,
          deviceUsername: '',
          areaId: fixedAreaId,
        }

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    values: open ? formValues : undefined,
  })

  const currentAreaId = watch('areaId') || fixedAreaId

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
          {isLoadingDetails ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="text-primary size-8 animate-spin" />
              <span className="text-muted-foreground ml-3 text-sm">
                Cargando datos del dispositivo
              </span>
            </div>
          ) : (
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
                  disabled={isLoadingAction}
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
                      disabled={isLoadingAction}
                    >
                      <SelectTrigger className="w-full">
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
                  <p className="text-destructive text-sm">
                    {errors.deviceTypeId.message as string}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="deviceUsername">
                  Username <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="deviceUsername"
                  placeholder="Ej. tv_03"
                  disabled={isLoadingAction}
                  {...register('deviceUsername')}
                />
                {errors.deviceUsername && (
                  <p className="text-destructive text-sm">
                    {errors.deviceUsername.message as string}
                  </p>
                )}
              </div>

              {!isEditing && showAreaSelect && (
                <div className="pt-2">
                  <Separator className="mb-6" />

                  <AreaSelector
                    value={currentAreaId}
                    onChange={(id) => setValue('areaId', id, { shouldValidate: true })}
                    error={errors.areaId?.message as string}
                    disabled={isLoadingAction}
                    branchId={branchId}
                  />
                </div>
              )}
            </form>
          )}
        </div>

        <DrawerFooter className="shrink-0 flex-row justify-end gap-3 border-t px-4 pt-4 pb-6 sm:px-6">
          <DrawerClose asChild>
            <Button variant="outline" disabled={isLoadingAction}>
              Cancelar
            </Button>
          </DrawerClose>
          <Button type="submit" form="device-form" disabled={isLoadingAction}>
            {isLoadingAction ? (
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
