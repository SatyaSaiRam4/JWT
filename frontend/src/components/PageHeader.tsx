type PageHeaderProps = {
  title: string
  subtitle?: string
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="mb-5">
      <h1 className="m-0 text-2xl font-semibold text-slate-950">{title}</h1>
      {subtitle ? <p className="mt-1 text-slate-500">{subtitle}</p> : null}
    </div>
  )
}
