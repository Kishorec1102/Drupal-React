import { cn } from '@/lib/utils'

type ProgressProps = {
  value: number
  color?: string
  className?: string
}

export function Progress({ value, color, className }: ProgressProps) {
  return (
    <div className={cn('progress', className)}>
      <span
        className="progress-fill"
        style={{ width: `${value}%`, backgroundColor: color }}
      />
    </div>
  )
}
