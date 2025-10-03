import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatGameTime(date: string): string {
  try {
    // Display game times in user's local timezone
    const gameDate = new Date(date);
    const localTime = new Date(gameDate.toLocaleString("en-US", {
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    }));

    return format(localTime, 'h:mm a');
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