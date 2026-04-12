import { userService } from '@/services/user.service'
import type {
  ChangePasswordRequest,
  CreateBranchAdminRequest,
  CreateCompanyAdminRequest,
  UpdateUserRequest,
} from '@/types/user.types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useAuth } from '../useAuth'
import { BRANCH_DETAIL_KEY } from './useBranch'
import { COMPANY_DETAIL_KEY } from './useCompany'

interface UserQueryParams {
  companyId?: number
  branchId?: number
}

export const USERS_KEYS = ['users']
export const CURRENT_USER_KEY = 'currentUser'

export function useUsers(roleId?: number) {
  return useQuery({
    queryKey: roleId ? [...USERS_KEYS, roleId] : USERS_KEYS,
    queryFn: () => userService.findAll(roleId),
  })
}

export function useCurrentUser() {
  const { user } = useAuth()

  return useQuery({
    queryKey: [CURRENT_USER_KEY, user?.id],
    queryFn: () => userService.findById(user!.id),
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 60,
  })
}

export function useCreateCompanyAdmin(companyId?: number) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ data }: { data: CreateCompanyAdminRequest }) =>
      userService.createCompanyAdmin(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: USERS_KEYS })
      toast.success('Usuario creado exitosamente')

      if (companyId) {
        qc.invalidateQueries({ queryKey: [COMPANY_DETAIL_KEY, companyId] })
      }
    },
    onError: () => toast.error('Error al crear usuario'),
  })
}

export function useCreateBranchAdmin(branchId?: number) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ data }: { data: CreateBranchAdminRequest }) =>
      userService.createBranchAdmin(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: USERS_KEYS })
      toast.success('Usuario creado exitosamente')

      if (branchId) {
        qc.invalidateQueries({ queryKey: [BRANCH_DETAIL_KEY, branchId] })
      }
    },
    onError: () => toast.error('Error al crear usuario'),
  })
}

export function useUpdateUser(options: UserQueryParams = {}) {
  const qc = useQueryClient()
  const { companyId, branchId } = options

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateUserRequest }) =>
      userService.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: USERS_KEYS })
      toast.success('Usuario actualizado')

      if (companyId) {
        qc.invalidateQueries({ queryKey: [COMPANY_DETAIL_KEY, companyId] })
      }

      if (branchId) {
        qc.invalidateQueries({ queryKey: [BRANCH_DETAIL_KEY, branchId] })
      }
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

export function useActivateUser(options: UserQueryParams = {}) {
  const qc = useQueryClient()
  const { companyId, branchId } = options

  return useMutation({
    mutationFn: userService.activate,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: USERS_KEYS })
      toast.success('Usuario activado correctamente')

      if (companyId) qc.invalidateQueries({ queryKey: [COMPANY_DETAIL_KEY, companyId] })
      if (branchId) qc.invalidateQueries({ queryKey: [BRANCH_DETAIL_KEY, branchId] })
    },
    onError: () => toast.error('Error al activar el usuario'),
  })
}

export function useDeactivateUser(options: UserQueryParams = {}) {
  const qc = useQueryClient()
  const { companyId, branchId } = options

  return useMutation({
    mutationFn: userService.deactivate,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: USERS_KEYS })
      toast.success('Usuario desactivado correctamente')

      if (companyId) qc.invalidateQueries({ queryKey: [COMPANY_DETAIL_KEY, companyId] })
      if (branchId) qc.invalidateQueries({ queryKey: [BRANCH_DETAIL_KEY, branchId] })
    },
    onError: () => toast.error('Error al desactivar el usuario'),
  })
}

export function useReassignCompany() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, companyId }: { userId: number; companyId: number }) =>
      userService.reassignCompany(userId, companyId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: USERS_KEYS })
      toast.success('Empresa reasignada exitosamente')
    },
    onError: () => toast.error('Error al reasignar la empresa'),
  })
}

export function useReassignBranch() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, branchId }: { userId: number; branchId: number }) =>
      userService.reassignBranch(userId, branchId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: USERS_KEYS })
      toast.success('Sucursal reasignada exitosamente')
    },
    onError: () => toast.error('Error al reasignar la sucursal'),
  })
}

export function useResetPassword() {
  return useMutation({
    mutationFn: ({ id }: { id: number }) => userService.resetPassword(id),
    onSuccess: () => toast.success('Contraseña reseteada correctamente'),
    onError: () => toast.error('Error al resetear la contraseña'),
  })
}

export function useChangePassword() {
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ChangePasswordRequest }) =>
      userService.changePassword(id, data),
    onSuccess: () => toast.success('Contraseña actualizada correctamente'),
    onError: () => toast.error('Error al actualizar la contraseña'),
  })
}
