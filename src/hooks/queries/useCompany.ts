import { companyService } from '@/services/company.service'
import type { CreateCompanyRequest, UpdateCompanyRequest } from '@/types/company.types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const COMPANIES_KEYS = ['companies']
export const COMPANY_DETAIL_KEY = 'company-detail'

export function useCompanies() {
  return useQuery({ queryKey: COMPANIES_KEYS, queryFn: companyService.findAll })
}

export function useDetailCompany(id: number | undefined) {
  return useQuery({
    queryKey: [COMPANY_DETAIL_KEY, id],
    queryFn: () => companyService.detail(id!),
    enabled: !!id,
  })
}

export function useCreateCompany() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ data }: { data: CreateCompanyRequest }) => companyService.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: COMPANIES_KEYS })
      toast.success('Empresa creada correctamente')
    },
    onError: () => toast.error('Error al crear la empresa'),
  })
}

export function useUpdateCompany() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCompanyRequest }) =>
      companyService.update(id, data),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: COMPANIES_KEYS })
      qc.invalidateQueries({ queryKey: [COMPANY_DETAIL_KEY, variables.id] })
      toast.success('Empresa editada correctamente')
    },
    onError: () => toast.error('Error al editar la empresa'),
  })
}

export function useDeleteCompany() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id }: { id: number }) => companyService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: COMPANIES_KEYS })
      toast.success('Empresa eliminada correctamente')
    },
    onError: () => toast.error('Error al eliminar la empresa'),
  })
}

export function useActivateCompany() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id }: { id: number }) => companyService.activate(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: COMPANIES_KEYS })
      toast.success('Empresa activada correctamente')
    },
    onError: () => toast.error('Error al activar la empresa'),
  })
}

export function useDeactivateCompany() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id }: { id: number }) => companyService.deactivate(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: COMPANIES_KEYS })
      toast.success('Empresa desactivada correctamente')
    },
    onError: () => toast.error('Error al desactivar la empresa'),
  })
}
