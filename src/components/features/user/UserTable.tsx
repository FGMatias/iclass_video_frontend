import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { DataTable } from '@/components/shared/DataTable'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ROLE_BADGE_VARIANTS } from '@/constants/roles'
import type { UserResponse } from '@/types/user.types'
import type { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import {
  ArrowUpDown,
  KeyRound,
  MoreHorizontal,
  Pencil,
  ShieldCheck,
  ShieldOff,
  Trash2,
} from 'lucide-react'
import { useMemo, useState } from 'react'

interface UserTableProps {
  data: UserResponse[]
  isLoading: boolean
  onEdit: (user: UserResponse) => void
  onResetPassword: (user: UserResponse) => void
  onToggleActive: (user: UserResponse) => void
  onDelete: (user: UserResponse) => void
  filterSlot?: React.ReactNode
}

export function UserTable({
  data,
  isLoading,
  onEdit,
  onResetPassword,
  onToggleActive,
  onDelete,
  filterSlot,
}: UserTableProps) {
  const [userToToggle, setUserToToggle] = useState<UserResponse | null>(null)
  const isAlertOpen = !!userToToggle

  const handleConfirmToggle = () => {
    if (userToToggle) {
      onToggleActive(userToToggle)
      setUserToToggle(null)
    }
  }

  const columns = useMemo<ColumnDef<UserResponse>[]>(
    () => [
      {
        id: 'fullName',
        header: ({ column }) => (
          <Button
            variant="ghost"
            className="h-auto p-0 font-medium hover:bg-transparent"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Nombre Completo
            <ArrowUpDown className="ml-2 h-3 w-3" />
          </Button>
        ),
        accessorFn: (row) =>
          `${row.name} ${row.paternalSurname ?? ''} ${row.maternalSurname ?? ''}`.trim(),
        cell: ({ row }) => {
          const u = row.original
          const fullName = `${u.name} ${u.paternalSurname ?? ''} ${u.maternalSurname ?? ''}`.trim()
          const initials = fullName
            .split(' ')
            .map((w) => w[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)
          return (
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{fullName}</p>
                <p className="text-muted-foreground text-xs">{u.email ?? '-'}</p>
              </div>
            </div>
          )
        },
      },
      {
        accessorKey: 'phone',
        header: 'Teléfono',
        cell: ({ getValue }) => (
          <span className="text-muted-foreground text-sm">
            {(getValue() as string | null) ?? '-'}
          </span>
        ),
      },
      {
        accessorKey: 'roleName',
        header: 'Rol',
        cell: ({ row, getValue }) => {
          const role = getValue() as string
          const roleId = row.original.roleId
          console.log({ role, roleId })
          return (
            <Badge
              variant="outline"
              className={ROLE_BADGE_VARIANTS[roleId] ?? 'bg-gray-100 text-gray-800'}
            >
              {role}
            </Badge>
          )
        },
      },
      {
        accessorKey: 'createdAt',
        header: ({ column }) => (
          <Button
            variant="ghost"
            className="-ml-4 h-auto p-0 font-medium hover:bg-transparent"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Fecha Registro
            <ArrowUpDown className="ml-2 h-3 w-3" />
          </Button>
        ),
        cell: ({ getValue }) => {
          const date = getValue() as string | null
          if (!date) return <span className="text-muted-foreground">-</span>
          return (
            <span className="text-sm">{format(new Date(date), 'dd MMM yyyy', { locale: es })}</span>
          )
        },
      },
      {
        accessorKey: 'isActive',
        header: 'Estado',
        cell: ({ getValue }) => <StatusBadge isActive={getValue() as boolean} />,
      },
      {
        id: 'actions',
        header: 'Acciones',
        cell: ({ row }) => {
          const user = row.original
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-auto">
                <DropdownMenuItem onClick={() => onEdit(user)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onResetPassword(user)}>
                  <KeyRound className="mr-2 h-4 w-4" />
                  Resetear contraseña
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setUserToToggle(user)}
                  className="cursor-pointer whitespace-nowrap"
                >
                  {user.isActive ? (
                    <>
                      <ShieldOff className="mr-2 h-4 w-4" />
                      Desactivar
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="mr-2 h-4 w-4" />
                      Activar
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onDelete(user)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
      },
    ],
    [onEdit, onResetPassword, onDelete],
  )

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        isLoading={isLoading}
        searchPlaceholder="Filtrar usuarios..."
        filterSlot={filterSlot}
      />

      <ConfirmDialog
        open={isAlertOpen}
        onOpenChange={(open) => !open && setUserToToggle(null)}
        title={
          userToToggle
            ? `¿Estás seguro de ${userToToggle.isActive ? 'desactivar' : 'activar'} a este usuario?`
            : ''
        }
        description={
          userToToggle
            ? userToToggle.isActive
              ? `Al desactivar a ${userToToggle.name}, no podrá acceder a la plataforma hasta que vuelvas a activarlo.`
              : `Al activar a ${userToToggle.name}, recuperará el acceso a la plataforma inmediatamente.`
            : ''
        }
        onConfirm={handleConfirmToggle}
        confirmLabel={userToToggle?.isActive ? 'Desactivar' : 'Activar'}
        variant={userToToggle?.isActive ? 'destructive' : 'default'}
      />
    </>
  )
}
