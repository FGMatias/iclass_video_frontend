import { DataTable } from '@/components/shared/DataTable'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ROLE_BADGE_VARIANTS } from '@/constants/roles'
import { getInitials } from '@/lib/utils'
import type { UserResponse } from '@/types/user.types'
import type { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { ArrowUpDown, MoreHorizontal } from 'lucide-react'
import React, { useMemo } from 'react'

interface UserTableProps {
  data: UserResponse[]
  isLoading: boolean
  showRoleColumn?: boolean
  showCompanyColumn?: boolean
  showBranchColumn?: boolean
  renderActions?: (user: UserResponse) => React.ReactNode
  filterSlot?: React.ReactNode
}

export function UserTable({
  data,
  isLoading,
  showRoleColumn = true,
  showCompanyColumn = false,
  showBranchColumn = false,
  renderActions,
  filterSlot,
}: UserTableProps) {
  const columns = useMemo<ColumnDef<UserResponse>[]>(() => {
    const cols: ColumnDef<UserResponse>[] = [
      {
        id: 'fullName',
        header: ({ column }) => (
          <Button
            variant="ghost"
            className="h-auto p-0 font-medium hover:bg-transparent"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Nombre Completo
            <ArrowUpDown className="ml-2 size-3" />
          </Button>
        ),
        accessorFn: (row) =>
          `${row.name} ${row.paternalSurname ?? ''} ${row.maternalSurname ?? ''}`.trim(),
        cell: ({ row }) => {
          const u = row.original
          const fullName = `${u.name} ${u.paternalSurname ?? ''} ${u.maternalSurname ?? ''}`.trim()

          return (
            <div className="flex items-center gap-3">
              <Avatar className="size-8">
                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                  {getInitials(fullName)}
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
    ]

    if (showCompanyColumn) {
      cols.push({
        id: 'companyName',
        header: 'Empresa',
        accessorFn: (row) => row.assignment?.companyName ?? null,
        cell: ({ row }) => {
          const companyName = row.original.assignment?.companyName
          return (
            <span className="text-sm">
              {companyName ?? <span className="text-muted-foreground">Sin asignar</span>}
            </span>
          )
        },
      })
    }

    if (showBranchColumn) {
      cols.push({
        id: 'branchName',
        header: 'Sucursal',
        accessorFn: (row) => row.assignment?.branchName ?? null,
        cell: ({ row }) => {
          const branchName = row.original.assignment?.branchName
          return (
            <span className="text-sm">
              {branchName ?? <span className="text-muted-foreground">Sin asignar</span>}
            </span>
          )
        },
      })
    }

    if (showRoleColumn) {
      cols.push({
        accessorKey: 'roleName',
        header: 'Rol',
        cell: ({ row, getValue }) => {
          const role = getValue() as string
          const roleId = row.original.roleId
          return (
            <Badge variant="outline" className={ROLE_BADGE_VARIANTS[roleId] ?? ''}>
              {role}
            </Badge>
          )
        },
      })
    }

    cols.push({
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="h-auto p-0 font-medium hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Fecha Registro
          <ArrowUpDown className="ml-2 size-3" />
        </Button>
      ),
      cell: ({ getValue }) => {
        const date = getValue() as string | null
        if (!date) return <span className="text-muted-foreground">-</span>
        return (
          <span className="text-sm">{format(new Date(date), 'dd MMM yyyy', { locale: es })}</span>
        )
      },
    })

    cols.push({
      accessorKey: 'isActive',
      header: 'Estado',
      cell: ({ getValue }) => <StatusBadge isActive={getValue() as boolean} />,
    })

    cols.push({
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => {
        if (!renderActions) return null
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8">
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-auto">
              {renderActions(row.original)}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    })

    return cols
  }, [showRoleColumn, showCompanyColumn, showBranchColumn, renderActions])

  return (
    <DataTable
      columns={columns}
      data={data}
      isLoading={isLoading}
      searchPlaceholder="Filtrar usuarios..."
      filterSlot={filterSlot}
    />
  )
}
