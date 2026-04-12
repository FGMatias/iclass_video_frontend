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
import { useAreas } from '@/hooks/queries/useArea'
import { cn } from '@/lib/utils'
import { Check, ChevronsUpDown, Search } from 'lucide-react'
import { useState } from 'react'
import { AreaModal } from './AreaModal'

interface AreaSelectorProps {
  value?: number
  onChange: (areaId: number) => void
  error?: string
  disabled?: boolean
  branchId?: number
}

export function AreaSelector({ value, onChange, error, disabled, branchId }: AreaSelectorProps) {
  const { data: areas = [] } = useAreas(branchId)
  const [open, setOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const selected = areas.find((a) => a.id === value)

  const handleSelected = (id: number) => {
    onChange(id)
    setOpen(false)
  }

  return (
    <div className="space-y-3">
      <Label>
        Área <span className="text-red-500">*</span>
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
            {selected ? selected.name : 'Buscar área...'}
            <ChevronsUpDown className="ml-auto size-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
          <Command>
            <CommandInput placeholder="Buscar área..." />
            <CommandList>
              <CommandEmpty>No se encontraron áreas.</CommandEmpty>
              <CommandGroup>
                {areas
                  .filter((a) => a.isActive)
                  .map((a) => (
                    <CommandItem key={a.id} value={a.name} onSelect={() => handleSelected(a.id)}>
                      <Check
                        className={cn('mr-2 size-4', value === a.id ? 'opacity-100' : 'opacity-0')}
                      />
                      {a.name}
                    </CommandItem>
                  ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {error && <p className="text-destructive text-sm">{error}</p>}

      <p className="text-muted-foreground pt-1 text-sm">
        ¿No encuentras el área?{' '}
        <button
          type="button"
          className="text-primary font-medium hover:underline"
          onClick={() => setModalOpen(true)}
          disabled={disabled}
        >
          Crear Área
        </button>
      </p>

      {branchId && (
        <AreaModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          branchId={branchId}
          onSuccess={(id) => {
            onChange(id)
            setModalOpen(false)
          }}
        />
      )}
    </div>
  )
}
