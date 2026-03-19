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
import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

// Constantes para las keys — un solo lugar a cambiar si el backend las renombra
const CONFIG_KEY = {
  STORAGE_PATH: 'video.storage.path',
  MAX_SIZE_MB: 'video.max.size.mb',
  ALLOWED_EXTENSIONS: 'video.allowed.extensions',
} as const

type ConfigFormData = Record<(typeof CONFIG_KEY)[keyof typeof CONFIG_KEY], string>

export function SystemConfigPage() {
  const { data: configs = [], isLoading } = useSystemConfig()
  const updateConfig = useUpdateSystemConfig()
  const resetConfig = useResetSystemConfig()

  // Un solo Map en lugar de 3 configs.find() repetidos en cada render
  const configMap = useMemo(() => new Map(configs.map((c) => [c.configKey, c])), [configs])

  const {
    register,
    handleSubmit,
    reset,
    formState: { dirtyFields },
  } = useForm<ConfigFormData>()

  useEffect(() => {
    if (configs.length === 0) return

    reset({
      [CONFIG_KEY.STORAGE_PATH]: configMap.get(CONFIG_KEY.STORAGE_PATH)?.configValue ?? '',
      [CONFIG_KEY.MAX_SIZE_MB]: configMap.get(CONFIG_KEY.MAX_SIZE_MB)?.configValue ?? '',
      [CONFIG_KEY.ALLOWED_EXTENSIONS]:
        configMap.get(CONFIG_KEY.ALLOWED_EXTENSIONS)?.configValue ?? '',
    })
  }, [configs, reset, configMap])

  const onSubmit = async (data: ConfigFormData) => {
    const changedKeys = Object.keys(dirtyFields) as (keyof ConfigFormData)[]

    if (changedKeys.length === 0) {
      toast.info('No hay cambios para guardar')
      return
    }

    await Promise.all(
      changedKeys.map((key) => {
        const config = configMap.get(key)
        if (!config) return Promise.resolve()
        return updateConfig.mutateAsync({ id: config.id, data: { configValue: data[key] } })
      }),
    )
  }

  const handleReset = (id?: number) => {
    if (id) resetConfig.mutate({ id })
  }

  const isDisabled = updateConfig.isPending || resetConfig.isPending
  const hasChanges = Object.keys(dirtyFields).length > 0
  const storagePathConfig = configMap.get(CONFIG_KEY.STORAGE_PATH)
  const maxSizeConfig = configMap.get(CONFIG_KEY.MAX_SIZE_MB)
  const extensionsConfig = configMap.get(CONFIG_KEY.ALLOWED_EXTENSIONS)

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
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
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
                      disabled={isDisabled}
                      {...register(CONFIG_KEY.STORAGE_PATH)}
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
                      disabled={isDisabled}
                      {...register(CONFIG_KEY.MAX_SIZE_MB)}
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
                      disabled={isDisabled}
                      {...register(CONFIG_KEY.ALLOWED_EXTENSIONS)}
                    />
                  </div>
                  <p className="text-muted-foreground text-sm">{extensionsConfig.description}</p>
                </div>
              )}

              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={isDisabled || !hasChanges}>
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
