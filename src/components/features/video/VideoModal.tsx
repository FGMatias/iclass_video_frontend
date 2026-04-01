import { toUploadVideo } from '@/adapters/video.adapter'
import { FileDropzone } from '@/components/shared/FileDropzone'
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
import { useUploadVideo, useVideoUploadConstraints } from '@/hooks/queries/useVideo'
import { uploadVideoSchema, type UploadVideoFormData } from '@/schemas/video.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'

interface VideoModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
  companyId: number
}

export function VideoModal({ open, onOpenChange, onSuccess, companyId }: VideoModalProps) {
  const { mutate: uploadVideo, isPending } = useUploadVideo()
  const { data: constraints, isLoading: isLoadingConstraints } = useVideoUploadConstraints()

  const schema = useMemo(() => {
    return uploadVideoSchema(constraints || { maxSizeMb: 50, allowedExtensions: ['.mp4'] })
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

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) reset()
    onOpenChange(newOpen)
  }

  const onSubmit = (data: UploadVideoFormData) => {
    const formData = toUploadVideo(data, companyId!)
    uploadVideo(formData, {
      onSuccess: () => {
        if (onSuccess) onSuccess()
        handleOpenChange(false)
      },
    })
  }

  const allowedVideoExts = constraints?.allowedExtensions.join(', ') || '.mp4, .mov, .mkv'

  if (isLoadingConstraints) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="flex h-40 items-center justify-center">
          <Loader2 className="text-primary size-8 animate-spin" />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="p-6 sm:max-w-lg">
        <DialogHeader className="text-left">
          <DialogTitle className="text-lg leading-none font-semibold tracking-tight">
            Subir Video
          </DialogTitle>
          <DialogDescription className="text-muted-foreground mt-1.5 text-sm">
            Añade un nuevo video a tu biblioteca. Asegúrate de cumplir con los formatos permitidos.
          </DialogDescription>
        </DialogHeader>

        <form id="create-video-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="no-scrollbar max-h-[60vh] overflow-y-auto p-1">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">
                  Nombre <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="Ej. Introducción a la plataforma"
                  disabled={isPending}
                  {...register('name')}
                />
                {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
              </div>

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
                    disabled={isPending}
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
                        Archivo de Video <span className="text-destructive">*</span>
                      </>
                    }
                    description={`Extensiones soportadas: ${allowedVideoExts} (Max: ${constraints?.maxSizeMb || 50}MB)`}
                    accept={constraints?.allowedExtensions.join(',') || '.mp4,.mov,.mkv'}
                    icon="video"
                    onFileSelect={onChange}
                    value={value}
                    error={errors.file?.message}
                    disabled={isPending}
                  />
                )}
              />
            </div>
          </div>
        </form>

        <DialogFooter className="mt-2 sm:justify-end">
          <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={isPending}>
            Cancelar
          </Button>
          <Button
            type="submit"
            form="create-video-form"
            disabled={isPending}
            className="bg-primary"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Subiendo...
              </>
            ) : (
              'Subir Video'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
