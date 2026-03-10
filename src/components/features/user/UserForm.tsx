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
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { useCompanies } from '@/hooks/queries/useCompany'
import { cn } from '@/lib/utils'
import { createCompanyAdminSchema, type CreateCompanyAdminFormData } from '@/schemas/user.schema'
import type { UserResponse } from '@/types/user.types'
import { zodResolver } from '@hookform/resolvers/zod'
import { Check, ChevronsUpDown, Loader2, Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { CompanyModal } from '../company/CompanyModal'

interface UserFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CreateCompanyAdminFormData) => void
  user?: UserResponse | null
  isLoading?: boolean
}

export function UserForm({ open, onOpenChange, onSubmit, user, isLoading }: UserFormProps) {
  const { data: companies = [] } = useCompanies()
  const isEditing = !!user
  const [companyOpen, setCompanyOpen] = useState(false)
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | undefined>()
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<z.input<typeof createCompanyAdminSchema>, any, CreateCompanyAdminFormData>({
    resolver: zodResolver(createCompanyAdminSchema),
  })

  useEffect(() => {
    if (open && user) {
      reset({
        companyId: undefined,
        username: user.username,
        name: user.name,
        paternalSurname: user.paternalSurname ?? '',
        maternalSurname: user.maternalSurname ?? '',
        documentNumber: user.documentNumber ?? '',
        email: user.email ?? '',
        phone: user.phone ?? '',
      })
      setSelectedCompanyId(undefined)
    } else if (open && !user) {
      reset({
        companyId: undefined,
        username: '',
        name: '',
        paternalSurname: '',
        maternalSurname: '',
        documentNumber: '',
        email: '',
        phone: '',
      })
      setSelectedCompanyId(undefined)
    }
  }, [open, user, reset])

  const handleSelectCompany = (companyId: number) => {
    setSelectedCompanyId(companyId)
    setValue('companyId', companyId)
    setCompanyOpen(false)
  }

  const selectedCompany = companies.find((c) => c.id === selectedCompanyId)

  return (
    <>
      <Drawer open={open} onOpenChange={onOpenChange} direction="right">
        <DrawerContent className="flex h-full w-full flex-col sm:max-w-xl">
          <DrawerHeader className="shrink-0 pb-4 text-left">
            <DrawerTitle>{isEditing ? 'Editar Usuario' : 'Crear Usuario'}</DrawerTitle>
            <DrawerDescription>
              {isEditing
                ? 'Modifica los datos del usuario.'
                : 'Completa la información para registrar un nuevo usuario en la plataforma.'}
            </DrawerDescription>
          </DrawerHeader>

          <div className="no-scrollbar flex-1 overflow-y-auto px-4 sm:px-6">
            <form
              id="user-form"
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6 px-1 pt-2 pb-6"
            >
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="username">
                    Usuario <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="username"
                    placeholder="Ej. juan.perez"
                    disabled={isLoading}
                    {...register('username')}
                  />
                  {errors.username && (
                    <p className="text-destructive text-sm">{errors.username.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Nombre <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="Ej. Juan"
                    disabled={isLoading}
                    {...register('name')}
                  />
                  {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="paternalSurname">Apellido Paterno</Label>
                  <Input
                    id="paternalSurname"
                    placeholder="Ej. Pérez"
                    disabled={isLoading}
                    {...register('paternalSurname')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maternalSurname">Apellido Materno</Label>
                  <Input
                    id="maternalSurname"
                    placeholder="Ej. González"
                    disabled={isLoading}
                    {...register('maternalSurname')}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="documentNumber">Número de documento</Label>
                </div>
                <Input
                  id="documentNumber"
                  placeholder="DNI / Pasaporte"
                  disabled={isLoading}
                  {...register('documentNumber')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Correo</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nombre@ejemplo.com"
                  disabled={isLoading}
                  {...register('email')}
                />
                {errors.email && <p className="text-destructive text-sm">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="phone">Teléfono</Label>
                </div>
                <Input
                  id="phone"
                  placeholder="+51 999 999 999"
                  disabled={isLoading}
                  {...register('phone')}
                />
                {errors.phone && <p className="text-destructive text-sm">{errors.phone.message}</p>}
              </div>

              <div className="pt-2">
                <Separator className="mb-6" />
                <div className="space-y-3">
                  <Label>
                    Empresa <span className="text-red-500">*</span>
                  </Label>
                  <Popover open={companyOpen} onOpenChange={setCompanyOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={companyOpen}
                        disabled={isLoading}
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
                            {companies
                              .filter((c) => c.isActive)
                              .map((c) => (
                                <CommandItem
                                  key={c.id}
                                  value={c.name}
                                  onSelect={() => handleSelectCompany(c.id)}
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
                  {errors.companyId && (
                    <p className="text-destructive text-sm">{errors.companyId.message}</p>
                  )}
                  <p className="text-muted-foreground pt-1 text-sm">
                    ¿No encuentras la Empresa?{' '}
                    <button
                      type="button"
                      className="text-primary font-medium hover:underline"
                      onClick={() => setIsCompanyModalOpen(true)}
                    >
                      Crear Empresa
                    </button>
                  </p>
                </div>
              </div>
            </form>
          </div>

          <DrawerFooter className="shrink-0 flex-row justify-end gap-3 border-t px-4 pt-4 pb-6 sm:px-6">
            <DrawerClose asChild>
              <Button variant="outline" disabled={isLoading}>
                Cancelar
              </Button>
            </DrawerClose>
            <Button type="submit" form="user-form" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Guardando...
                </>
              ) : isEditing ? (
                'Guardar Cambios'
              ) : (
                'Guardar Usuario'
              )}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <CompanyModal
        open={isCompanyModalOpen}
        onOpenChange={setIsCompanyModalOpen}
        onSuccess={(newCompanyId) => handleSelectCompany(newCompanyId)}
      />
    </>
  )
}
