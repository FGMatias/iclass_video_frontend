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
import { useBranches } from '@/hooks/queries/useBranch'
import { cn } from '@/lib/utils'
import { Check, ChevronsUpDown, Search } from 'lucide-react'
import { useState } from 'react'
import { BranchModal } from './BranchModal'

interface BranchSelectorProps {
  value?: number
  onChange: (companyId: number) => void
  error?: string
  disabled?: boolean
  companyId?: number
}

export function BranchSelector({
  value,
  onChange,
  error,
  disabled,
  companyId,
}: BranchSelectorProps) {
  const { data: branches = [] } = useBranches(companyId)
  const [open, setOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const selected = branches.find((b) => b.id === value)

  const handleSelected = (id: number) => {
    onChange(id)
    setOpen(false)
  }

  return (
    <div className="space-y-3">
      <Label>
        Sucursal <span className="text-red-500">*</span>
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
            {selected ? selected.name : 'Buscar sucursal...'}
            <ChevronsUpDown className="ml-auto size-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
          <Command>
            <CommandInput placeholder="Buscar sucursal..." />
            <CommandList>
              <CommandEmpty>No se encontraron sucursales.</CommandEmpty>
              <CommandGroup>
                {branches
                  .filter((b) => b.isActive)
                  .map((b) => (
                    <CommandItem key={b.id} value={b.name} onSelect={() => handleSelected(b.id)}>
                      <Check
                        className={cn('mr-2 size-4', value === b.id ? 'opacity-100' : 'opacity-0')}
                      />
                      {b.name}
                    </CommandItem>
                  ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {error && <p className="text-destructive text-sm">{error}</p>}

      <p className="text-muted-foreground pt-1 text-sm">
        ¿No encuentras la Sucursal?{' '}
        <button
          type="button"
          className="text-primary font-medium hover:underline"
          onClick={() => setModalOpen(true)}
          disabled={!companyId}
        >
          Crear Sucursal
        </button>
      </p>

      {companyId && (
        <BranchModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          companyId={companyId}
          onSuccess={(id) => {
            onChange(id)
            setModalOpen(false)
          }}
        />
      )}
    </div>
  )
}
