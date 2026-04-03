import { DataTable } from '@/components/shared/DataTable'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { DeviceResponse } from '@/types/device.types'
import type { ColumnDef } from '@tanstack/react-table'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { ArrowUpDown, Monitor, MoreHorizontal, Smartphone } from 'lucide-react'
import React, { useMemo } from 'react'

interface DeviceTableProps {
  data: DeviceResponse[]
  isLoading: boolean
  showAreaColumn?: boolean
  renderActions?: (device: DeviceResponse) => React.ReactNode
  filterSlot?: React.ReactNode
}

function getDeviceIcon(type: string) {
  return type === 'TABLET' ? (
    <Smartphone className="text-muted-foreground size-4" />
  ) : (
    <Monitor className="text-muted-foreground size-4" />
  )
}

function getLastConnection(device: DeviceResponse): string {
  const lastLogin = device.lastLogin ? new Date(device.lastLogin) : null
  const lastSync = device.lastSync ? new Date(device.lastSync) : null

  let latest: Date | null = null
  if (lastLogin && lastSync) {
    latest = lastLogin > lastSync ? lastLogin : lastSync
  } else {
    latest = lastLogin ?? lastSync
  }

  if (!latest) return '-'

  return formatDistanceToNow(latest, { addSuffix: false, locale: es })
}

export function DeviceTable({
  data,
  isLoading,
  showAreaColumn = false,
  renderActions,
  filterSlot,
}: DeviceTableProps) {
  const columns = useMemo<ColumnDef<DeviceResponse>[]>(() => {
    const cols: ColumnDef<DeviceResponse>[] = [
      {
        accessorKey: 'deviceName',
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
        cell: ({ getValue }) => <span className="font-medium">{getValue() as string}</span>,
      },
      {
        accessorKey: 'deviceUsername',
        header: 'Username',
        cell: ({ getValue }) => (
          <span className="text-muted-foreground font-mono text-sm">{getValue() as string}</span>
        ),
      },
      {
        accessorKey: 'deviceType',
        header: 'Tipo',
        cell: ({ getValue }) => {
          const type = getValue() as string

          return (
            <div className="flex items-center gap-2">
              {getDeviceIcon(type)}
              <span className="text-sm">{type}</span>
            </div>
          )
        },
      },
    ]

    if (showAreaColumn) {
      cols.push({
        id: 'areaName',
        header: 'Área',
        accessorFn: (row) => row.currentAreaName,
        cell: ({ getValue }) => {
          const areaName = getValue() as string | null

          return (
            <div className="text-sm">
              {areaName ?? <span className="text-muted-foreground">Sin asignar</span>}
            </div>
          )
        },
      })
    }

    cols.push({
      id: 'lastConnection',
      header: 'Última conexión',
      cell: ({ row }) => {
        const label = getLastConnection(row.original)

        return (
          <span className="text-muted-foreground text-sm">
            {label === '-' ? label : `Have ${label}`}
          </span>
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
  }, [showAreaColumn, renderActions])

  return (
    <DataTable
      columns={columns}
      data={data}
      isLoading={isLoading}
      searchPlaceholder="Filtrar dispositivos..."
      pageSize={5}
      filterSlot={filterSlot}
    />
  )
}
