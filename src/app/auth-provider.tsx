'use client'

import { createClient } from '@/lib/supabase/client'
import { createAuthStore, initAuthStore, TAuthStore, TAuthStoreApi } from '@/stores/auth.store'
import { createContext, useContext, useEffect, useRef } from 'react'
import { useStore } from 'zustand'

// -- supabase client
const supabase = createClient()

// -- context
const AuthProviderContext = createContext<TAuthStoreApi | undefined>(undefined)

// -- react provider instance
const AuthStoreProvider = ({ children }: { children: React.ReactNode }) => {
  const storeRef = useRef<TAuthStoreApi | null>(null)
  if (!storeRef.current) storeRef.current = createAuthStore(initAuthStore())

  async function fetchUser() {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (!error && user) {
      storeRef.current?.getState().setAuth(user)
      storeRef.current?.getState().setIsAuthenticated(!!user)
    } else {
      storeRef.current?.getState().setAuth(null)
      storeRef.current?.getState().setIsAuthenticated(false)
    }
  }

  useEffect(() => {
    fetchUser().catch(console.error)

    // -- listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(event, session)

      if (event === 'SIGNED_IN' && session?.user) {
        storeRef.current?.getState().setAuth(session.user)
        storeRef.current?.getState().setIsAuthenticated(true)
      } else if (event === 'SIGNED_OUT') {
        storeRef.current?.getState().setAuth(null)
        storeRef.current?.getState().setIsAuthenticated(false)
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [storeRef])

  return <AuthProviderContext.Provider value={storeRef.current}>{children}</AuthProviderContext.Provider>
}

// -- hook
const useAuthStore = <T,>(selector: (store: TAuthStore) => T): T => {
  const store = useContext(AuthProviderContext)
  if (!store) {
    throw new Error('useAuthStore must be used within an AuthStoreProvider')
  }
  return useStore(store, selector)
}

// -- exporters
export { AuthStoreProvider, useAuthStore }
