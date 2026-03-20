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
import type { SystemConfigResponse } from '@/types/system_config.types'
import { FileVideo, Folder, HardDrive, Loader2, RotateCcw } from 'lucide-react'
import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

const CONFIG_KEY = {
  storagePath: 'video.storage.path',
  maxSizeMb: 'video.max.size.mb',
  allowedExtensions: 'video.allowed.extensions',
} as const

type ConfigFormData = {
  storagePath: string
  maxSizeMb: string
  allowedExtensions: string
}

export function SystemConfigPage() {
  const { data: configs = [], isLoading } = useSystemConfig()
  const updateConfig = useUpdateSystemConfig()
  const resetConfig = useResetSystemConfig()

  const configMap = useMemo(() => new Map(configs.map((c) => [c.configKey, c])), [configs])

  const { register, handleSubmit, reset } = useForm<ConfigFormData>()

  useEffect(() => {
    if (configs.length === 0) return

    reset({
      storagePath: configMap.get(CONFIG_KEY.storagePath)?.configValue ?? '',
      maxSizeMb: configMap.get(CONFIG_KEY.maxSizeMb)?.configValue ?? '',
      allowedExtensions: configMap.get(CONFIG_KEY.allowedExtensions)?.configValue ?? '',
    })
  }, [configs, reset, configMap])

  const onSubmit = async (data: ConfigFormData) => {
    const promises: Promise<SystemConfigResponse>[] = []

    Object.entries(CONFIG_KEY).forEach(([formKey, dbKey]) => {
      const originalConfig = configMap.get(dbKey)
      const newValue = data[formKey as keyof ConfigFormData]

      if (originalConfig && originalConfig.configValue !== newValue) {
        promises.push(
          updateConfig.mutateAsync({ id: originalConfig.id, data: { configValue: newValue } }),
        )
      }
    })

    if (promises.length === 0) {
      toast.info('No hay cambios para guardar')
      return
    }

    try {
      await Promise.all(promises)
    } catch (error) {
      console.error('Error al guardar:', error)
    }
  }

  const handleReset = (id?: number) => {
    if (id) resetConfig.mutate({ id })
  }

  const isDisabled = updateConfig.isPending || resetConfig.isPending

  const storagePathConfig = configMap.get(CONFIG_KEY.storagePath)
  const maxSizeConfig = configMap.get(CONFIG_KEY.maxSizeMb)
  const extensionsConfig = configMap.get(CONFIG_KEY.allowedExtensions)

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
                      disabled={isDisabled}
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
                      disabled={isDisabled}
                      {...register('storagePath')}
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
                      disabled={isDisabled}
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
                      disabled={isDisabled}
                      {...register('maxSizeMb')}
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
                      disabled={isDisabled}
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
                      disabled={isDisabled}
                      {...register('allowedExtensions')}
                    />
                  </div>
                  <p className="text-muted-foreground text-sm">{extensionsConfig.description}</p>
                </div>
              )}

              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  form="system-config-form"
                  disabled={isDisabled}
                  className="bg-primary"
                >
                  {updateConfig.isPending ? (
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
