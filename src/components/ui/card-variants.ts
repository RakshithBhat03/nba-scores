import { cva } from "class-variance-authority"

export const cardVariants = cva(
  "rounded-xl border bg-card text-card-foreground shadow-card transition-all duration-200",
  {
    variants: {
      variant: {
        default: "border-border",
        game: "border-border hover:bg-elevated hover:border-primary/40 hover:shadow-card-hover",
        live: "border-live/40 bg-card live-glow animate-live-glow",
        final: "border-border/60 bg-muted/20",
        elevated: "border-border bg-elevated",
      },
      size: {
        default: "p-3",
        sm: "p-3",
        lg: "p-8",
        game: "p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
