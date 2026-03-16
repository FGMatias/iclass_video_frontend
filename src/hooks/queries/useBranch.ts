import { branchService } from '@/services/branch.service'
import type { CreateBranchRequest, UpdateBranchRequest } from '@/types/branch.types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { COMPANY_DETAIL_KEY } from './useCompany'

export const BRANCHES_KEYS = ['branches']
export const BRANCH_DETAIL_KEY = 'branch-detail'

export function useBranches() {
  return useQuery({ queryKey: BRANCHES_KEYS, queryFn: branchService.findAll })
}

export function useCreateBranch(companyId?: number) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ data }: { data: CreateBranchRequest }) => branchService.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: BRANCHES_KEYS })
      toast.success('Sucursal creada correctamente')

      if (companyId) {
        qc.invalidateQueries({ queryKey: [COMPANY_DETAIL_KEY, companyId] })
      }
    },
    onError: () => toast.error('Error al crear la sucursal'),
  })
}

export function useUpdateBranch(companyId?: number) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateBranchRequest }) =>
      branchService.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: BRANCHES_KEYS })
      toast.success('Sucursal editada correctamente')

      if (companyId) {
        qc.invalidateQueries({ queryKey: [COMPANY_DETAIL_KEY, companyId] })
      }
    },
    onError: () => toast.error('Error al editar la sucursal'),
  })
}

export function useDeleteBranch() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id }: { id: number }) => branchService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: BRANCHES_KEYS })
      toast.success('Sucursal eliminada correctamente')
    },
    onError: () => toast.error('Error al eliminar la sucursal'),
  })
}

export function useActivateBranch() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id }: { id: number }) => branchService.activate(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: BRANCHES_KEYS })
      toast.success('Sucursal activada correctamente')
    },
    onError: () => toast.error('Error al activar la sucursal'),
  })
}

export function useDeactivateBranch() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id }: { id: number }) => branchService.deactivate(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: BRANCHES_KEYS })
      toast.success('Sucursal desactivada correctamente')
    },
    onError: () => toast.error('Error al desactivar la sucursal'),
  })
}
