import { cva } from "class-variance-authority"

export const cardVariants = cva(
  "rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-200",
  {
    variants: {
      variant: {
        default: "border-border",
        game: "border-border hover:bg-accent/30 hover:border-primary/40 transition-colors duration-200",
        live: "border-nba-live-200 bg-nba-live-50 dark:border-nba-live-800 dark:bg-nba-live-950/20",
        final: "border-muted bg-muted/30",
      },
      size: {
        default: "p-3",
        sm: "p-3",
        lg: "p-8",
        game: "p-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)