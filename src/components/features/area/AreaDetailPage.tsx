import { toUpdateArea } from '@/adapters/area.adapter'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ROUTES } from '@/constants/routes'
import {
  useActivateArea,
  useDeactivateArea,
  useDetailArea,
  useUpdateArea,
} from '@/hooks/queries/useArea'
import { useSyncPlaylist } from '@/hooks/queries/useAreaVideo'
import { useVideos } from '@/hooks/queries/useVideo'
import { buildRoute } from '@/lib/route-builder'
import type { UpdateAreaFormData } from '@/schemas/area.schema'
import { useBreadcrumbStore } from '@/stores/breadcrumb.store'
import type { AreaDetail } from '@/types/area.types'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { ArrowLeft, Calendar, LayoutDashboard, Loader2, Pencil, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CurrentPlaylistCard } from '../playlist/CurrentPlaylistCard'
import { PlaylistForm } from '../playlist/PlaylistForm'
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
  const activateArea = useActivateArea()
  const deactivateArea = useDeactivateArea()
  const serverPlaylist = area?.playlist ?? []
  const [areaFormOpen, setAreaFormOpen] = useState(false)
  const [toggleDialog, setToggleDialog] = useState<AreaDetail | null>(null)
  const [playlistFormOpen, setPlaylistFormOpen] = useState(false)
  const setCustomBreadcrumbs = useBreadcrumbStore((state) => state.setCustomBreadcrumbs)
  const currentPlaylistIds = serverPlaylist.map((v) => v.id)
  const playlistKey = serverPlaylist.map((v) => v.id).join('-')

  useEffect(() => {
    if (area?.name) {
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
    }
    return () => setCustomBreadcrumbs(null)
  }, [area?.name, setCustomBreadcrumbs])

  const handleEditArea = () => setAreaFormOpen(true)

  const handleAreaFormSubmit = (data: UpdateAreaFormData) => {
    if (area) {
      const payload = toUpdateArea(data, area)
      updateArea.mutate({ id: area.id, data: payload }, { onSuccess: () => setAreaFormOpen(false) })
    }
  }

  const handleConfirmToggle = () => {
    if (!toggleDialog) return
    if (toggleDialog.isActive) {
      deactivateArea.mutate({ id: toggleDialog.id }, { onSuccess: () => setToggleDialog(null) })
    } else {
      activateArea.mutate({ id: toggleDialog.id }, { onSuccess: () => setToggleDialog(null) })
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
              <Button variant="outline" className="h-9 w-full" onClick={handleEditArea}>
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

      <Card className="shadow-sm">
        <CardHeader className="border-border/40 flex flex-row items-center justify-between border-b pb-4">
          <div className="space-y-1">
            <CardTitle className="text-lg">Dispositivos Conectados</CardTitle>
            <CardDescription>Gestión de pantallas y tablets en esta área.</CardDescription>
          </div>
          <Button size="sm">
            <Plus className="mr-2 size-4" />
            Agregar Dispositivo
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="text-muted-foreground bg-muted/10 p-8 text-center text-sm">
            Tabla de dispositivos (En construcción...)
          </div>
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
    </div>
  )
}
