import { BranchSelector } from '@/components/features/branch'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { UserResponse } from '@/types/user.types'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'

interface ReassignBranchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: UserResponse | null
  onConfirm: (userId: number, companyId: number) => void
  companyId?: number
  loading?: boolean
}

export function ReassignBranchDialog({
  open,
  onOpenChange,
  user,
  onConfirm,
  companyId,
  loading = false,
}: ReassignBranchDialogProps) {
  const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null)
  const currentBranchName = user?.assignment?.branchName ?? 'Sin sucursal'

  const handleConfirm = () => {
    if (user && selectedBranchId) {
      onConfirm(user.id, selectedBranchId)
    }
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) setSelectedBranchId(null)
    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cambiar Sucursal</DialogTitle>
          <DialogDescription>
            Reasignar a <span className="text-foreground font-medium">{user?.name}</span> de{' '}
            <span className="text-foreground font-medium">{currentBranchName}</span> a una nueva
            sucursal.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <BranchSelector
            value={selectedBranchId || undefined}
            onChange={setSelectedBranchId}
            disabled={loading}
            companyId={companyId}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={!selectedBranchId || loading}>
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
