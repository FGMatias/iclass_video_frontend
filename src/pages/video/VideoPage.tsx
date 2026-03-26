import { VideoCard } from '@/components/features/video/VideoCard'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ROUTES } from '@/constants/routes'
import { useBreadcrumbStore } from '@/stores/breadcrumb.store'
import type { VideoResponse } from '@/types/video.types'
import { Search, Upload } from 'lucide-react'
import { useEffect, useState } from 'react'

// --- Mock Data ---
const MOCK_VIDEOS: VideoResponse[] = [
  {
    id: 1,
    companyId: 1,
    companyName: 'Empresa Demo',
    name: 'Introducción a la Plataforma',
    fileExtension: 'mp4',
    duration: 320, // 5 minutos * 60 + 20 = 320 segundos
    fileSize: 15400000,
    checksum: 'abc123hash',
    urlVideo: null,
    isActive: true,
    createdAt: '2023-10-12T10:00:00Z',
    updatedAt: '2023-10-12T10:00:00Z',
    thumbnail: 'https://picsum.photos/seed/vid1/400/225',
  },
  {
    id: 2,
    companyId: 1,
    companyName: 'Empresa Demo',
    name: 'Tutorial de Seguridad Básica',
    fileExtension: 'mov',
    duration: 765, // 12:45
    fileSize: 25400000,
    checksum: 'def456hash',
    urlVideo: null,
    isActive: true,
    createdAt: '2023-10-08T14:30:00Z',
    updatedAt: '2023-10-08T14:30:00Z',
    thumbnail: 'https://picsum.photos/seed/vid2/400/225',
  },
  {
    id: 3,
    companyId: 1,
    companyName: 'Empresa Demo',
    name: 'Campaña Marketing Q3 2024',
    fileExtension: 'mp4',
    duration: 90, // 01:30
    fileSize: 8400000,
    checksum: 'ghi789hash',
    urlVideo: null,
    isActive: true,
    createdAt: '2023-10-01T09:15:00Z',
    updatedAt: '2023-10-01T09:15:00Z',
    thumbnail: 'https://picsum.photos/seed/vid3/400/225',
  },
]

export function VideoPage() {
  const setCustomBreadcrumbs = useBreadcrumbStore((state) => state.setCustomBreadcrumbs)

  // -- Estados de Filtros --
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [extensionFilter, setExtensionFilter] = useState('all')

  // -- Estados de Diálogos/Formularios (Preparados para tu lógica real) --
  const [formOpen, setFormOpen] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<VideoResponse | null>(null)
  const [toggleDialog, setToggleDialog] = useState<VideoResponse | null>(null)
  const [deleteDialog, setDeleteDialog] = useState<VideoResponse | null>(null)

  useEffect(() => {
    setCustomBreadcrumbs([{ label: 'Videos', path: ROUTES.COMPANY_ADMINISTRATOR.VIDEO }])
    return () => setCustomBreadcrumbs(null)
  }, [setCustomBreadcrumbs])

  // Lógica de filtrado
  const filteredVideos = MOCK_VIDEOS.filter((video) => {
    const matchesSearch = video.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus =
      statusFilter === 'all' ? true : statusFilter === 'active' ? video.isActive : !video.isActive
    const matchesExtension =
      extensionFilter === 'all'
        ? true
        : video.fileExtension.toLowerCase() === extensionFilter.toLowerCase()
    return matchesSearch && matchesStatus && matchesExtension
  })

  const handleClearFilters = () => {
    setSearchTerm('')
    setStatusFilter('all')
    setExtensionFilter('all')
  }

  // Handlers de la Card
  const handleEdit = (video: VideoResponse) => {
    setSelectedVideo(video)
    setFormOpen(true)
  }

  const handleConfirmToggle = () => {
    if (!toggleDialog) return
    // TODO: Llamar a tu mutación useActivateVideo o useDeactivateVideo
    console.log(toggleDialog.isActive ? 'Desactivando...' : 'Activando...', toggleDialog.id)
    setToggleDialog(null)
  }

  const handleConfirmDelete = () => {
    if (!deleteDialog) return
    // TODO: Llamar a tu mutación useDeleteVideo
    console.log('Eliminando...', deleteDialog.id)
    setDeleteDialog(null)
  }

  return (
    <div className="space-y-6">
      {/* CABECERA */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex flex-col space-y-1.5">
          <h2 className="text-foreground text-2xl font-bold tracking-tight">
            Biblioteca de Videos
          </h2>
          <p className="text-muted-foreground">Gestiona y visualiza el catálogo de contenidos</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => {
              setSelectedVideo(null)
              setFormOpen(true)
            }}
          >
            <Upload className="mr-2 h-4 w-4" /> Subir Video
          </Button>
        </div>
      </div>

      {/* BARRA DE FILTROS */}
      <div className="border-border/50 flex flex-col items-start justify-between gap-4 border-b py-4 md:flex-row md:items-center">
        <div className="flex w-full flex-1 flex-col items-start gap-3 md:w-auto md:flex-row md:items-center">
          <div className="relative w-full md:w-[320px]">
            <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
            <Input
              placeholder="Buscar videos..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full md:w-[150px]">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Activo</SelectItem>
                <SelectItem value="inactive">Inactivo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full md:w-[150px]">
            <Select value={extensionFilter} onValueChange={setExtensionFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Extensión" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="mp4">MP4</SelectItem>
                <SelectItem value="mov">MOV</SelectItem>
                <SelectItem value="mkv">MKV</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button
          variant="ghost"
          onClick={handleClearFilters}
          className="text-muted-foreground w-full md:w-auto"
        >
          Limpiar Filtros
        </Button>
      </div>

      {/* GRID LAYOUT DE VIDEOS */}
      <div className="grid grid-cols-1 gap-6 pb-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredVideos.map((video) => (
          <VideoCard
            key={video.id}
            video={video}
            onEdit={handleEdit}
            onToggleStatus={setToggleDialog}
            onDelete={setDeleteDialog}
            onPlay={(v) => console.log('Reproducir:', v.id)}
          />
        ))}

        {filteredVideos.length === 0 && (
          <div className="text-muted-foreground bg-muted/20 col-span-full rounded-lg border border-dashed py-12 text-center">
            No se encontraron videos con los filtros aplicados.
          </div>
        )}
      </div>

      {/* DIÁLOGOS DE CONFIRMACIÓN (Consistentes con el resto de la app) */}
      <ConfirmDialog
        open={!!toggleDialog}
        onOpenChange={(open) => !open && setToggleDialog(null)}
        title={toggleDialog ? `¿${toggleDialog.isActive ? 'Desactivar' : 'Activar'} el video?` : ''}
        description={
          toggleDialog?.isActive
            ? `Al desactivar "${toggleDialog.name}", dejará de reproducirse en las sucursales asignadas.`
            : `Al activar "${toggleDialog?.name}", estará disponible para su reproducción.`
        }
        onConfirm={handleConfirmToggle}
        confirmLabel={toggleDialog?.isActive ? 'Desactivar' : 'Activar'}
        variant={toggleDialog?.isActive ? 'destructive' : 'default'}
      />

      <ConfirmDialog
        open={!!deleteDialog}
        onOpenChange={(open) => !open && setDeleteDialog(null)}
        title="Eliminar video"
        description={`¿Estás seguro de eliminar "${deleteDialog?.name ?? ''}"? Esta acción no se puede deshacer y el archivo se borrará del servidor.`}
        onConfirm={handleConfirmDelete}
        confirmLabel="Eliminar"
        variant="destructive"
      />

      {/* TODO: Aquí iría tu <VideoForm open={formOpen} ... /> */}
    </div>
  )
}
