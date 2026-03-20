import { create } from 'zustand'

export interface BreadcrumbItem {
  label: string
  path?: string
}

interface BreadcrumbStore {
  customBreadcrumbs: BreadcrumbItem[] | null
  setCustomBreadcrumbs: (breadcrumbs: BreadcrumbItem[] | null) => void
}

export const useBreadcrumbStore = create<BreadcrumbStore>((set) => ({
  customBreadcrumbs: null,
  setCustomBreadcrumbs: (breadcrumbs) => set({ customBreadcrumbs: breadcrumbs }),
}))
