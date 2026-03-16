import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useCompanies } from '@/hooks/queries/useCompany'
import { cn } from '@/lib/utils'
import type { UserResponse } from '@/types/user.types'
import { Check, ChevronsUpDown, Loader2, Search } from 'lucide-react'
import { useState } from 'react'

interface ReassignCompanyDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: UserResponse | null
  onConfirm: (userId: number, companyId: number) => void
  loading?: boolean
}

export function ReassignCompanyDialog({
  open,
  onOpenChange,
  user,
  onConfirm,
  loading = false,
}: ReassignCompanyDialogProps) {
  const { data: companies = [] } = useCompanies()
  const [companyOpen, setCompanyOpen] = useState(false)
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null)
  const selectedCompany = companies.find((c) => c.id === selectedCompanyId)
  const currentCompanyId = user?.assignment?.companyId
  const currentCompanyName = user?.assignment?.companyName ?? 'Sin empresa'
  const availableCompanies = companies.filter((c) => c.isActive && c.id !== currentCompanyId)

  const handleConfirm = () => {
    if (user && selectedCompanyId) {
      onConfirm(user.id, selectedCompanyId)
    }
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) setSelectedCompanyId(null)
    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cambiar Empresa</DialogTitle>
          <DialogDescription>
            Reasignar a <span className="text-foreground font-medium">{user?.name}</span> de{' '}
            <span className="text-foreground font-medium">{currentCompanyName}</span> a una nueva
            empresa.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-4">
          <Popover open={companyOpen} onOpenChange={setCompanyOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={companyOpen}
                disabled={loading}
                className={cn(
                  'w-full justify-between font-normal',
                  !selectedCompany && 'text-muted-foreground',
                )}
              >
                <Search className="mr-2 size-4 shrink-0 opacity-50" />
                {selectedCompany ? selectedCompany.name : 'Buscar empresa...'}
                <ChevronsUpDown className="ml-auto size-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
              <Command>
                <CommandInput placeholder="Buscar empresa..." />
                <CommandList>
                  <CommandEmpty>No se encontraron empresas.</CommandEmpty>
                  <CommandGroup>
                    {availableCompanies.map((c) => (
                      <CommandItem
                        key={c.id}
                        value={c.name}
                        onSelect={() => {
                          setSelectedCompanyId(c.id)
                          setCompanyOpen(false)
                        }}
                      >
                        <Check
                          className={cn(
                            'mr-2 size-4',
                            selectedCompanyId === c.id ? 'opacity-100' : 'opacity-0',
                          )}
                        />
                        {c.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={!selectedCompanyId || loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Reasignando...
              </>
            ) : (
              'Confirmar'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
