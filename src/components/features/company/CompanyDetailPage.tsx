import { toCreateBranch, toUpdateBranch } from '@/adapters/branch.adapter'
import { toUpdateCompany } from '@/adapters/company.adapter'
import { toCreateCompanyAdmin, toUpdateUser } from '@/adapters/user.adapter'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { ROUTES } from '@/constants/routes'
import {
  useActivateBranch,
  useCreateBranch,
  useDeactivateBranch,
  useUpdateBranch,
} from '@/hooks/queries/useBranch'
import { useDetailCompany, useUpdateCompany } from '@/hooks/queries/useCompany'
import {
  useActivateUser,
  useCreateCompanyAdmin,
  useDeactivateUser,
  useResetPassword,
  useUpdateUser,
} from '@/hooks/queries/useUser'
import { getInitials } from '@/lib/utils'
import type { CreateBranchFormData, UpdateBranchFormData } from '@/schemas/branch.schema'
import type { UpdateCompanyFormData } from '@/schemas/company.schema'
import {
  createCompanyAdminSchema,
  updateUserSchema,
  type CreateCompanyAdminFormData,
  type UpdateUserFormData,
} from '@/schemas/user.schema'
import { useBreadcrumbStore } from '@/stores/breadcrumb.store'
import type { BranchResponse } from '@/types/branch.types'
import type { CompanyResponse } from '@/types/company.types'
import type { UserResponse } from '@/types/user.types'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { ArrowLeft, KeyRound, Loader2, Pencil, Plus, ShieldCheck, ShieldOff } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { BranchForm } from '../branch/BranchForm'
import { BranchTable } from '../branch/BranchTable'
import { UserForm, UserTable } from '../user'
import { CompanyForm } from './CompanyForm'

export function CompanyDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const companyId = id ? parseInt(id, 10) : undefined
  const { data: company, isLoading, isError } = useDetailCompany(companyId)
  const [companyFormOpen, setCompanyFormOpen] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState<CompanyResponse | null>(null)
  const [adminFormOpen, setAdminFormOpen] = useState(false)
  const [selectedAdmin, setSelectedAdmin] = useState<UserResponse | null>(null)
  const [toggleUserDialog, setToggleUserDialog] = useState<UserResponse | null>(null)
  const [resetPasswordDialog, setResetPasswordDialog] = useState<UserResponse | null>(null)
  const [branchFormOpen, setBranchFormOpen] = useState(false)
  const [selectedBranch, setSelectedBranch] = useState<BranchResponse | null>(null)
  const [toggleBranchDialog, setToggleBranchDialog] = useState<BranchResponse | null>(null)
  const updateCompany = useUpdateCompany()
  const createUser = useCreateCompanyAdmin(companyId)
  const updateUser = useUpdateUser({ companyId })
  const resetPassword = useResetPassword()
  const activateUser = useActivateUser({ companyId })
  const deactivateUser = useDeactivateUser({ companyId })
  const createBranch = useCreateBranch(companyId)
  const updateBranch = useUpdateBranch(companyId)
  const activateBranch = useActivateBranch()
  const deactivateBranch = useDeactivateBranch()
  const setCustomBreadcrumbs = useBreadcrumbStore((state) => state.setCustomBreadcrumbs)

  useEffect(() => {
    if (company?.name) {
      setCustomBreadcrumbs([
        { label: 'Empresa', path: ROUTES.ADMINISTRATOR.COMPANY },
        { label: company.name },
      ])
    }

    return () => setCustomBreadcrumbs(null)
  }, [company?.name, setCustomBreadcrumbs])

  const handleEditCompany = (company: CompanyResponse) => {
    setSelectedCompany(company)
    setCompanyFormOpen(true)
  }

  const handleEditAdmin = (admin: UserResponse) => {
    setSelectedAdmin(admin)
    setAdminFormOpen(true)
  }

  const handleEditBranch = (branch: BranchResponse) => {
    setSelectedBranch(branch)
    setBranchFormOpen(true)
  }

  const handleCompanyFormSubmit = (data: UpdateCompanyFormData) => {
    if (selectedCompany) {
      const payload = toUpdateCompany(data as UpdateCompanyFormData, selectedCompany)
      updateCompany.mutate(
        { id: selectedCompany.id, data: payload },
        { onSuccess: () => setCompanyFormOpen(false) },
      )
    }
  }

  const handleAdminFormSubmit = (data: CreateCompanyAdminFormData | UpdateUserFormData) => {
    if (selectedAdmin) {
      const payload = toUpdateUser(data as UpdateUserFormData, selectedAdmin)
      updateUser.mutate(
        { id: selectedAdmin.id, data: payload },
        { onSuccess: () => setAdminFormOpen(false) },
      )
      return
    }

    const payload = toCreateCompanyAdmin(data as CreateCompanyAdminFormData, companyId!)
    createUser.mutate(
      { data: payload },
      {
        onSuccess: () => setAdminFormOpen(false),
      },
    )
  }

  const handleResetPassword = () => {
    if (!resetPasswordDialog) return

    resetPassword.mutate(
      { id: resetPasswordDialog.id },
      { onSuccess: () => setResetPasswordDialog(null) },
    )
  }

  const handleConfirmToggleUser = () => {
    if (!toggleUserDialog) return

    if (toggleUserDialog.isActive) {
      deactivateUser.mutate(toggleUserDialog.id, { onSuccess: () => setToggleUserDialog(null) })
    } else {
      activateUser.mutate(toggleUserDialog.id, { onSuccess: () => setToggleUserDialog(null) })
    }
  }

  const handleBranchFormSubmit = (data: CreateBranchFormData | UpdateBranchFormData) => {
    if (selectedBranch) {
      const payload = toUpdateBranch(data as UpdateBranchFormData, selectedBranch)
      updateBranch.mutate(
        { id: selectedBranch.id, data: payload },
        { onSuccess: () => setBranchFormOpen(false) },
      )
      return
    }

    const payload = toCreateBranch(data as CreateBranchFormData, companyId!)
    createBranch.mutate({ data: payload }, { onSuccess: () => setBranchFormOpen(false) })
  }

  const handleConfirmToggleBranch = () => {
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

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="text-primary size-8 animate-spin" />
      </div>
    )
  }

  if (isError || !company) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center space-y-4">
        <p className="text-muted-foreground">Error al cargar los detalles de la empresa.</p>
        <Button onClick={() => navigate(ROUTES.ADMINISTRATOR.COMPANY)}>Volver a Empresas</Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(ROUTES.ADMINISTRATOR.COMPANY)}
          >
            <ArrowLeft className="size-4" />
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Detalle de Empresa</h1>
        </div>
        <Button onClick={() => handleEditCompany(company)} variant="outline">
          <Pencil className="mr-2 size-4" />
          Editar Empresa
        </Button>
      </div>

      <Card className="bg-card/50">
        <CardContent className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center">
          <Avatar className="bg-secondary/50 size-24 rounded-lg">
            <AvatarFallback className="bg-transparent text-2xl font-semibold">
              {getInitials(company.name)}
            </AvatarFallback>
          </Avatar>

          <div className="grid flex-1 grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 md:grid-cols-4">
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm font-medium">Nombre Comercial</p>
              <p className="font-semibold">{company.name}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm font-medium">RUC</p>
              <p className="font-semibold">{company.ruc || '-'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm font-medium">Teléfono</p>
              <p className="font-semibold">{company.phone || '-'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm font-medium">Correo Electrónico</p>
              <p className="font-semibold">{company.email || '-'}</p>
            </div>
            <div className="space-y-1 sm:col-span-2">
              <p className="text-muted-foreground text-sm font-medium">Dirección Fiscal</p>
              <p className="font-semibold">{company.direction || '-'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm font-medium">Estado</p>
              <div>
                <StatusBadge isActive={company.isActive} />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm font-medium">Fecha de Registro</p>
              <p className="font-semibold">
                {company.createdAt
                  ? format(new Date(company.createdAt), 'dd MMM yyyy', { locale: es })
                  : '-'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Administradores</h2>
            <p className="text-muted-foreground text-sm">
              Usuarios con permisos administrativos para esta empresa.
            </p>
          </div>
          <Button
            onClick={() => {
              setSelectedAdmin(null)
              setAdminFormOpen(true)
            }}
          >
            <Plus className="mr-2 size-4" />
            Nuevo Administrador
          </Button>
        </div>

        <UserTable
          data={company.administrators || []}
          isLoading={false}
          showRoleColumn={false}
          renderActions={(admin) => (
            <>
              <DropdownMenuItem onClick={() => handleEditAdmin(admin)}>
                <Pencil className="mr-2 size-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setResetPasswordDialog(admin)}>
                <KeyRound className="mr-2 size-4" />
                Resetear Contraseña
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setToggleUserDialog(admin)}>
                {admin.isActive ? (
                  <>
                    <ShieldOff className="text-destructive mr-2 size-4" />
                    <span className="text-destructive">Desactivar</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="mr-2 size-4" />
                    Activar
                  </>
                )}
              </DropdownMenuItem>
            </>
          )}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Sucursales</h2>
            <p className="text-muted-foreground text-sm">Gestión de sedes y puntos de atención.</p>
          </div>
          <Button
            onClick={() => {
              setSelectedBranch(null)
              setBranchFormOpen(true)
            }}
          >
            <Plus className="mr-2 size-4" />
            Nueva Sucursal
          </Button>
        </div>

        <BranchTable
          data={company.branches || []}
          isLoading={false}
          renderActions={(branch) => (
            <>
              <DropdownMenuItem onClick={() => handleEditBranch(branch)}>
                <Pencil className="mr-2 size-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setToggleBranchDialog(branch)}>
                {branch.isActive ? (
                  <>
                    <ShieldOff className="text-destructive mr-2 size-4" />
                    <span className="text-destructive">Desactivar</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="mr-2 size-4" />
                    Activar
                  </>
                )}
              </DropdownMenuItem>
            </>
          )}
        />
      </div>

      <CompanyForm
        open={companyFormOpen}
        onOpenChange={setCompanyFormOpen}
        company={selectedCompany}
        onSubmit={handleCompanyFormSubmit}
        isLoading={updateCompany.isPending}
      />

      <UserForm
        open={adminFormOpen}
        onOpenChange={setAdminFormOpen}
        user={selectedAdmin}
        onSubmit={handleAdminFormSubmit}
        isLoading={createUser.isPending || updateUser.isPending}
        fixedCompanyId={companyId}
        showCompanySelect={false}
        showBranchSelect={false}
        schema={selectedAdmin ? updateUserSchema : createCompanyAdminSchema}
      />

      <BranchForm
        open={branchFormOpen}
        onOpenChange={setBranchFormOpen}
        branch={selectedBranch}
        onSubmit={handleBranchFormSubmit}
        isLoading={createBranch.isPending || updateBranch.isPending}
      />

      <ConfirmDialog
        open={!!resetPasswordDialog}
        onOpenChange={(open) => !open && setResetPasswordDialog(null)}
        title="Reestablecer contraseña"
        description={`¿Estás seguro de reestablecer la contraseña de ${resetPasswordDialog?.name ?? ''}? Esta acción no se puede deshacer.`}
        onConfirm={handleResetPassword}
        confirmLabel="Reestablecer"
        variant="destructive"
        loading={resetPassword.isPending}
      />

      <ConfirmDialog
        open={!!toggleUserDialog}
        onOpenChange={(open) => !open && setToggleUserDialog(null)}
        title={
          toggleUserDialog
            ? `¿${toggleUserDialog.isActive ? 'Desactivar' : 'Activar'} a ${toggleUserDialog.name}`
            : ''
        }
        description={
          toggleUserDialog
            ? toggleUserDialog.isActive
              ? `Al desactivar a ${toggleUserDialog.name}, no podrá acceder a la plataforma`
              : `Al activar a ${toggleUserDialog.name}, recuperará el acceso inmediatamente`
            : ''
        }
        onConfirm={handleConfirmToggleUser}
        confirmLabel={toggleUserDialog?.isActive ? 'Desactivar' : 'Activar'}
        variant={toggleUserDialog?.isActive ? 'destructive' : 'default'}
        loading={activateUser.isPending || deactivateUser.isPending}
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
        onConfirm={handleConfirmToggleBranch}
        confirmLabel={toggleBranchDialog?.isActive ? 'Desactivar' : 'Activar'}
        variant={toggleBranchDialog?.isActive ? 'destructive' : 'default'}
        loading={activateBranch.isPending || deactivateBranch.isPending}
      />
    </div>
  )
}
