import { AreaSelector } from '@/components/features/area'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { DeviceInfo } from '@/types/device.types'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'

interface ReassignDeviceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  device: DeviceInfo | null
  onConfirm: (deviceId: number, areaId: number) => void
  branchId?: number
  loading?: boolean
}

export function ReassignDeviceDialog({
  open,
  onOpenChange,
  device,
  onConfirm,
  branchId,
  loading = false,
}: ReassignDeviceDialogProps) {
  const [selectedAreaId, setSelectedAreaId] = useState<number | null>(null)
  const currentAreaName = device?.currentAreaName
  console.log({ branchId })

  const handleConfirm = () => {
    if (device && selectedAreaId) {
      onConfirm(device.id, selectedAreaId)
    }
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) setSelectedAreaId(null)
    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cambiar Área</DialogTitle>
          <DialogDescription>
            Reasignar a <span className="text-foreground font-medium">{device?.deviceName}</span> de{' '}
            <span className="text-foreground font-medium">{currentAreaName}</span> a una nueva área.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <AreaSelector
            value={selectedAreaId || undefined}
            onChange={setSelectedAreaId}
            disabled={loading}
            branchId={branchId}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={!selectedAreaId || loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Reasignando...
              </>
            ) : (
              'Confirmar'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
