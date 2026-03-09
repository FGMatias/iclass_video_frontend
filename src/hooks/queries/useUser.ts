import { userService } from '@/services/user.service'
import { CreateCompanyAdminRequest, UpdateUserRequest } from '@/types/user.types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

const USERS_KEYS = ['users']

export function useUsers(roleId?: number) {
  return useQuery({
    queryKey: roleId ? [...USERS_KEYS, roleId] : USERS_KEYS,
    queryFn: () => userService.findAll(roleId),
  })
}

export function useCreateCompanyAdmin() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateCompanyAdminRequest) => userService.createCompanyAdmin(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: USERS_KEYS })
      toast.success('Usuario creado exitosamente')
    },
    onError: () => toast.error('Error al crear usuario'),
  })
}

export function useUpdateUser() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateUserRequest }) =>
      userService.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: USERS_KEYS })
      toast.success('Usuario actualizado')
    },
    onError: () => toast.error('Error al actualizar el usuario'),
  })
}

export function useDeleteUser() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: userService.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: USERS_KEYS })
      toast.success('Usuario eliminado correctamente')
    },
    onError: () => toast.error('Error al eliminar usuario'),
  })
}

export function useActivateUser() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: userService.activate,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: USERS_KEYS })
      toast.success('Usuario activado correctamente')
    },
    onError: () => toast.error('Error al activar el usuario'),
  })
}

export function useDeactivateUser() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: userService.deactivate,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: USERS_KEYS })
      toast.success('Usuario desactivado correctamente')
    },
    onError: () => toast.error('Error al desactivar el usuario'),
  })
}

export function useResetPassword() {
  return useMutation({
    mutationFn: ({ id, password }: { id: number; password: string }) =>
      userService.resetPassword(id, password),
    onSuccess: () => toast.success('Contraseña reseteada correctamente'),
    onError: () => toast.error('Error al resetear la contraseña'),
  })
}
