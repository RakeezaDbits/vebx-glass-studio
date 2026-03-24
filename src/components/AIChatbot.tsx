import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import DesignAssistantContent from "@/components/DesignAssistantContent";
import { cn } from "@/lib/utils";

export default function AIChatbot() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TooltipProvider delayDuration={500}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className={cn(
                "fixed bottom-6 right-6 z-[90] flex h-14 w-14 items-center justify-center rounded-full overflow-hidden transition-all duration-300 p-0",
                "liquid-glass border-glow hover:scale-110 hover:bg-white/15",
                "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background",
                "shadow-[0_0_20px_hsla(357,90%,46%,0.25),0_0_40px_hsla(357,90%,46%,0.1)] hover:shadow-[0_0_24px_hsla(357,90%,46%,0.35),0_0_48px_hsla(357,90%,46%,0.15)]"
              )}
              aria-label="Open VebXrun AI"
            >
              <img
                src="/chatbot-robot-btn.png"
                alt=""
                width={56}
                height={56}
                draggable={false}
                className="chatbot-robot-gif h-full w-full object-cover select-none pointer-events-none"
              />
            </button>
          </TooltipTrigger>
          <TooltipContent side="left" className="font-medium max-w-[240px]">
            VebXrun AI — open messages, describe your design; generate reference images for your project
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {open && (
        <div
          className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm transition-opacity"
          aria-hidden
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 right-0 z-[100] h-full w-full max-w-md flex flex-col transition-transform duration-300 ease-out",
          "rounded-l-2xl overflow-hidden border-l border-border shadow-2xl",
          "bg-gradient-to-b from-card/98 to-background/98 backdrop-blur-xl",
          open ? "translate-x-0" : "translate-x-full"
        )}
        role="dialog"
        aria-label="Design idea — AI reference image"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-border/80 bg-primary/5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl overflow-hidden bg-primary/20 border border-primary/30 shadow-lg shadow-primary/10">
              <img src="/chatbot-robot-btn.png" alt="" className="h-full w-full object-cover" />
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold text-foreground">VebXrun AI</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Same as header — messages + image ideas</p>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setOpen(false)}
            className="rounded-xl hover:bg-primary/10"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <DesignAssistantContent
          isActive={open}
          onAfterQuote={() => setOpen(false)}
          className="flex-1 overflow-y-auto p-5 min-h-0"
        />
      </aside>
    </>
  );
}
