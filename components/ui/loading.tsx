import { cn } from "@/lib/utils"

interface LoadingProps {
  size?: "sm" | "md" | "lg"
  className?: string
  variant?: "default" | "gradient"
}

export function Loading({ size = "md", className, variant = "default" }: LoadingProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12"
  }

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2",
        variant === "gradient" 
          ? "border-t-primary border-l-primary/30 border-b-primary/10 border-r-primary/5" 
          : "border-t-foreground border-l-foreground/30 border-b-foreground/10 border-r-foreground/5",
        sizeClasses[size],
        className
      )}
    />
  )
}

interface LoadingTextProps {
  text?: string
  className?: string
}

export function LoadingText({ text = "Loading...", className }: LoadingTextProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Loading size="sm" />
      <span className="text-sm text-muted-foreground">{text}</span>
    </div>
  )
} 