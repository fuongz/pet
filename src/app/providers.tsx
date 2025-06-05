import { AuthStoreProvider } from './auth-provider'

export function Providers({ children }: { children: React.ReactNode }) {
  return <AuthStoreProvider>{children}</AuthStoreProvider>
}
