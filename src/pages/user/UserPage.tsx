import { toCreateBranchAdmin, toCreateCompanyAdmin, toUpdateUser } from '@/adapters/user.adapter'
import {
  ReassignCompanyDialog,
  UserDetailDialog,
  UserForm,
  UserTable,
} from '@/components/features/user'
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
import { MANAGED_ROLE_BY_USER_ROL, ROLES } from '@/constants/roles'
import {
  useActivateUser,
  useCreateBranchAdmin,
  useCreateCompanyAdmin,
  useDeactivateUser,
  useDeleteUser,
  useReassignCompany,
  useResetPassword,
  useUpdateUser,
  useUsers,
} from '@/hooks/queries/useUser'
import { useAuth } from '@/hooks/useAuth'
import {
  createBranchAdminSchema,
  createCompanyAdminSchema,
  updateUserSchema,
  type CreateBranchAdminFormData,
  type CreateCompanyAdminFormData,
  type UpdateUserFormData,
} from '@/schemas/user.schema'
import type { UserResponse } from '@/types/user.types'
import {
  Building2,
  Eye,
  KeyRound,
  Pencil,
  Plus,
  ShieldCheck,
  ShieldOff,
  Trash2,
} from 'lucide-react'
import { useState } from 'react'

export function UsersPage() {
  const { user } = useAuth()
  const roleFilter = user ? MANAGED_ROLE_BY_USER_ROL[user.roleId] : undefined
  const { data: users = [], isLoading } = useUsers(roleFilter)
  const isSuperAdmin = user?.roleId === ROLES.SUPER_ADMINISTRADOR
  const isCompanyAdmin = user?.roleId === ROLES.ADMINISTRADOR_EMPRESA
  const createCompanyAdmin = useCreateCompanyAdmin()
  const createBranchAdmin = useCreateBranchAdmin()
  const updateUser = useUpdateUser()
  const deleteUser = useDeleteUser()
  const activateUser = useActivateUser()
  const deactivateUser = useDeactivateUser()
  const reassignCompany = useReassignCompany()
  const resetPassword = useResetPassword()
  const [formOpen, setFormOpen] = useState(false)
  const [detailUser, setDetailUser] = useState<UserResponse | null>(null)
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null)
  const [resetPasswordDialog, setResetPasswordDialog] = useState<UserResponse | null>(null)
  const [reassignUser, setReassignUser] = useState<UserResponse | null>(null)
  const [toggleUserDialog, setToggleUserDialog] = useState<UserResponse | null>(null)
  const [deleteDialog, setDeleteDialog] = useState<UserResponse | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filteredUsers =
    statusFilter === 'all'
      ? users
      : users.filter((u) => (statusFilter === 'active' ? u.isActive : !u.isActive))

  const handleCreate = () => {
    setSelectedUser(null)
    setFormOpen(true)
  }

  const handleEdit = (user: UserResponse) => {
    setSelectedUser(user)
    setFormOpen(true)
  }

  const handleFormSubmit = (
    data: CreateCompanyAdminFormData | CreateBranchAdminFormData | UpdateUserFormData,
  ) => {
    if (selectedUser) {
      const payload = toUpdateUser(data as UpdateUserFormData, selectedUser)
      updateUser.mutate(
        { id: selectedUser.id, data: payload },
        { onSuccess: () => setFormOpen(false) },
      )
    }

    if (isSuperAdmin) {
      const formData = data as CreateCompanyAdminFormData
      const payload = toCreateCompanyAdmin(formData, formData.companyId)
      createCompanyAdmin.mutate({ data: payload }, { onSuccess: () => setFormOpen(false) })
    }

    if (isCompanyAdmin) {
      const formData = data as CreateBranchAdminFormData
      const payload = toCreateBranchAdmin(formData, formData.branchId)
      createBranchAdmin.mutate({ data: payload }, { onSuccess: () => setFormOpen(false) })
    }
  }

  const handleConfirmToggle = () => {
    if (!toggleUserDialog) return

    if (toggleUserDialog.isActive) {
      deactivateUser.mutate(toggleUserDialog.id, { onSuccess: () => setToggleUserDialog(null) })
    } else {
      activateUser.mutate(toggleUserDialog.id, { onSuccess: () => setToggleUserDialog(null) })
    }
  }

  const handleConfirmDelete = () => {
    if (!deleteDialog) return

    deleteUser.mutate(deleteDialog.id, {
      onSuccess: () => setDeleteDialog(null),
    })
  }

  const handleReassignCompany = (userId: number, companyId: number) => {
    reassignCompany.mutate({ userId, companyId }, { onSuccess: () => setReassignUser(null) })
  }

  const handleResetPassword = () => {
    if (!resetPasswordDialog) return

    resetPassword.mutate(
      { id: resetPasswordDialog.id },
      { onSuccess: () => setResetPasswordDialog(null) },
    )
  }

  const formSchema = selectedUser
    ? updateUserSchema
    : isSuperAdmin
      ? createCompanyAdminSchema
      : createBranchAdminSchema

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gestión de Usuarios"
        description="Administra usuarios, roles y accesos"
        actions={
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Usuario
          </Button>
        }
      />

      <UserTable
        data={filteredUsers}
        isLoading={isLoading}
        showRoleColumn={true}
        showCompanyColumn={isSuperAdmin}
        showBranchColumn={isCompanyAdmin}
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
        renderActions={(user) => (
          <>
            <DropdownMenuItem onClick={() => setDetailUser(user)}>
              <Eye className="mr-2 size-4" />
              Ver Detalle
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleEdit(user)}>
              <Pencil className="mr-2 size-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setResetPasswordDialog(user)}>
              <KeyRound className="mr-2 size-4" />
              Resetear contraseña
            </DropdownMenuItem>

            {isSuperAdmin && (
              <DropdownMenuItem onClick={() => setReassignUser(user)}>
                <Building2 className="mr-2 size-4" />
                Cambiar Empresa
              </DropdownMenuItem>
            )}

            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setToggleUserDialog(user)}>
              {user.isActive ? (
                <>
                  <ShieldOff className="mr-2 size-4" />
                  Desactivar
                </>
              ) : (
                <>
                  <ShieldCheck className="mr-2 size-4" />
                  Activar
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => setDeleteDialog(user)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 size-4" />
              Eliminar
            </DropdownMenuItem>
          </>
        )}
      />

      <UserDetailDialog
        open={!!detailUser}
        onOpenChange={(open) => !open && setDetailUser(null)}
        user={detailUser}
      />

      <UserForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleFormSubmit}
        user={selectedUser}
        isLoading={createCompanyAdmin.isPending || updateUser.isPending}
        schema={formSchema}
        showCompanySelect={isSuperAdmin}
        showBranchSelect={isCompanyAdmin}
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

      <ReassignCompanyDialog
        open={!!reassignUser}
        onOpenChange={(open) => !open && setReassignUser(null)}
        user={reassignUser}
        onConfirm={handleReassignCompany}
        loading={reassignCompany.isPending}
      />

      <ConfirmDialog
        open={!!toggleUserDialog}
        onOpenChange={(open) => !open && setToggleUserDialog(null)}
        title={
          toggleUserDialog
            ? `¿${toggleUserDialog.isActive ? 'Desactivar' : 'Activar'} a ${toggleUserDialog.name}?`
            : ''
        }
        description={
          toggleUserDialog
            ? toggleUserDialog.isActive
              ? `Al desactivar a ${toggleUserDialog.name}, no podrá acceder a la plataforma`
              : `Al activar a  ${toggleUserDialog.name}, recuperará el acceso inmediatamente`
            : ''
        }
        onConfirm={handleConfirmToggle}
        confirmLabel={toggleUserDialog?.isActive ? 'Desactivar' : 'Activar'}
        variant={toggleUserDialog?.isActive ? 'destructive' : 'default'}
        loading={activateUser.isPending || deactivateUser.isPending}
      />

      <ConfirmDialog
        open={!!deleteDialog}
        onOpenChange={(open) => !open && setDeleteDialog(null)}
        title="Eliminar usuario"
        description={`¿Estás seguro de eliminar a ${deleteDialog?.name ?? ''}? Esta acción no se puede deshacer.`}
        onConfirm={handleConfirmDelete}
        confirmLabel="Eliminar"
        variant="destructive"
        loading={deleteUser.isPending}
      />
    </div>
  )
}
