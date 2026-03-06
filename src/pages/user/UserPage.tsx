import { UserForm, UserTable } from '@/components/features/usuario'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { PageHeader } from '@/components/shared/PageHeader'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  useActivateUser,
  useCreateCompanyAdmin,
  useDeactivateUser,
  useDeleteUser,
  useUpdateUser,
  useUsers,
} from '@/hooks/queries/useUser'
import type { CreateCompanyAdminFormData } from '@/schemas/user.schema'
import type { UserResponse } from '@/types/user.types'
import { Plus } from 'lucide-react'
import { useState } from 'react'

export function UsersPage() {
  const { data: users = [], isLoading } = useUsers()
  const createUser = useCreateCompanyAdmin()
  const updateUser = useUpdateUser()
  const deleteUser = useDeleteUser()
  const activateUser = useActivateUser()
  const deactivateUser = useDeactivateUser()
  const [formOpen, setFormOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null)
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

  const handleFormSubmit = (data: CreateCompanyAdminFormData) => {
    if (selectedUser) {
      updateUser.mutate({ id: selectedUser.id, data }, { onSuccess: () => setFormOpen(false) })
    } else {
      createUser.mutate(data, { onSuccess: () => setFormOpen(false) })
    }
  }

  const handleToggleActive = (user: UserResponse) => {
    if (user.isActive) {
      deactivateUser.mutate(user.id)
    } else {
      activateUser.mutate(user.id)
    }
  }

  const handleConfirmDelete = () => {
    if (deleteDialog) {
      deleteUser.mutate(deleteDialog.id, {
        onSuccess: () => setDeleteDialog(null),
      })
    }
  }

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
        onEdit={handleEdit}
        onResetPassword={() => {}} // TODO: implementar modal de reset
        onToggleActive={handleToggleActive}
        onDelete={(user) => setDeleteDialog(user)}
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
      />

      <UserForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleFormSubmit}
        user={selectedUser}
        isLoading={createUser.isPending || updateUser.isPending}
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
