import { toCreateArea, toUpdateArea } from '@/adapters/area.adapter'
import { AreaForm, AreaTable } from '@/components/features/area'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { PageHeader } from '@/components/shared/PageHeader'
import { Button } from '@/components/ui/button'
import { DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ROUTES } from '@/constants/routes'
import {
  useActivateArea,
  useAreas,
  useCreateArea,
  useDeactivateArea,
  useDeleteArea,
  useUpdateArea,
} from '@/hooks/queries/useArea'
import { useCurrentUser } from '@/hooks/queries/useUser'
import { buildRoute } from '@/lib/route-builder'
import type { CreateAreaFormData, UpdateAreaFormData } from '@/schemas/area.schema'
import type { AreaResponse } from '@/types/area.types'
import { Eye, Pencil, Plus, ShieldCheck, ShieldOff, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function AreaPage() {
  const navigate = useNavigate()
  const { data: currentUserProfile } = useCurrentUser()
  const branchId = currentUserProfile?.assignment?.branchId ?? undefined
  const { data: areas = [], isLoading } = useAreas(branchId)
  const createArea = useCreateArea(branchId)
  const updateArea = useUpdateArea(branchId)
  const deleteArea = useDeleteArea()
  const activateArea = useActivateArea()
  const deactivateArea = useDeactivateArea()
  const [formOpen, setFormOpen] = useState(false)
  const [selectedArea, setSelectedArea] = useState<AreaResponse | null>(null)
  const [toggleAreaDialog, setToggleAreaDialog] = useState<AreaResponse | null>(null)
  const [deleteDialog, setDeleteDialog] = useState<AreaResponse | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filteredAreas =
    statusFilter === 'all'
      ? areas
      : areas.filter((area) => (statusFilter === 'active' ? area.isActive : !area.isActive))

  const handleCreate = () => {
    setSelectedArea(null)
    setFormOpen(true)
  }

  const handleEdit = (area: AreaResponse) => {
    setSelectedArea(area)
    setFormOpen(true)
  }

  const handleFormSubmit = (data: CreateAreaFormData | UpdateAreaFormData) => {
    if (selectedArea) {
      const payload = toUpdateArea(data as UpdateAreaFormData, selectedArea)
      updateArea.mutate(
        { id: selectedArea.id, data: payload },
        { onSuccess: () => setFormOpen(false) },
      )
      return
    }
    const payload = toCreateArea(data as CreateAreaFormData, branchId!)
    createArea.mutate({ data: payload }, { onSuccess: () => setFormOpen(false) })
  }

  const handleConfirmToggle = () => {
    if (!toggleAreaDialog) return
    if (toggleAreaDialog.isActive) {
      deactivateArea.mutate(
        { id: toggleAreaDialog.id },
        { onSuccess: () => setToggleAreaDialog(null) },
      )
    } else {
      activateArea.mutate(
        { id: toggleAreaDialog.id },
        { onSuccess: () => setToggleAreaDialog(null) },
      )
    }
  }

  const handleConfirmDelete = () => {
    if (!deleteDialog) return

    deleteArea.mutate({ id: deleteDialog.id }, { onSuccess: () => setDeleteDialog(null) })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gestión de Áreas"
        description="Administra las áreas y su información"
        actions={
          <div className="flex items-center gap-2">
            <Button onClick={handleCreate}>
              <Plus className="mr-2 size-4" />
              Nueva Área
            </Button>
          </div>
        }
      />

      <AreaTable
        data={filteredAreas}
        isLoading={isLoading}
        filterSlot={
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
        }
        renderActions={(area) => (
          <>
            <DropdownMenuItem
              onClick={() =>
                navigate(buildRoute(ROUTES.BRANCH_ADMINISTRATOR.AREA_DETAIL, { areaId: area.id }))
              }
            >
              <Eye className="mr-2 size-4" />
              Ver Detalle
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleEdit(area)}>
              <Pencil className="mr-2 size-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setToggleAreaDialog(area)}>
              {area.isActive ? (
                <>
                  <ShieldOff className="mr-2 size-4" /> Desactivar
                </>
              ) : (
                <>
                  <ShieldCheck className="mr-2 size-4" /> Activar
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setDeleteDialog(area)} className="text-destructive">
              <Trash2 className="mr-2 size-4" />
              Eliminar
            </DropdownMenuItem>
          </>
        )}
      />

      <AreaForm
        open={formOpen}
        onOpenChange={setFormOpen}
        area={selectedArea}
        onSubmit={handleFormSubmit}
        isLoading={createArea.isPending || updateArea.isPending}
      />

      <ConfirmDialog
        open={!!toggleAreaDialog}
        onOpenChange={(open) => !open && setToggleAreaDialog(null)}
        title={
          toggleAreaDialog
            ? `¿${toggleAreaDialog.isActive ? 'Desactivar' : 'Activar'} el área ${toggleAreaDialog.name}?`
            : ''
        }
        description={
          toggleAreaDialog
            ? toggleAreaDialog.isActive
              ? `Al desactivar "${toggleAreaDialog.name}", los dispositivos vinculados a esta zona podrían dejar de reproducir la playlist asignada.`
              : `Al activar "${toggleAreaDialog.name}", los dispositivos vinculados reanudarán la reproducción del contenido.`
            : ''
        }
        onConfirm={handleConfirmToggle}
        confirmLabel={toggleAreaDialog?.isActive ? 'Desactivar' : 'Activar'}
        variant={toggleAreaDialog?.isActive ? 'destructive' : 'default'}
        loading={activateArea.isPending || deactivateArea.isPending}
      />

      <ConfirmDialog
        open={!!deleteDialog}
        onOpenChange={(open) => !open && setDeleteDialog(null)}
        title="Eliminar Área"
        description={`¿Estás seguro de eliminar a ${deleteDialog?.name ?? ''}? Esta acción no se puede deshacer.`}
        onConfirm={handleConfirmDelete}
        confirmLabel="Eliminar"
        variant="destructive"
        loading={deleteArea.isPending}
      />
    </div>
  )
}
