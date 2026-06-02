import type { ReactNode } from 'react'

type AuthCardProps = {
  title: string
  subtitle: string
  children: ReactNode
}

export function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <section className="w-full max-w-md rounded-lg bg-white p-6 shadow-sm">
      <h1 className="m-0 text-2xl font-semibold text-slate-950">{title}</h1>
      <p className="mb-6 mt-2 text-slate-500">{subtitle}</p>
      {children}
    </section>
  )
}
