import { DataTable } from '@/components/shared/DataTable'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { AreaResponse } from '@/types/area.types'
import type { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { ArrowUpDown, MoreHorizontal } from 'lucide-react'
import React, { useMemo } from 'react'

interface AreaTableProps {
  data: AreaResponse[]
  isLoading: boolean
  renderActions?: (area: AreaResponse) => React.ReactNode
  filterSlot?: React.ReactNode
}

export function AreaTable({ data, isLoading, renderActions, filterSlot }: AreaTableProps) {
  const columns = useMemo<ColumnDef<AreaResponse>[]>(
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
        cell: ({ getValue }) => <span className="text-sm">{(getValue() as string) || '-'}</span>,
      },
      {
        accessorKey: 'description',
        header: 'Descripción',
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
      searchPlaceholder="Filtrar áreas"
      filterSlot={filterSlot}
    />
  )
}
