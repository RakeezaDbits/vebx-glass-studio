import { cn } from "@/lib/utils";

/** 80% black scrim over photos / video backgrounds for consistent contrast. */
export default function MediaBlackOverlay({ className }: { className?: string }) {
  return <div className={cn("absolute inset-0 bg-black/80 pointer-events-none", className)} aria-hidden />;
}
