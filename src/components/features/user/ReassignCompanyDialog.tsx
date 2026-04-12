import { CompanySelector } from '@/components/features/company'
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

interface ReassignCompanyDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: UserResponse | null
  onConfirm: (userId: number, companyId: number) => void
  loading?: boolean
}

export function ReassignCompanyDialog({
  open,
  onOpenChange,
  user,
  onConfirm,
  loading = false,
}: ReassignCompanyDialogProps) {
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null)
  const currentCompanyName = user?.assignment?.companyName ?? 'Sin empresa'

  const handleConfirm = () => {
    if (user && selectedCompanyId) {
      onConfirm(user.id, selectedCompanyId)
    }
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) setSelectedCompanyId(null)
    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cambiar Empresa</DialogTitle>
          <DialogDescription>
            Reasignar a <span className="text-foreground font-medium">{user?.name}</span> de{' '}
            <span className="text-foreground font-medium">{currentCompanyName}</span> a una nueva
            empresa.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <CompanySelector
            value={selectedCompanyId || undefined}
            onChange={setSelectedCompanyId}
            disabled={loading}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={!selectedCompanyId || loading}>
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
