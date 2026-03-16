import { DataTable } from '@/components/shared/DataTable'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { BranchResponse } from '@/types/branch.types'
import type { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { ArrowUpDown, Building2, MoreHorizontal } from 'lucide-react'
import React, { useMemo } from 'react'

interface BranchTableProps {
  data: BranchResponse[]
  isLoading: boolean
  renderActions?: (branch: BranchResponse) => React.ReactNode
  filterSlot?: React.ReactNode
}

export function BranchTable({ data, isLoading, renderActions, filterSlot }: BranchTableProps) {
  const columns = useMemo<ColumnDef<BranchResponse>[]>(
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
                  <Building2 className='size-4'/>
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
        accessorKey: 'direction',
        header: 'Dirección',
        cell: ({ getValue }) => (
          <span className="text-muted-foreground text-sm">{(getValue() as string) || '-'}</span>
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
      searchPlaceholder="Filtrar sucursales"
      filterSlot={filterSlot}
    />
  )
}
