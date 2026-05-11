import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

type AlertVariant = 'success' | 'error' | 'info'

type AlertProps = HTMLAttributes<HTMLDivElement> & {
  title?: string
  variant?: AlertVariant
  children: ReactNode
}

const variants: Record<AlertVariant, string> = {
  success: 'alert alert-success',
  error: 'alert alert-error',
  info: 'alert alert-info',
}

export function Alert({
  className,
  title,
  variant = 'info',
  children,
  ...props
}: AlertProps) {
  return (
    <div className={cn(variants[variant], className)} role="alert" {...props}>
      {title ? <strong>{title}</strong> : null}
      <span>{children}</span>
    </div>
  )
}
