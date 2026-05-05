import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type BadgeTone = 'green' | 'amber' | 'red' | 'gray'

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: BadgeTone
}

export function Badge({ className, tone = 'gray', ...props }: BadgeProps) {
  return <span className={cn('badge', `badge-${tone}`, className)} {...props} />
}
