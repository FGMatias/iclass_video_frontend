import { toUpdateArea } from '@/adapters/area.adapter'
import { toCreateDevice, toUpdateDevice } from '@/adapters/device.adapter'
import { DeviceForm, DeviceTable } from '@/components/features/device'
import { CurrentPlaylistCard, PlaylistForm } from '@/components/features/playlist'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { ROUTES } from '@/constants/routes'
import { useDetailArea, useUpdateArea } from '@/hooks/queries/useArea'
import { useSyncPlaylist } from '@/hooks/queries/useAreaVideo'
import {
  useActivateDevice,
  useCreateDevice,
  useDeactivateDevice,
  useUpdateDevice,
} from '@/hooks/queries/useDevice'
import { useVideos } from '@/hooks/queries/useVideo'
import { buildRoute } from '@/lib/route-builder'
import type { UpdateAreaFormData } from '@/schemas/area.schema'
import {
  createDeviceSchema,
  updateDeviceSchema,
  type CreateDeviceFormData,
  type UpdateDeviceFormData,
} from '@/schemas/device.schema'
import { useBreadcrumbStore } from '@/stores/breadcrumb.store'
import type { AreaResponse } from '@/types/area.types'
import type { DeviceInfo } from '@/types/device.types'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import {
  ArrowLeft,
  Calendar,
  LayoutDashboard,
  Loader2,
  Pencil,
  Plus,
  ShieldCheck,
  ShieldOff,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AreaForm } from './AreaForm'

export function AreaDetailPage() {
  const navigate = useNavigate()
  const { branchId: paramBranchId, areaId: paramAreaId } = useParams<{
    branchId: string
    areaId: string
  }>()
  const areaId = paramAreaId ? parseInt(paramAreaId, 10) : undefined
  const branchId = paramBranchId ? parseInt(paramBranchId, 10) : undefined
  const { data: area, isLoading, isError } = useDetailArea(areaId)
  const { data: companyVideos = [] } = useVideos(area?.companyId)
  const syncPlaylist = useSyncPlaylist(areaId!)
  const updateArea = useUpdateArea()
  const serverPlaylist = area?.playlist ?? []
  const createDevice = useCreateDevice({ areaId })
  const updateDevice = useUpdateDevice({ areaId })
  const activateDevice = useActivateDevice({ areaId })
  const deactivateDevice = useDeactivateDevice({ areaId })
  const [areaFormOpen, setAreaFormOpen] = useState(false)
  const [selectedArea, setSelectedArea] = useState<AreaResponse | null>(null)
  const [playlistFormOpen, setPlaylistFormOpen] = useState(false)
  const currentPlaylistIds = serverPlaylist.map((v) => v.id)
  const playlistKey = serverPlaylist.map((v) => v.id).join('-')
  const [deviceFormOpen, setDeviceFormOpen] = useState(false)
  const [selectedDeviceId, setSelectedDeviceId] = useState<number | null>(null)
  const [toggleDeviceDialog, setToggleDeviceDialog] = useState<DeviceInfo | null>(null)
  const setCustomBreadcrumbs = useBreadcrumbStore((state) => state.setCustomBreadcrumbs)

  useEffect(() => {
    if (area?.name) {
      if (paramBranchId) {
        setCustomBreadcrumbs([
          { label: 'Sucursal', path: ROUTES.COMPANY_ADMINISTRATOR.BRANCH },
          {
            label: area.branchName,
            path: buildRoute(ROUTES.COMPANY_ADMINISTRATOR.BRANCH_DETAIL, {
              branchId: branchId ?? '',
            }),
          },
          { label: area.name },
        ])
      } else {
        setCustomBreadcrumbs([
          {
            label: 'Áreas',
            path: ROUTES.BRANCH_ADMINISTRATOR.AREA,
          },
          { label: area.name },
        ])
      }
    }
    return () => setCustomBreadcrumbs(null)
  }, [area?.name, setCustomBreadcrumbs])

  const handleEditArea = (area: AreaResponse) => {
    setSelectedArea(area)
    setAreaFormOpen(true)
  }

  const handleEditDevice = (device: DeviceInfo) => {
    setSelectedDeviceId(device.id)
    setDeviceFormOpen(true)
  }

  const handleAreaFormSubmit = (data: UpdateAreaFormData) => {
    if (selectedArea) {
      const payload = toUpdateArea(data, selectedArea)
      updateArea.mutate(
        { id: selectedArea.id, data: payload },
        { onSuccess: () => setAreaFormOpen(false) },
      )
    }
  }

  const handleDeviceFormSubmit = (data: CreateDeviceFormData | UpdateDeviceFormData) => {
    if (selectedDeviceId) {
      const payload = toUpdateDevice(data as UpdateDeviceFormData)
      updateDevice.mutate(
        { id: selectedDeviceId, data: payload },
        { onSuccess: () => setDeviceFormOpen(false) },
      )
      return
    }

    const payload = toCreateDevice(data as CreateDeviceFormData)
    createDevice.mutate({ data: payload }, { onSuccess: () => setDeviceFormOpen(false) })
  }

  const handleConfirmToggleDevice = () => {
    if (!toggleDeviceDialog) return
    if (toggleDeviceDialog.isActive) {
      deactivateDevice.mutate(
        { id: toggleDeviceDialog.id },
        { onSuccess: () => setToggleDeviceDialog(null) },
      )
    } else {
      activateDevice.mutate(
        { id: toggleDeviceDialog.id },
        { onSuccess: () => setToggleDeviceDialog(null) },
      )
    }
  }

  const handleSyncPlaylist = (selectedIds: number[]) => {
    syncPlaylist.mutate(selectedIds, {
      onSuccess: () => {
        setPlaylistFormOpen(false)
      },
    })
  }

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="text-primary size-8 animate-spin" />
      </div>
    )
  }

  if (isError || !area) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center space-y-4">
        <p className="text-muted-foreground">Error al cargar los detalles del área.</p>
        <Button onClick={() => navigate(-1)}>Volver</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 shadow-sm"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-foreground text-2xl font-bold tracking-tight">{area.name}</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-3">
        <Card className="flex flex-col shadow-sm lg:col-span-1">
          <CardContent className="flex h-full flex-col space-y-6 p-6">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 text-primary flex h-12 w-12 shrink-0 items-center justify-center rounded-lg">
                <LayoutDashboard className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg leading-none font-semibold">{area.name}</h3>
                <p className="text-muted-foreground mt-1 text-sm">Detalle del Área</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                  Descripción
                </label>
                <div className="text-foreground text-sm">
                  {area.description || 'Sin descripción'}
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                  Fecha de Registro
                </label>
                <div className="text-foreground flex items-center gap-2 text-sm">
                  <Calendar className="text-muted-foreground h-4 w-4 shrink-0" />
                  <span>
                    {area.createdAt
                      ? format(new Date(area.createdAt), 'dd MMM yyyy', { locale: es })
                      : '-'}
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                  Estado
                </label>
                <div>
                  <StatusBadge isActive={area.isActive} />
                </div>
              </div>
            </div>

            <div className="border-border mt-auto border-t pt-4">
              <Button variant="outline" className="h-9 w-full" onClick={() => handleEditArea(area)}>
                <Pencil className="mr-2 h-4 w-4" />
                Editar Información
              </Button>
            </div>
          </CardContent>
        </Card>

        <CurrentPlaylistCard
          key={playlistKey}
          serverPlaylist={serverPlaylist}
          onSyncPlaylist={(ids) => syncPlaylist.mutate(ids)}
          onAddVideoClick={() => setPlaylistFormOpen(true)}
        />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-lg">Dispositivos Conectados</CardTitle>
            <CardDescription>Gestión de dispositivos registrados en el área.</CardDescription>
          </div>
          <Button
            onClick={() => {
              setSelectedDeviceId(null)
              setDeviceFormOpen(true)
            }}
          >
            <Plus className="mr-2 size-4" />
            Nuevo Dispositivo
          </Button>
        </CardHeader>
        <CardContent className="pt-0">
          <DeviceTable
            data={area.devices || []}
            isLoading={false}
            showAreaColumn={false}
            renderActions={(device) => (
              <>
                <DropdownMenuItem onClick={() => handleEditDevice(device)}>
                  <Pencil className="mr-2 size-4" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setToggleDeviceDialog(device)}>
                  {device.isActive ? (
                    <>
                      <ShieldOff className="text-destructive mr-2 size-4" />
                      <span className="text-destructive">Desactivar</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="mr-2 size-4" /> Activar
                    </>
                  )}
                </DropdownMenuItem>
              </>
            )}
          />
        </CardContent>
      </Card>

      <AreaForm
        open={areaFormOpen}
        onOpenChange={setAreaFormOpen}
        area={area}
        onSubmit={handleAreaFormSubmit}
        isLoading={updateArea.isPending}
      />

      <PlaylistForm
        key={playlistFormOpen ? 'open' : 'closed'}
        open={playlistFormOpen}
        onOpenChange={setPlaylistFormOpen}
        availableVideos={companyVideos.filter((v) => v.isActive)}
        currentPlaylistIds={currentPlaylistIds}
        onConfirm={handleSyncPlaylist}
        isLoading={syncPlaylist.isPending}
        companyId={area.companyId}
      />

      <DeviceForm
        open={deviceFormOpen}
        onOpenChange={setDeviceFormOpen}
        deviceId={selectedDeviceId}
        onSubmit={handleDeviceFormSubmit}
        isLoadingAction={createDevice.isPending || updateDevice.isPending}
        branchId={area.branchId}
        showAreaSelect={true}
        schema={selectedDeviceId ? updateDeviceSchema : createDeviceSchema}
      />

      <ConfirmDialog
        open={!!toggleDeviceDialog}
        onOpenChange={(open) => !open && setToggleDeviceDialog(null)}
        title={
          toggleDeviceDialog
            ? `¿${toggleDeviceDialog.isActive ? 'Desactivar' : 'Activar'} el dispositivo ${toggleDeviceDialog.deviceName}?`
            : ''
        }
        description={
          toggleDeviceDialog
            ? toggleDeviceDialog.isActive
              ? `Al desactivar "${toggleDeviceDialog.deviceName}", el equipo perderá conexión con la plataforma, se cerrará su sesión y dejará de reproducir el contenido asignado.`
              : `Al activar "${toggleDeviceDialog.deviceName}", el equipo recuperará el acceso a la plataforma y reanudará la sincronización de su playlist.`
            : ''
        }
        onConfirm={handleConfirmToggleDevice}
        confirmLabel={toggleDeviceDialog?.isActive ? 'Desactivar' : 'Activar'}
        variant={toggleDeviceDialog?.isActive ? 'destructive' : 'default'}
        loading={activateDevice.isPending || deactivateDevice.isPending}
      />
    </div>
  )
}
