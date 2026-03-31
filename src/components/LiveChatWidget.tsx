import { useState, type CSSProperties } from "react";
import { MessageCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import LiveChatPanel from "@/components/LiveChatPanel";

/** Fixed panel size — messages scroll inside; panel never grows taller than this. */
const CHAT_PANEL_STYLE: CSSProperties = {
  width: "min(calc(100vw - 1.5rem), 400px)",
  height: "min(480px, calc(100dvh - 6.5rem))",
  maxHeight: "min(480px, calc(100dvh - 6.5rem))",
  overflow: "hidden",
};

export default function LiveChatWidget() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "fixed bottom-5 right-5 z-[165] flex h-[3.75rem] w-[3.75rem] items-center justify-center rounded-2xl sm:bottom-6 sm:right-6",
          "border-glow gradient-red text-primary-foreground shadow-lg transition-transform hover:scale-[1.05] active:scale-[0.98]",
          open && "ring-2 ring-primary/60"
        )}
        aria-label={open ? "Close VebxRun" : "Open VebxRun"}
      >
        <span className="relative z-10 drop-shadow-sm">
          {open ? <X className="h-7 w-7" /> : <MessageCircle className="h-7 w-7" strokeWidth={2} />}
        </span>
      </button>

      {open && (
        <div
          className="fixed bottom-[5.25rem] right-3 z-[160] flex flex-col sm:bottom-[5.75rem] sm:right-6"
          style={CHAT_PANEL_STYLE}
        >
          <LiveChatPanel active={open} className="min-h-0 flex-1" />
        </div>
      )}
    </>
  );
}
