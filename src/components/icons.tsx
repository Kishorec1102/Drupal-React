import type { IconName } from '@/data/assessment'

type IconProps = {
  name: IconName | 'sparkle' | 'arrow' | 'linkedin' | 'settings'
  className?: string
}

export function Icon({ name, className }: IconProps) {
  const common = {
    className,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2.2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  }

  switch (name) {
    case 'calendar':
      return (
        <svg {...common}>
          <rect x="4" y="5" width="16" height="15" rx="2" />
          <path d="M8 3v4M16 3v4M4 10h16" />
          <path d="M8 14h.01M12 14h.01M16 14h.01M8 17h.01M12 17h.01" />
        </svg>
      )
    case 'shield':
      return (
        <svg {...common}>
          <path d="M12 3 5.5 5.8v5.4c0 4.3 2.7 7.7 6.5 9.2 3.8-1.5 6.5-4.9 6.5-9.2V5.8L12 3Z" />
        </svg>
      )
    case 'growth':
      return (
        <svg {...common}>
          <path d="m4 15 5-5 4 4 7-7" />
          <path d="M16 7h4v4" />
        </svg>
      )
    case 'bolt':
      return (
        <svg {...common}>
          <path d="m13 2-8 12h6l-1 8 8-12h-6l1-8Z" />
        </svg>
      )
    case 'bot':
      return (
        <svg {...common}>
          <rect x="5" y="8" width="14" height="9" rx="2" />
          <path d="M9 12h.01M15 12h.01" />
          <path d="M12 8V5" />
        </svg>
      )
    case 'sparkle':
      return (
        <svg {...common}>
          <path d="M12 3 14.1 9.9 21 12l-6.9 2.1L12 21l-2.1-6.9L3 12l6.9-2.1L12 3Z" />
        </svg>
      )
    case 'arrow':
      return (
        <svg {...common}>
          <path d="M7 17 17 7M9 7h8v8" />
        </svg>
      )
    case 'linkedin':
      return (
        <svg {...common}>
          <path d="M6.5 9.5V18M10.5 18v-4.7c0-2.4 3.5-2.6 3.5 0V18M6.5 6.5h.01" />
          <rect x="3" y="3" width="18" height="18" rx="2" />
        </svg>
      )
    case 'settings':
      return (
        <svg {...common}>
          <path d="M12 8.2a3.8 3.8 0 1 0 0 7.6 3.8 3.8 0 0 0 0-7.6Z" />
          <path d="M12 2v3M12 19v3M4.9 4.9 7 7M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1 7 17M17 7l2.1-2.1" />
        </svg>
      )
  }
}

export function Logo({ inverse = false }: { inverse?: boolean }) {
  return (
    <div className="brand" aria-label="cxontology">
      <span className="brand-mark" aria-hidden="true">
        {Array.from({ length: 25 }).map((_, index) => (
          <span key={index} className={`dot dot-${index}`} />
        ))}
      </span>
      <span className={inverse ? 'brand-text inverse' : 'brand-text'}>
        cxontology
      </span>
    </div>
  )
}
