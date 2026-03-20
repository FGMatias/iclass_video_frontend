import type { AuthUser, UserAuthResponse } from '@/types/auth.types'

const TOKEN_KEY = 'iclass_token'
const USER_KEY = 'iclass_user'

interface AuthState {
  token: string | null
  user: AuthUser | null
}

type Listener = () => void
const listeners = new Set<Listener>()

function notifyListeners() {
  listeners.forEach((listener) => listener())
}

function isTokenExpired(expiresAt: string | undefined): boolean {
  if (!expiresAt) return true
  return new Date(expiresAt) <= new Date()
}

function getInitialState(): AuthState {
  try {
    const token = localStorage.getItem(TOKEN_KEY)
    const userJson = localStorage.getItem(USER_KEY)
    const user = userJson ? (JSON.parse(userJson) as AuthUser) : null

    if (token && user && isTokenExpired(user.tokenExpiresAt)) {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
      return { token: null, user: null }
    }

    return { token, user }
  } catch {
    return { token: null, user: null }
  }
}

let state: AuthState = getInitialState()

export const useAuthStore = {
  getState: () => state,

  login: (response: UserAuthResponse) => {
    const user: AuthUser = {
      id: response.id,
      username: response.username,
      name: response.name,
      email: response.email,
      roleId: response.roleId,
      roleName: response.roleName,
      tokenExpiresAt: response.expiresAt,
    }

    state = { token: response.token, user }
    localStorage.setItem(TOKEN_KEY, response.token)
    localStorage.setItem(USER_KEY, JSON.stringify(user))

    notifyListeners()
  },

  logout: () => {
    state = { token: null, user: null }

    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)

    notifyListeners()
  },

  subscribe: (listener: Listener) => {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },

  isTokenExpired: () => isTokenExpired(state.user?.tokenExpiresAt),
}
