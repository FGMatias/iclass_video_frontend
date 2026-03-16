import { DataTable } from '@/components/shared/DataTable'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { getInitials } from '@/lib/utils'
import type { CompanyResponse } from '@/types/company.types'
import type { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, MoreHorizontal } from 'lucide-react'
import React, { useMemo } from 'react'

interface CompanyTableProps {
  data: CompanyResponse[]
  isLoading: boolean
  renderActions?: (company: CompanyResponse) => React.ReactNode
  filterSlot?: React.ReactNode
}

export function CompanyTable({ data, isLoading, renderActions, filterSlot }: CompanyTableProps) {
  const columns = useMemo<ColumnDef<CompanyResponse>[]>(
    () => [
      {
        accessorKey: 'name',
        header: ({ column }) => (
          <Button
            variant="ghost"
            className="h-auto p-0 font-medium hover:bg-transparent"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Nombre
            <ArrowUpDown className="ml-2 size-3" />
          </Button>
        ),
        cell: ({ row }) => {
          const name = row.original.name

          return (
            <div className="flex items-center gap-3">
              <Avatar className="size-8">
                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                  {getInitials(name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{name}</p>
              </div>
            </div>
          )
        },
      },
      {
        accessorKey: 'ruc',
        header: 'RUC',
        cell: ({ getValue }) => (
          <span className="text-muted-foreground text-sm">{(getValue() as string) || '-'}</span>
        ),
      },
      {
        accessorKey: 'direction',
        header: 'Dirección',
        cell: ({ getValue }) => (
          <span className="text-muted-foreground block w-auto truncate text-sm">
            {(getValue() as string) || '-'}
          </span>
        ),
      },
      {
        accessorKey: 'phone',
        header: 'Teléfono',
        cell: ({ getValue }) => (
          <span className="text-muted-foreground text-sm">{(getValue() as string) || '-'}</span>
        ),
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
      },
    ],
    [renderActions],
  )

  return (
    <DataTable
      columns={columns}
      data={data}
      isLoading={isLoading}
      searchPlaceholder="Filtrar empresas..."
      filterSlot={filterSlot}
    />
  )
}
