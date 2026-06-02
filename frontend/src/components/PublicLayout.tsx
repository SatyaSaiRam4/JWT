import { Navigate, Outlet } from 'react-router-dom'

import { useAppSelector } from '../store/hooks'

export function PublicLayout() {
  const token = useAppSelector((state) => state.auth.token)

  if (token) return <Navigate to="/dashboard" replace />

  return (
    <main className="auth-shell flex min-h-screen items-center justify-center px-4 py-8">
      <Outlet />
    </main>
  )
}
