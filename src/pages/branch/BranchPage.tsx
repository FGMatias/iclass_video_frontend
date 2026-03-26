import { toCreateBranch, toUpdateBranch } from '@/adapters/branch.adapter'
import { BranchForm, BranchTable } from '@/components/features/branch'
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
  useActivateBranch,
  useBranches,
  useCreateBranch,
  useDeactivateBranch,
  useDeleteBranch,
  useUpdateBranch,
} from '@/hooks/queries/useBranch'
import { useCurrentUser } from '@/hooks/queries/useUser'
import { buildRoute } from '@/lib/route-builder'
import { type CreateBranchFormData, type UpdateBranchFormData } from '@/schemas/branch.schema'
import type { BranchResponse } from '@/types/branch.types'
import { Eye, Pencil, Plus, ShieldCheck, ShieldOff, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function BranchPage() {
  const navigate = useNavigate()
  const { data: currentUserProfile } = useCurrentUser()
  const companyId = currentUserProfile?.assignment?.companyId
  const { data: branches = [], isLoading } = useBranches(companyId)
  const createBranch = useCreateBranch()
  const updateBranch = useUpdateBranch()
  const deleteBranch = useDeleteBranch()
  const activateBranch = useActivateBranch()
  const deactivateBranch = useDeactivateBranch()
  const [formOpen, setFormOpen] = useState(false)
  const [selectedBranch, setSelectedBranch] = useState<BranchResponse | null>(null)
  const [toggleBranchDialog, setToggleBranchDialog] = useState<BranchResponse | null>(null)
  const [deleteDialog, setDeleteDialog] = useState<BranchResponse | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filteredBranches =
    statusFilter === 'all'
      ? branches
      : branches.filter((branch) =>
          statusFilter === 'active' ? branch.isActive : !branch.isActive,
        )

  const handleCreate = () => {
    setSelectedBranch(null)
    setFormOpen(true)
  }

  const handleEdit = (branch: BranchResponse) => {
    setSelectedBranch(branch)
    setFormOpen(true)
  }

  const handleFormSubmit = (data: CreateBranchFormData | UpdateBranchFormData) => {
    if (selectedBranch) {
      const payload = toUpdateBranch(data as UpdateBranchFormData, selectedBranch)
      updateBranch.mutate(
        { id: selectedBranch.id, data: payload },
        { onSuccess: () => setFormOpen(false) },
      )
      return
    }

    if (!companyId) {
      console.error('El usuario no tiene un companyId asignado')
      return
    }

    const payload = toCreateBranch(data as CreateBranchFormData, companyId)
    createBranch.mutate({ data: payload }, { onSuccess: () => setFormOpen(false) })
  }

  const handleConfirmToggle = () => {
    if (!toggleBranchDialog) return

    if (toggleBranchDialog.isActive) {
      deactivateBranch.mutate(
        { id: toggleBranchDialog.id },
        { onSuccess: () => setToggleBranchDialog(null) },
      )
    } else {
      activateBranch.mutate(
        { id: toggleBranchDialog.id },
        { onSuccess: () => setToggleBranchDialog(null) },
      )
    }
  }

  const handleConfirmDelete = () => {
    if (!deleteDialog) return

    deleteBranch.mutate({ id: deleteDialog.id }, { onSuccess: () => setDeleteDialog(null) })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gestión de Sucursales"
        description="Administra las sedes y su información"
        actions={
          <div className="flex items-center gap-2">
            <Button onClick={handleCreate}>
              <Plus className="mr-2 size-4" />
              Nueva Sucursal
            </Button>
          </div>
        }
      />

      <BranchTable
        data={filteredBranches}
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
        renderActions={(branch) => (
          <>
            <DropdownMenuItem
              onClick={() =>
                navigate(
                  buildRoute(ROUTES.COMPANY_ADMINISTRATOR.BRANCH_DETAIL, { branchId: branch.id }),
                )
              }
            >
              <Eye className="mr-2 size-4" />
              Ver Detalle
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleEdit(branch)}>
              <Pencil className="mr-2 size-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setToggleBranchDialog(branch)}>
              {branch.isActive ? (
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
            <DropdownMenuItem onClick={() => setDeleteDialog(branch)} className="text-destructive">
              <Trash2 className="mr-2 size-4" />
              Eliminar
            </DropdownMenuItem>
          </>
        )}
      />

      <BranchForm
        open={formOpen}
        onOpenChange={setFormOpen}
        branch={selectedBranch}
        onSubmit={handleFormSubmit}
        isLoading={createBranch.isPending || updateBranch.isPending}
      />

      <ConfirmDialog
        open={!!toggleBranchDialog}
        onOpenChange={(open) => !open && setToggleBranchDialog(null)}
        title={
          toggleBranchDialog
            ? `¿${toggleBranchDialog.isActive ? 'Desactivar' : 'Activar'} a ${toggleBranchDialog.name}`
            : ''
        }
        description={
          toggleBranchDialog
            ? toggleBranchDialog.isActive
              ? `Al desactivar a ${toggleBranchDialog.name}, sus administradores no podrán acceder al sistema`
              : `Al activar a ${toggleBranchDialog.name}, recuperarán el acceso al sistema`
            : ''
        }
        onConfirm={handleConfirmToggle}
        confirmLabel={toggleBranchDialog?.isActive ? 'Desactivar' : 'Activar'}
        variant={toggleBranchDialog?.isActive ? 'destructive' : 'default'}
        loading={activateBranch.isPending || deactivateBranch.isPending}
      />

      <ConfirmDialog
        open={!!deleteDialog}
        onOpenChange={(open) => !open && setDeleteDialog(null)}
        title="Eliminar Sucursal"
        description={`¿Estás seguro de eliminar a ${deleteDialog?.name ?? ''}? Esta acción no se puede deshacer.`}
        onConfirm={handleConfirmDelete}
        confirmLabel="Eliminar"
        variant="destructive"
        loading={deleteBranch.isPending}
      />
    </div>
  )
}
