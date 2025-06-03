import { AuthUser } from '@supabase/supabase-js'
import { createStore } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

// -- declare types
type TAuthState = {
  auth: AuthUser | null
  isAuthenticated: boolean | null
}

type TAuthActions = {
  setAuth: (auth: AuthUser | null) => void
  setIsAuthenticated: (isAuthenticated: boolean) => void
}

type TAuthStore = TAuthState & TAuthActions

// -- initial state
const initialState: TAuthState = {
  auth: null,
  isAuthenticated: null,
}
const initAuthStore = (): TAuthState => {
  return initialState
}

// -- create store
const createAuthStore = (initState: TAuthState = initialState) => {
  return createStore<TAuthStore>()(
    devtools(
      persist(
        (set) => ({
          ...initState,
          setAuth: (auth: AuthUser | null) => set((state) => ({ ...state, auth })),
          setIsAuthenticated: (isAuthenticated: boolean) => set((state) => ({ ...state, isAuthenticated })),
        }),
        {
          name: 'auth-store',
        }
      )
    )
  )
}
type TAuthStoreApi = ReturnType<typeof createAuthStore>

// -- exporters
export { createAuthStore, initAuthStore }
export type { TAuthStore, TAuthStoreApi }
