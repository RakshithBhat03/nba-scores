import { cva } from "class-variance-authority"

export const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "border-border text-foreground",
        live: "border-transparent bg-live text-live-foreground",
        final: "border-transparent bg-muted text-muted-foreground",
        scheduled: "border-transparent bg-primary/10 text-primary dark:bg-primary/20",
        record: "border-transparent bg-muted text-muted-foreground text-[10px] font-semibold normal-case tracking-normal",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)
