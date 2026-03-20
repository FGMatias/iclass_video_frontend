import { StatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import type { UserResponse } from '@/types/user.types'
import {
  Briefcase,
  Building2,
  Calendar,
  Clock,
  IdCard,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  User,
} from 'lucide-react'

interface UserDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: UserResponse | null
}

export function UserDetailDialog({ open, onOpenChange, user }: UserDetailsDialogProps) {
  if (!user) return null

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  const getInitials = () => {
    const first = user.name?.charAt(0) || ''
    const second = user.paternalSurname?.charAt(0) || user.username?.charAt(0) || ''
    return `${first}${second}`.toUpperCase()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Detalles del Usuario</DialogTitle>
          <DialogDescription>Información completa y estado actual del usuario.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 text-primary flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-xl font-semibold">
              {getInitials()}
            </div>
            <div>
              <h3 className="text-xl leading-none font-semibold tracking-tight">
                {user.name} {user.paternalSurname} {user.maternalSurname}
              </h3>
              <p className="text-muted-foreground pt-1 text-sm">@{user.username}</p>
            </div>
            <div className="ml-auto">
              <StatusBadge isActive={user.isActive} />
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="bg-muted/30 space-y-3 rounded-lg border p-4">
              <h4 className="flex items-center gap-2 text-sm font-semibold">
                <User className="text-primary h-4 w-4" />
                Información Personal
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex flex-col">
                  <span className="text-muted-foreground text-xs">Nombre completo</span>
                  <span className="font-medium">
                    {user.name} {user.paternalSurname} {user.maternalSurname}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground text-xs">Documento</span>
                  <span className="flex items-center gap-1 font-medium">
                    <IdCard className="text-muted-foreground h-3 w-3" />
                    {user.documentNumber || 'No registrado'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-muted/30 space-y-3 rounded-lg border p-4">
              <h4 className="flex items-center gap-2 text-sm font-semibold">
                <Mail className="text-primary h-4 w-4" />
                Contacto
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex flex-col">
                  <span className="text-muted-foreground text-xs">Email</span>
                  <span className="font-medium">{user.email || 'No registrado'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground text-xs">Teléfono</span>
                  <span className="flex items-center gap-1 font-medium">
                    <Phone className="text-muted-foreground h-3 w-3" />
                    {user.phone || 'No registrado'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-muted/30 space-y-3 rounded-lg border p-4">
              <h4 className="flex items-center gap-2 text-sm font-semibold">
                <Briefcase className="text-primary h-4 w-4" />
                Asignación y Rol
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex flex-col">
                  <span className="text-muted-foreground text-xs">Rol del Sistema</span>
                  <span className="flex items-center gap-1 font-medium">
                    <ShieldCheck className="text-muted-foreground h-3 w-3" />
                    {user.roleName}
                  </span>
                </div>
                {(user as any).assignment?.companyName && (
                  <div className="flex flex-col">
                    <span className="text-muted-foreground text-xs">Empresa</span>
                    <span className="flex items-center gap-1 font-medium">
                      <Building2 className="text-muted-foreground h-3 w-3" />
                      {(user as any).assignment.companyName}
                    </span>
                  </div>
                )}
                {(user as any).assignment?.branchName && (
                  <div className="flex flex-col">
                    <span className="text-muted-foreground text-xs">Sucursal</span>
                    <span className="flex items-center gap-1 font-medium">
                      <MapPin className="text-muted-foreground h-3 w-3" />
                      {(user as any).assignment.branchName}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-muted/30 space-y-3 rounded-lg border p-4">
              <h4 className="flex items-center gap-2 text-sm font-semibold">
                <Clock className="text-primary h-4 w-4" />
                Registro
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex flex-col">
                  <span className="text-muted-foreground text-xs">Fecha de creación</span>
                  <span className="flex items-center gap-1 font-medium">
                    <Calendar className="text-muted-foreground h-3 w-3" />
                    {formatDate((user as any).createdAt)}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground text-xs">Última actualización</span>
                  <span className="flex items-center gap-1 font-medium">
                    <Calendar className="text-muted-foreground h-3 w-3" />
                    {formatDate((user as any).updatedAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
