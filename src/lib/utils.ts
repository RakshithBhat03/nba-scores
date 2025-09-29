import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatGameTime(date: string): string {
  try {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(new Date(date))
  } catch {
    return 'TBD'
  }
}

export function getTeamColorClasses(isWinning?: boolean) {
  const baseClasses = isWinning ? 'text-primary font-semibold' : ''
  return `${baseClasses} transition-colors duration-200`
}

export function getGameStatusVariant(status: 'scheduled' | 'in' | 'final') {
  switch (status) {
    case 'in':
      return 'live'
    case 'final':
      return 'final'
    default:
      return 'scheduled'
  }
}