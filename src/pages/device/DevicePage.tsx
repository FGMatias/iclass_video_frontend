import { toCreateDevice, toUpdateDevice } from '@/adapters/device.adapter'
import { DeviceForm, DeviceTable, ReassignDeviceDialog } from '@/components/features/device'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { PageHeader } from '@/components/shared/PageHeader'
import { Button } from '@/components/ui/button'
import { DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  useActivateDevice,
  useCreateDevice,
  useDeactivateDevice,
  useDeleteDevice,
  useDevices,
  useReassignDevice,
  useUpdateDevice,
} from '@/hooks/queries/useDevice'
import { useCurrentUser } from '@/hooks/queries/useUser'
import {
  createDeviceSchema,
  updateDeviceSchema,
  type CreateDeviceFormData,
  type UpdateDeviceFormData,
} from '@/schemas/device.schema'
import type { DeviceInfo } from '@/types/device.types'
import { Layers, Pencil, Plus, ShieldCheck, ShieldOff, Trash2 } from 'lucide-react'
import { useState } from 'react'

export function DevicePage() {
  const { data: currentUserProfile } = useCurrentUser()
  const branchId = currentUserProfile?.assignment?.branchId ?? undefined
  const { data: devices = [], isLoading } = useDevices({ branchId })
  const createDevice = useCreateDevice()
  const updateDevice = useUpdateDevice()
  const deleteDevice = useDeleteDevice()
  const activateDevice = useActivateDevice()
  const deactivateDevice = useDeactivateDevice()
  const reassignDevice = useReassignDevice()
  const [formOpen, setFormOpen] = useState(false)
  const [selectedDeviceId, setSelectedDeviceId] = useState<number | null>(null)
  const [toggleDeviceDialog, setToggleDeviceDialog] = useState<DeviceInfo | null>(null)
  const [deleteDialog, setDeleteDialog] = useState<DeviceInfo | null>(null)
  const [reassignDeviceArea, setReassignDeviceArea] = useState<DeviceInfo | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filteredDevices =
    statusFilter === 'all'
      ? devices
      : devices.filter((device) => (statusFilter === 'active' ? device.isActive : !device.isActive))

  const handleCreate = () => {
    setSelectedDeviceId(null)
    setFormOpen(true)
  }

  const handleEdit = (device: DeviceInfo) => {
    setSelectedDeviceId(device.id)
    setFormOpen(true)
  }

  const handleFormSubmit = (data: CreateDeviceFormData | UpdateDeviceFormData) => {
    if (selectedDeviceId) {
      const payload = toUpdateDevice(data as UpdateDeviceFormData)
      updateDevice.mutate(
        { id: selectedDeviceId, data: payload },
        { onSuccess: () => setFormOpen(false) },
      )
      return
    }
    const payload = toCreateDevice(data as CreateDeviceFormData)
    createDevice.mutate({ data: payload }, { onSuccess: () => setFormOpen(false) })
  }

  const handleConfirmToggle = () => {
    if (!toggleDeviceDialog) return
    if (toggleDeviceDialog.isActive) {
      deactivateDevice.mutate(
        { id: toggleDeviceDialog.id },
        { onSuccess: () => setToggleDeviceDialog(null) },
      )
    } else {
      activateDevice.mutate(
        { id: toggleDeviceDialog.id },
        { onSuccess: () => setToggleDeviceDialog(null) },
      )
    }
  }

  const handleConfirmDelete = () => {
    if (!deleteDialog) return

    deleteDevice.mutate({ id: deleteDialog.id }, { onSuccess: () => setDeleteDialog(null) })
  }

  const handleReassignDevice = (deviceId: number, areaId: number) => {
    reassignDevice.mutate({ deviceId, areaId }, { onSuccess: () => setReassignDeviceArea(null) })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gestión de Dispositivos"
        description="Administra los dispositivos y su información"
        actions={
          <div className="flex items-center gap-2">
            <Button onClick={handleCreate}>
              <Plus className="mr-2 size-4" />
              Nuevo Dispositivo
            </Button>
          </div>
        }
      />

      <DeviceTable
        data={filteredDevices}
        isLoading={isLoading}
        showAreaColumn={true}
        filterSlot={
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="active">Activo</SelectItem>
              <SelectItem value="inactive">Inactivo</SelectItem>
            </SelectContent>
          </Select>
        }
        renderActions={(device) => (
          <>
            <DropdownMenuItem onClick={() => handleEdit(device)}>
              <Pencil className="mr-2 size-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setReassignDeviceArea(device)}>
              <Layers className="mr-2 size-4" />
              Cambiar Área
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setToggleDeviceDialog(device)}>
              {device.isActive ? (
                <>
                  <ShieldOff className="mr-2 size-4" /> Desactivar
                </>
              ) : (
                <>
                  <ShieldCheck className="mr-2 size-4" /> Activar
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setDeleteDialog(device)} className="text-destructive">
              <Trash2 className="mr-2 size-4" />
              Eliminar
            </DropdownMenuItem>
          </>
        )}
      />

      <DeviceForm
        open={formOpen}
        onOpenChange={setFormOpen}
        deviceId={selectedDeviceId}
        onSubmit={handleFormSubmit}
        isLoadingAction={createDevice.isPending || updateDevice.isPending}
        branchId={branchId}
        showAreaSelect={true}
        schema={selectedDeviceId ? updateDeviceSchema : createDeviceSchema}
      />

      <ReassignDeviceDialog
        open={!!reassignDeviceArea}
        onOpenChange={(open) => !open && setReassignDeviceArea(null)}
        device={reassignDeviceArea}
        onConfirm={handleReassignDevice}
        branchId={branchId}
        loading={reassignDevice.isPending}
      />

      <ConfirmDialog
        open={!!toggleDeviceDialog}
        onOpenChange={(open) => !open && setToggleDeviceDialog(null)}
        title={
          toggleDeviceDialog
            ? `¿${toggleDeviceDialog.isActive ? 'Desactivar' : 'Activar'} el dispositivo ${toggleDeviceDialog.deviceName}?`
            : ''
        }
        description={
          toggleDeviceDialog
            ? toggleDeviceDialog.isActive
              ? `Al desactivar "${toggleDeviceDialog.deviceName}", el equipo perderá conexión con la plataforma, se cerrará su sesión y dejará de reproducir el contenido asignado.`
              : `Al activar "${toggleDeviceDialog.deviceName}", el equipo recuperará el acceso a la plataforma y reanudará la sincronización de su playlist.`
            : ''
        }
        onConfirm={handleConfirmToggle}
        confirmLabel={toggleDeviceDialog?.isActive ? 'Desactivar' : 'Activar'}
        variant={toggleDeviceDialog?.isActive ? 'destructive' : 'default'}
        loading={activateDevice.isPending || deactivateDevice.isPending}
      />

      <ConfirmDialog
        open={!!deleteDialog}
        onOpenChange={(open) => !open && setDeleteDialog(null)}
        title="Eliminar Dispositivo"
        description={`¿Estás seguro de eliminar a ${deleteDialog?.deviceName ?? ''}? Esta acción no se puede deshacer.`}
        onConfirm={handleConfirmDelete}
        confirmLabel="Eliminar"
        variant="destructive"
        loading={deleteDevice.isPending}
      />
    </div>
  )
}
