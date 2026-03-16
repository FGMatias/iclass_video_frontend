import { toCreateCompany, toUpdateCompany } from '@/adapters/company.adapter'
import { CompanyForm } from '@/components/features/company/CompanyForm'
import { CompanyTable } from '@/components/features/company/CompanyTable'
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
import {
  useActivateCompany,
  useCompanies,
  useCreateCompany,
  useDeactivateCompany,
  useDeleteCompany,
  useUpdateCompany,
} from '@/hooks/queries/useCompany'
import type { CreateCompanyFormData, UpdateCompanyFormData } from '@/schemas/company.schema'
import type { CompanyResponse } from '@/types/company.types'
import { Eye, Pencil, Plus, ShieldCheck, ShieldOff, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function CompanyPage() {
  const navigate = useNavigate()
  const { data: companies = [], isLoading } = useCompanies()
  const createCompany = useCreateCompany()
  const updateCompany = useUpdateCompany()
  const deleteCompany = useDeleteCompany()
  const activateCompany = useActivateCompany()
  const deactivateCompany = useDeactivateCompany()
  const [formOpen, setFormOpen] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState<CompanyResponse | null>(null)
  const [toggleCompanyDialog, setToggleCompanyDialog] = useState<CompanyResponse | null>(null)
  const [deleteDialog, setDeleteDialog] = useState<CompanyResponse | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filteredCompanies =
    statusFilter === 'all'
      ? companies
      : companies.filter((c) => (statusFilter === 'active' ? c.isActive : !c.isActive))

  const handleCreate = () => {
    setSelectedCompany(null)
    setFormOpen(true)
  }

  const handleEdit = (company: CompanyResponse) => {
    setSelectedCompany(company)
    setFormOpen(true)
  }

  const handleFormSubmit = (data: CreateCompanyFormData | UpdateCompanyFormData) => {
    if (selectedCompany) {
      const payload = toUpdateCompany(data as UpdateCompanyFormData, selectedCompany)
      updateCompany.mutate(
        { id: selectedCompany.id, data: payload },
        { onSuccess: () => setFormOpen(false) },
      )
      return
    }

    const payload = toCreateCompany(data as CreateCompanyFormData)
    createCompany.mutate({ data: payload }, { onSuccess: () => setFormOpen(false) })
  }

  const handleConfirmToggle = () => {
    if (!toggleCompanyDialog) return

    if (toggleCompanyDialog.isActive) {
      deactivateCompany.mutate(
        { id: toggleCompanyDialog.id },
        { onSuccess: () => setToggleCompanyDialog(null) },
      )
    } else {
      activateCompany.mutate(
        { id: toggleCompanyDialog.id },
        { onSuccess: () => setToggleCompanyDialog(null) },
      )
    }
  }

  const handleConfirmDelete = () => {
    if (!deleteDialog) return

    deleteCompany.mutate({ id: deleteDialog.id }, { onSuccess: () => setDeleteDialog(null) })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gestión de Empresas"
        description="Administra las empresas y su información"
        actions={
          <div className="flex items-center gap-2">
            <Button onClick={handleCreate}>
              <Plus className="mr-2 size-4" />
              Nueva Empresa
            </Button>
          </div>
        }
      />

      <CompanyTable
        data={filteredCompanies}
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
        renderActions={(company) => (
          <>
            <DropdownMenuItem onClick={() => navigate(`/empresas/${company.id}`)}>
              <Eye className="mr-2 size-4" />
              Ver Detalle
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleEdit(company)}>
              <Pencil className="mr-2 size-4" />
              Editar
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={() => setToggleCompanyDialog(company)}>
              {company.isActive ? (
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

            <DropdownMenuItem onClick={() => setDeleteDialog(company)} className="text-destructive">
              <Trash2 className="mr-2 size-4" />
              Eliminar
            </DropdownMenuItem>
          </>
        )}
      />

      <CompanyForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleFormSubmit}
        company={selectedCompany}
        isLoading={createCompany.isPending || updateCompany.isPending}
      />

      <ConfirmDialog
        open={!!toggleCompanyDialog}
        onOpenChange={(open) => !open && setToggleCompanyDialog(null)}
        title={
          toggleCompanyDialog
            ? `¿${toggleCompanyDialog.isActive ? 'Desactivar' : 'Activar'} a ${toggleCompanyDialog.name}?`
            : ''
        }
        description={
          toggleCompanyDialog
            ? toggleCompanyDialog.isActive
              ? `Al desactivar a ${toggleCompanyDialog.name}, sus administradores y sucursales no podrán acceder al sistema.`
              : `Al activar a ${toggleCompanyDialog.name}, recuperarán el acceso al sistema.`
            : ''
        }
        onConfirm={handleConfirmToggle}
        confirmLabel={toggleCompanyDialog?.isActive ? 'Desactivar' : 'Activar'}
        variant={toggleCompanyDialog?.isActive ? 'destructive' : 'default'}
        loading={activateCompany.isPending || deactivateCompany.isPending}
      />

      <ConfirmDialog
        open={!!deleteDialog}
        onOpenChange={(open) => !open && setDeleteDialog(null)}
        title="Eliminar Empresa"
        description={`¿Estás seguro de eliminar a ${deleteDialog?.name ?? ''}? Esta acción no se puede deshacer.`}
        onConfirm={handleConfirmDelete}
        confirmLabel="Eliminar"
        variant="destructive"
        loading={deleteCompany.isPending}
      />
    </div>
  )
}
