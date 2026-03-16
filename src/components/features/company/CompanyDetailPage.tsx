import { toCreateBranch, toUpdateBranch } from '@/adapters/branch.adapter'
import { toCreateCompanyAdmin, toUpdateUser } from '@/adapters/user.adapter'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { useCreateBranch, useUpdateBranch } from '@/hooks/queries/useBranch'
import { useDetailCompany } from '@/hooks/queries/useCompany'
import { useCreateCompanyAdmin, useUpdateUser } from '@/hooks/queries/useUser'
import { getInitials } from '@/lib/utils'
import type { CreateBranchFormData, UpdateBranchFormData } from '@/schemas/branch.schema'
import {
  createCompanyAdminSchema,
  updateUserSchema,
  type CreateCompanyAdminFormData,
  type UpdateUserFormData,
} from '@/schemas/user.schema'
import type { BranchResponse } from '@/types/branch.types'
import type { UserResponse } from '@/types/user.types'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { ArrowLeft, KeyRound, Loader2, Pencil, Plus, ShieldCheck, ShieldOff } from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { BranchForm } from '../branch/BranchForm'
import { BranchTable } from '../branch/BranchTable'
import { UserForm, UserTable } from '../user'

export function CompanyDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const companyId = id ? parseInt(id, 10) : undefined
  const { data: company, isLoading, isError } = useDetailCompany(companyId)
  const [adminFormOpen, setAdminFormOpen] = useState(false)
  const [selectedAdmin, setSelectedAdmin] = useState<UserResponse | null>(null)
  const [branchFormOpen, setBranchFormOpen] = useState(false)
  const [selectedBranch, setSelectedBranch] = useState<BranchResponse | null>(null)
  const createUser = useCreateCompanyAdmin(companyId)
  const updateUser = useUpdateUser(companyId)
  const createBranch = useCreateBranch(companyId)
  const updateBranch = useUpdateBranch(companyId)

  const handleEditAdmin = (admin: UserResponse) => {
    setSelectedAdmin(admin)
    setAdminFormOpen(true)
  }

  const handleEditBranch = (branch: BranchResponse) => {
    setSelectedBranch(branch)
    setBranchFormOpen(true)
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
        <Button onClick={() => navigate('/empresas')}>Volver a Empresas</Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/empresas')}>
            <ArrowLeft className="size-4" />
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Detalle de Empresa</h1>
        </div>
        <Button variant="outline">
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
              <DropdownMenuItem onClick={() => console.log('Reset Password', admin.id)}>
                <KeyRound className="mr-2 size-4" />
                Resetear Contraseña
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => console.log('Toggle status', admin.id)}>
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
              <DropdownMenuItem onClick={() => console.log('Toggle branch status', branch.id)}>
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
    </div>
  )
}
