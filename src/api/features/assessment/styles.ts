import type { IconName } from '@/data/assessment'

export const categoryStyles = [
  {
    color: '#22c55e',
    darkColor: '#16784b',
    tint: '#edf9f2',
    icon: 'shield',
  },
  {
    color: '#f97316',
    darkColor: '#c45120',
    tint: '#fff1e7',
    icon: 'growth',
  },
  {
    color: '#7c3aed',
    darkColor: '#6d28d9',
    tint: '#f1eafe',
    icon: 'bolt',
  },
  {
    color: '#2563eb',
    darkColor: '#1d4ed8',
    tint: '#eaf5ff',
    icon: 'bot',
  },
] satisfies Array<{
  color: string
  darkColor: string
  tint: string
  icon: IconName
}>
