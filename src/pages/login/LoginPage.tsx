import linesImage from '@/assets/images/lines.jpg'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { loginSchema, type LoginFormData } from '@/schemas/auth.schema'
import { authService } from '@/services/auth.service'
import { useAuthStore } from '@/stores/auth.store'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2, MonitorPlay } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

export function LoginPage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const location = useLocation()
  const sessionExpired = location.state?.reason === 'expired'

  useEffect(() => {
    if (sessionExpired) {
      toast.warning('Sesión expirada', {
        description: 'Tu sesión ha expirado. Inicia sesión nuevamente.',
      })
    }
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)

    try {
      const response = await authService.login(data)

      useAuthStore.login(response)

      toast.success('Bienvenido', {
        description: `Hola, ${response.name}`,
      })

      navigate('/', { replace: true })
    } catch (error: unknown) {
      const err = error as { response?: { status?: number } }

      if (err.response?.status === 401 || err.response?.status === 403) {
        toast.error('Credenciales incorrectas', {
          description: 'Verifica tu usuario y contraseña',
        })
      } else {
        toast.error('Error de conexión', {
          description: 'No se pudo conectar con el servidor',
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm space-y-8">
          <div className="flex items-center gap-2">
            <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-lg">
              <MonitorPlay className="text-primary-foreground h-4 w-4" />
            </div>
            <span className="text-lg font-semibold">iClass Video</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">Iniciar sesión</h1>
            <p className="text-muted-foreground text-sm">
              Ingresa tus credenciales para acceder al panel de administración
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="username">Usuario</Label>
              <Input
                id="username"
                type="text"
                placeholder="admin_usuario"
                autoComplete="username"
                disabled={isLoading}
                {...register('username')}
              />
              {errors.username && (
                <p className="text-destructive text-sm">{errors.username.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  disabled={isLoading}
                  className="pr-10"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-destructive text-sm">{errors.password.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Ingresando...
                </>
              ) : (
                'Ingresar'
              )}
            </Button>
          </form>
        </div>
      </div>

      <div className="bg-primary relative hidden overflow-hidden lg:block">
        <img
          src={linesImage}
          alt="Oficina moderna con pantallas digitales"
          className="absolute inset-0 h-full w-full object-cover opacity-20"
        />

        <div className="from-primary via-primary/90 to-primary/70 absolute inset-0 bg-gradient-to-br" />

        <div className="relative flex h-full flex-col justify-end p-12">
          <blockquote className="space-y-4">
            <p className="text-primary-foreground text-2xl leading-relaxed font-semibold">
              Gestiona el contenido visual de tu empresa desde un solo lugar.
            </p>
            <p className="text-primary-foreground/70 text-base">
              Controla qué se reproduce, dónde y cuándo. Tus pantallas, tus reglas.
            </p>
          </blockquote>

          <div className="text-primary-foreground/50 mt-8 flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="bg-primary-foreground/50 h-2 w-2 rounded-full" />
              <span>Playlists dinámicas</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-primary-foreground/50 h-2 w-2 rounded-full" />
              <span>Multi-sucursal</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-primary-foreground/50 h-2 w-2 rounded-full" />
              <span>Sincronización offline</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
