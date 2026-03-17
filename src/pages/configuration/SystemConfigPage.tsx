import { PageHeader } from '@/components/shared/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  useResetSystemConfig,
  useSystemConfig,
  useUpdateSystemConfig,
} from '@/hooks/queries/useSystemConfig'
import { FileVideo, Folder, HardDrive, Loader2, RotateCcw } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

export function SystemConfigPage() {
  const { data: configs = [], isLoading } = useSystemConfig()
  const updateConfig = useUpdateSystemConfig()
  const resetConfig = useResetSystemConfig()
  const [isSavingAll, setIsSavingAll] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { dirtyFields },
  } = useForm<Record<string, string>>()

  const storagePathConfig = configs.find((c) => c.configKey === 'video.storage.path')
  const maxSizeConfig = configs.find((c) => c.configKey === 'video.max.size.mb')
  const extensionsConfig = configs.find((c) => c.configKey === 'video.allowed.extensions')

  useEffect(() => {
    if (configs.length > 0) {
      reset({
        'video.storage.path': storagePathConfig?.configValue ?? '',
        'video.max.size.mb': maxSizeConfig?.configValue ?? '',
        'video.allowed.extensions': extensionsConfig?.configValue ?? '',
      })
    }
  }, [configs, reset, storagePathConfig, maxSizeConfig, extensionsConfig])

  const onSubmit = async (data: Record<string, string>) => {
    const changedKeys = Object.keys(dirtyFields)

    if (changedKeys.length === 0) {
      toast.info('No hay cambios para guardar')
      return
    }

    setIsSavingAll(true)
    try {
      const promises = changedKeys.map((key) => {
        const configId = configs.find((c) => c.configKey === key)?.id
        if (!configId) return Promise.resolve()

        return updateConfig.mutateAsync({
          id: configId,
          data: { configValue: data[key] },
        })
      })

      await Promise.all(promises)
    } catch (error) {
      console.error('Error al guardar las configuraciones:', error)
    } finally {
      setIsSavingAll(false)
    }
  }

  const handleReset = (id?: number) => {
    if (id) resetConfig.mutate({ id })
  }

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="text-primary size-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Configuración del Sistema"
        description="Administra los parámetros globales de la plataforma de video"
      />

      <div className="mx-auto max-w-3xl">
        <Card className="bg-card/50">
          <CardHeader>
            <CardTitle className="text-xl">Parámetros Generales</CardTitle>
            <CardDescription>Ajusta la configuración de almacenamiento y subida.</CardDescription>
          </CardHeader>

          <CardContent>
            <form id="system-config-form" onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {storagePathConfig && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="storage-path" className="text-base font-medium">
                      Ruta de Video
                    </Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleReset(storagePathConfig.id)}
                      disabled={
                        resetConfig.isPending ||
                        storagePathConfig.configValue === storagePathConfig.defaultValue
                      }
                      className="text-muted-foreground hover:text-foreground h-8 text-xs"
                    >
                      <RotateCcw className="mr-2 size-3" />
                      Restablecer
                    </Button>
                  </div>
                  <div className="relative flex items-center">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Folder className="text-muted-foreground size-4" />
                    </div>
                    <Input
                      id="storage-path"
                      className="pl-10"
                      disabled={isSavingAll || resetConfig.isPending}
                      {...register('video.storage.path')}
                    />
                  </div>
                  <p className="text-muted-foreground text-sm">{storagePathConfig.description}</p>
                </div>
              )}

              {maxSizeConfig && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="max-size" className="text-base font-medium">
                      Tamaño Máximo de Video
                    </Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleReset(maxSizeConfig.id)}
                      disabled={
                        resetConfig.isPending ||
                        maxSizeConfig.configValue === maxSizeConfig.defaultValue
                      }
                      className="text-muted-foreground hover:text-foreground h-8 text-xs"
                    >
                      <RotateCcw className="mr-2 size-3" />
                      Restablecer
                    </Button>
                  </div>
                  <div className="relative flex items-center">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <HardDrive className="text-muted-foreground size-4" />
                    </div>
                    <Input
                      id="max-size"
                      type="number"
                      className="pr-12 pl-10"
                      disabled={isSavingAll || resetConfig.isPending}
                      {...register('video.max.size.mb')}
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      <span className="text-muted-foreground text-sm font-medium">MB</span>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm">{maxSizeConfig.description}</p>
                </div>
              )}

              {extensionsConfig && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="allowed-extensions" className="text-base font-medium">
                      Extensiones Permitidas
                    </Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleReset(extensionsConfig.id)}
                      disabled={
                        resetConfig.isPending ||
                        extensionsConfig.configValue === extensionsConfig.defaultValue
                      }
                      className="text-muted-foreground hover:text-foreground h-8 text-xs"
                    >
                      <RotateCcw className="mr-2 size-3" />
                      Restablecer
                    </Button>
                  </div>
                  <div className="relative flex items-center">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <FileVideo className="text-muted-foreground size-4" />
                    </div>
                    <Input
                      id="allowed-extensions"
                      className="pl-10"
                      disabled={isSavingAll || resetConfig.isPending}
                      {...register('video.allowed.extensions')}
                    />
                  </div>
                  <p className="text-muted-foreground text-sm">{extensionsConfig.description}</p>
                </div>
              )}

              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  disabled={isSavingAll || Object.keys(dirtyFields).length === 0}
                  className="bg-primary"
                >
                  {isSavingAll ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    'Guardar Cambios'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
