import { toCreateArea, toUpdateArea } from '@/adapters/area.adapter'
import { toUpdateBranch } from '@/adapters/branch.adapter'
import { toCreateBranchAdmin, toUpdateUser } from '@/adapters/user.adapter'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import { ROUTES } from '@/constants/routes'
import {
  useActivateArea,
  useCreateArea,
  useDeactivateArea,
  useUpdateArea,
} from '@/hooks/queries/useArea'
import { useDetailBranch, useUpdateBranch } from '@/hooks/queries/useBranch'
import {
  useActivateUser,
  useCreateBranchAdmin,
  useDeactivateUser,
  useResetPassword,
  useUpdateUser,
} from '@/hooks/queries/useUser'
import { buildRoute } from '@/lib/route-builder'
import type { CreateAreaFormData, UpdateAreaFormData } from '@/schemas/area.schema'
import type { UpdateBranchFormData } from '@/schemas/branch.schema'
import {
  createBranchAdminSchema,
  updateUserSchema,
  type CreateBranchAdminFormData,
  type UpdateUserFormData,
} from '@/schemas/user.schema'
import { useBreadcrumbStore } from '@/stores/breadcrumb.store'
import type { AreaResponse } from '@/types/area.types'
import type { BranchResponse } from '@/types/branch.types'
import type { UserResponse } from '@/types/user.types'
import {
  ArrowLeft,
  Eye,
  KeyRound,
  Layers,
  Loader2,
  MapPin,
  Pencil,
  Phone,
  Plus,
  ShieldCheck,
  ShieldOff,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AreaForm, AreaTable } from '../area'
import { UserForm, UserTable } from '../user'
import { BranchForm } from './BranchForm'

export function BranchDetailPage() {
  const navigate = useNavigate()
  const { branchId: paramBranchId } = useParams<{ branchId: string }>()
  const branchId = paramBranchId ? parseInt(paramBranchId, 10) : undefined
  const { data: branch, isLoading, isError } = useDetailBranch(branchId)
  const [branchFormOpen, setBranchFormOpen] = useState(false)
  const [selectedBranch, setSelectedBranch] = useState<BranchResponse | null>(null)
  const [adminFormOpen, setAdminFormOpen] = useState(false)
  const [selectedAdmin, setSelectedAdmin] = useState<UserResponse | null>(null)
  const [toggleUserDialog, setToggleUserDialog] = useState<UserResponse | null>(null)
  const [resetPasswordDialog, setResetPasswordDialog] = useState<UserResponse | null>(null)
  const [areaFormOpen, setAreaFormOpen] = useState(false)
  const [selectedArea, setSelectedArea] = useState<AreaResponse | null>(null)
  const [toggleAreaDialog, setToggleAreaDialog] = useState<AreaResponse | null>(null)
  const updateBranch = useUpdateBranch()
  const createUser = useCreateBranchAdmin(branchId)
  const updateUser = useUpdateUser({ branchId })
  const resetPassword = useResetPassword()
  const activateUser = useActivateUser({ branchId })
  const deactivateUser = useDeactivateUser({ branchId })
  const createArea = useCreateArea(branchId)
  const updateArea = useUpdateArea(branchId)
  const activateArea = useActivateArea()
  const deactivateArea = useDeactivateArea()
  const setCustomBreadcrumbs = useBreadcrumbStore((state) => state.setCustomBreadcrumbs)

  useEffect(() => {
    if (branch?.name) {
      setCustomBreadcrumbs([
        { label: 'Sucursal', path: ROUTES.COMPANY_ADMINISTRATOR.BRANCH },
        { label: branch.name },
      ])
    }
    return () => setCustomBreadcrumbs(null)
  }, [branch?.name, setCustomBreadcrumbs])

  const handleEditBranch = (branch: BranchResponse) => {
    setSelectedBranch(branch)
    setBranchFormOpen(true)
  }

  const handleEditAdmin = (admin: UserResponse) => {
    setSelectedAdmin(admin)
    setAdminFormOpen(true)
  }

  const handleEditArea = (area: AreaResponse) => {
    setSelectedArea(area)
    setAreaFormOpen(true)
  }

  const handleBranchFormSubmit = (data: UpdateBranchFormData) => {
    if (selectedBranch) {
      const payload = toUpdateBranch(data as UpdateBranchFormData, selectedBranch)
      updateBranch.mutate(
        { id: selectedBranch.id, data: payload },
        { onSuccess: () => setBranchFormOpen(false) },
      )
    }
  }

  const handleAdminFormSubmit = (data: CreateBranchAdminFormData | UpdateUserFormData) => {
    if (selectedAdmin) {
      const payload = toUpdateUser(data as UpdateUserFormData, selectedAdmin)
      updateUser.mutate(
        { id: selectedAdmin.id, data: payload },
        { onSuccess: () => setAdminFormOpen(false) },
      )
      return
    }

    const payload = toCreateBranchAdmin(data as CreateBranchAdminFormData, branchId!)
    createUser.mutate({ data: payload }, { onSuccess: () => setAdminFormOpen(false) })
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

  const handleAreaFormSubmit = (data: CreateAreaFormData | UpdateAreaFormData) => {
    if (selectedArea) {
      const payload = toUpdateArea(data as UpdateAreaFormData, selectedArea)
      updateArea.mutate(
        { id: selectedArea.id, data: payload },
        { onSuccess: () => setAreaFormOpen(false) },
      )
      return
    }
    const payload = toCreateArea(data as CreateAreaFormData, branchId!)
    createArea.mutate({ data: payload }, { onSuccess: () => setAreaFormOpen(false) })
  }

  const handleConfirmToggleArea = () => {
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

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="text-primary size-8 animate-spin" />
      </div>
    )
  }

  if (isError || !branch) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center space-y-4">
        <p className="text-muted-foreground">Error al cargar los detalles de la sucursal.</p>
        <Button onClick={() => navigate(ROUTES.COMPANY_ADMINISTRATOR.BRANCH)}>
          Volver a Sucursales
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(ROUTES.COMPANY_ADMINISTRATOR.BRANCH)}
        >
          <ArrowLeft className="size-4" />
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">{branch.name}</h1>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardContent className="space-y-6 p-6">
            <div className="flex items-center gap-4">
              <div className="bg-secondary flex size-14 items-center justify-center rounded-lg">
                <Layers className="text-primary size-6" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">{branch.name}</h2>
                <p className="text-muted-foreground text-sm">{branch.companyName}</p>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                Dirección
              </p>
              <div className="flex items-start gap-2">
                <MapPin className="text-muted-foreground mt-0.5 size-4 shrink-0" />
                <p className="text-sm">{branch.direction || '-'}</p>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                Contacto
              </p>
              <div className="flex items-center gap-2">
                <Phone className="text-muted-foreground size-4 shrink-0" />
                <p className="text-sm">{branch.phone || '-'}</p>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                Estado
              </p>
              <StatusBadge isActive={branch.isActive} />
            </div>

            <Separator />

            <Button variant="outline" className="w-full" onClick={() => handleEditBranch(branch)}>
              <Pencil className="mr-2 size-4" />
              Editar Información
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">Administradores</h2>
              <p className="text-muted-foreground text-sm">Usuarios asignados a esta sucursal.</p>
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
          </CardHeader>
          <CardContent className="pt-0">
            <UserTable
              data={branch.administrators || []}
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
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Áreas</h2>
            <p className="text-muted-foreground text-sm">Zonas definidas dentro de la sucursal.</p>
          </div>
          <Button
            onClick={() => {
              setSelectedArea(null)
              setAreaFormOpen(true)
            }}
          >
            <Plus className="mr-2 size-4" />
            Nueva Área
          </Button>
        </CardHeader>
        <CardContent className="pt-0">
          <AreaTable
            data={branch.areas || []}
            isLoading={false}
            renderActions={(area) => (
              <>
                <DropdownMenuItem
                  onClick={() =>
                    navigate(
                      buildRoute(ROUTES.COMPANY_ADMINISTRATOR.AREA_DETAIL, {
                        branchId: branch.id,
                        areaId: area.id,
                      }),
                    )
                  }
                >
                  <Eye className="mr-2 size-4" />
                  Ver Detalle
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleEditArea(area)}>
                  <Pencil className="mr-2 size-4" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setToggleAreaDialog(area)}>
                  {area.isActive ? (
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

      <BranchForm
        open={branchFormOpen}
        onOpenChange={setBranchFormOpen}
        branch={branch}
        onSubmit={handleBranchFormSubmit}
        isLoading={updateBranch.isPending}
      />

      <UserForm
        open={adminFormOpen}
        onOpenChange={setAdminFormOpen}
        user={selectedAdmin}
        onSubmit={handleAdminFormSubmit}
        isLoading={createUser.isPending || updateUser.isPending}
        fixedCompanyId={branch.companyId}
        fixedBranchId={branch.id}
        showCompanySelect={false}
        showBranchSelect={false}
        schema={selectedAdmin ? updateUserSchema : createBranchAdminSchema}
      />

      <AreaForm
        open={areaFormOpen}
        onOpenChange={setAreaFormOpen}
        area={selectedArea}
        onSubmit={handleAreaFormSubmit}
        isLoading={createArea.isPending || updateArea.isPending}
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
    </div>
  )
}
