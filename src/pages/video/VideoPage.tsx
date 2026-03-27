import { toUploadVideo } from '@/adapters/video.adapter'
import { VideoCard } from '@/components/features/video/VideoCard'
import { VideoForm } from '@/components/features/video/VideoForm'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { PageHeader } from '@/components/shared/PageHeader'
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
import { useCurrentUser } from '@/hooks/queries/useUser'
import { useUpdateVideo, useUploadVideo, useVideoUploadConstraints } from '@/hooks/queries/useVideo'
import { useBreadcrumbStore } from '@/stores/breadcrumb.store'
import type { VideoResponse } from '@/types/video.types'
import { Search, Upload, X } from 'lucide-react'
import { useEffect, useState } from 'react'

// --- Mock Data ---
const MOCK_VIDEOS: VideoResponse[] = [
  {
    id: 1,
    companyId: 1,
    companyName: 'Empresa Demo',
    name: 'Introducción a la Plataforma',
    fileExtension: 'mp4',
    duration: 320,
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
    duration: 765,
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
    duration: 90,
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
  const { data: currentUserProfile } = useCurrentUser()
  const { data: constraints } = useVideoUploadConstraints()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [extensionFilter, setExtensionFilter] = useState('all')
  const [formOpen, setFormOpen] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<VideoResponse | null>(null)
  const [toggleDialog, setToggleDialog] = useState<VideoResponse | null>(null)
  const [deleteDialog, setDeleteDialog] = useState<VideoResponse | null>(null)
  const currentUserCompanyId = currentUserProfile?.assignment?.companyId
  const uploadVideo = useUploadVideo()
  const updateVideo = useUpdateVideo()

  useEffect(() => {
    setCustomBreadcrumbs([{ label: 'Videos', path: ROUTES.COMPANY_ADMINISTRATOR.VIDEO }])
    return () => setCustomBreadcrumbs(null)
  }, [setCustomBreadcrumbs])

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

  const isFiltered = searchTerm.length > 0 || statusFilter !== 'all' || extensionFilter !== 'all'

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
    console.log(toggleDialog.isActive ? 'Desactivando...' : 'Activando...', toggleDialog.id)
    setToggleDialog(null)
  }

  const handleConfirmDelete = () => {
    if (!deleteDialog) return
    console.log('Eliminando...', deleteDialog.id)
    setDeleteDialog(null)
  }

  return (
    <div className="space-y-6">
      {/* CABECERA ESTANDARIZADA */}
      <PageHeader
        title="Biblioteca de Videos"
        description="Gestiona y visualiza el catálogo de contenidos"
        actions={
          <Button
            onClick={() => {
              setSelectedVideo(null)
              setFormOpen(true)
            }}
          >
            <Upload className="mr-2 h-4 w-4" />
            Subir Video
          </Button>
        }
      />

      {/* BARRA DE FILTROS ESTILO SHADCN DATATABLE */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="relative max-w-sm flex-1">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder="Buscar videos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="active">Activo</SelectItem>
              <SelectItem value="inactive">Inactivo</SelectItem>
            </SelectContent>
          </Select>

          <Select value={extensionFilter} onValueChange={setExtensionFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Extensión" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="mp4">MP4</SelectItem>
              <SelectItem value="mov">MOV</SelectItem>
              <SelectItem value="mkv">MKV</SelectItem>
            </SelectContent>
          </Select>

          {isFiltered && (
            <Button
              variant="ghost"
              onClick={handleClearFilters}
              className="text-muted-foreground h-8 px-2 lg:px-3"
            >
              Limpiar
              <X className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
          <div className="text-muted-foreground col-span-full rounded-lg border border-dashed py-12 text-center">
            No se encontraron videos con los filtros aplicados.
          </div>
        )}
      </div>

      <VideoForm
        open={formOpen}
        onOpenChange={setFormOpen}
        video={selectedVideo}
        constraints={constraints}
        isLoading={uploadVideo.isPending || updateVideo.isPending}
        onSubmit={(data) => {
          if (selectedVideo) {
            updateVideo.mutate(
              { id: selectedVideo.id, data: { name: data.name } },
              { onSuccess: () => setFormOpen(false) },
            )
          } else {
            const formData = toUploadVideo(data, currentUserCompanyId!)
            uploadVideo.mutate(formData, { onSuccess: () => setFormOpen(false) })
          }
        }}
      />

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
    </div>
  )
}
