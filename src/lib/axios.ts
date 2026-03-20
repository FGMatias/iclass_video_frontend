import { useAuthStore } from '@/stores/auth.store'
import axios from 'axios'
import { toast } from 'sonner'

const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token

    if (token) config.headers.Authorization = `Bearer ${token}`

    return config
  },
  (error) => Promise.reject(error),
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const hasTokenInStorage = !!localStorage.getItem('iclass_token')

      if (hasTokenInStorage) {
        useAuthStore.logout()
        window.location.href = '/login?reason=expired'
      }
    }

    if (error.response?.status === 403) {
      toast.error('Acceso denegado', {
        description: 'No tienes permisos para realizar esta acción',
      })
    }

    return Promise.reject(error)
  },
)

export default api
