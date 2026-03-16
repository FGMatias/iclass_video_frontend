import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useCompanies } from '@/hooks/queries/useCompany'
import { cn } from '@/lib/utils'
import { Check, ChevronsUpDown, Search } from 'lucide-react'
import { useState } from 'react'
import { CompanyModal } from './CompanyModal'

interface CompanySelectorProps {
  value?: number
  onChange: (companyId: number) => void
  error?: string
  disabled?: boolean
}

export function CompanySelector({ value, onChange, error, disabled }: CompanySelectorProps) {
  const { data: companies = [] } = useCompanies()
  const [open, setOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const selected = companies.find((c) => c.id === value)

  const handleSelected = (id: number) => {
    onChange(id)
    setOpen(false)
  }

  return (
    <div className="space-y-3">
      <Label>
        Empresa <span className="text-red-500">*</span>
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn(
              'w-full justify-between font-normal',
              !selected && 'text-muted-foreground',
            )}
          >
            <Search className="mr-2 size-4 shrink-0 opacity-50" />
            {selected ? selected.name : 'Buscar empresa...'}
            <ChevronsUpDown className="ml-auto size-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
          <Command>
            <CommandInput placeholder="Buscar empresa..." />
            <CommandList>
              <CommandEmpty>No se encontraron empresas.</CommandEmpty>
              <CommandGroup>
                {companies
                  .filter((c) => c.isActive)
                  .map((c) => (
                    <CommandItem key={c.id} value={c.name} onSelect={() => handleSelected(c.id)}>
                      <Check
                        className={cn('mr-2 size-4', value === c.id ? 'opacity-100' : 'opacity-0')}
                      />
                      {c.name}
                    </CommandItem>
                  ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {error && <p className="text-destructive text-sm">{error}</p>}

      <p className="text-muted-foreground pt-1 text-sm">
        ¿No encuentras la Empresa?{' '}
        <button
          type="button"
          className="text-primary font-medium hover:underline"
          onClick={() => setModalOpen(true)}
        >
          Crear Empresa
        </button>
      </p>

      <CompanyModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSuccess={(id) => {
          onChange(id)
          setModalOpen(false)
        }}
      />
    </div>
  )
}
