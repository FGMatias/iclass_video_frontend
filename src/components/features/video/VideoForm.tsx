import { FileDropzone } from '@/components/shared/FileDropzone'
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
import { createUploadVideoSchema, type UploadVideoFormData } from '@/schemas/video.schema'
import type { VideoResponse, VideoUploadConstraints } from '@/types/video.types'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useEffect, useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'

interface VideoFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: UploadVideoFormData) => void
  video?: VideoResponse | null
  constraints: VideoUploadConstraints | undefined
  isLoading?: boolean
}

export function VideoForm({
  open,
  onOpenChange,
  onSubmit,
  video,
  constraints,
  isLoading,
}: VideoFormProps) {
  const isEditing = !!video

  const schema = useMemo(() => {
    if (!constraints) {
      return createUploadVideoSchema({ maxSizeMb: 50, allowedExtensions: ['.mp4'] })
    }
    return createUploadVideoSchema(constraints)
  }, [constraints])

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<UploadVideoFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      file: undefined,
      thumbnail: undefined,
    },
  })

  useEffect(() => {
    if (open) {
      if (video) {
        reset({
          name: video.name,
          file: new File([''], 'dummy.mp4'),
          thumbnail: undefined,
        })
      } else {
        reset({ name: '', file: undefined, thumbnail: undefined })
      }
    }
  }, [open, video, reset])

  const allowedVideoExts = constraints?.allowedExtensions.join(', ') || '.mp4, .mov, .mkv'

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="flex h-full w-full flex-col sm:max-w-md">
        <DrawerHeader className="shrink-0 pb-4 text-left">
          <DrawerTitle>{isEditing ? 'Editar Video' : 'Subir Video'}</DrawerTitle>
          <DrawerDescription>
            {isEditing
              ? 'Modifica la información del contenido.'
              : 'Añade un nuevo contenido a tu biblioteca.'}
          </DrawerDescription>
        </DrawerHeader>

        <div className="no-scrollbar flex-1 overflow-y-auto px-4 sm:px-6">
          <form id="video-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-2">
            <div className="space-y-2">
              <Label htmlFor="name">
                Nombre <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Ej. Introducción a iClass"
                disabled={isLoading}
                {...register('name')}
              />
              {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
            </div>

            {!isEditing && (
              <>
                <Controller
                  control={control}
                  name="thumbnail"
                  render={({ field: { onChange, value } }) => (
                    <FileDropzone
                      label="Portada (Opcional)"
                      description="Extensiones soportadas: PNG, JPG, WEBP"
                      accept=".png,.jpg,.jpeg,.webp"
                      icon="image"
                      onFileSelect={onChange}
                      value={value}
                      error={errors.thumbnail?.message}
                      disabled={isLoading}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="file"
                  render={({ field: { onChange, value } }) => (
                    <FileDropzone
                      label={
                        <>
                          Archivo de Video <span className="text-red-500">*</span>
                        </>
                      }
                      description={`Extensiones soportadas: ${allowedVideoExts} (Max: ${constraints?.maxSizeMb || 50}MB)`}
                      accept={constraints?.allowedExtensions.join(',') || '.mp4,.mov,.mkv'}
                      icon="video"
                      onFileSelect={onChange}
                      value={value}
                      error={errors.file?.message}
                      disabled={isLoading}
                    />
                  )}
                />
              </>
            )}
          </form>
        </div>

        <DrawerFooter className="shrink-0 flex-row justify-end gap-3 border-t px-4 pt-4 pb-6 sm:px-6">
          <DrawerClose asChild>
            <Button variant="outline" disabled={isLoading}>
              Cancelar
            </Button>
          </DrawerClose>
          <Button type="submit" form="video-form" disabled={isLoading || !constraints}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : isEditing ? (
              'Guardar Cambios'
            ) : (
              'Subir Video'
            )}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
