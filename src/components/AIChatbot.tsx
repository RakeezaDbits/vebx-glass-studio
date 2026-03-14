import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, X, Sparkles, Loader2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { getDeviceId } from "@/lib/deviceId";
import {
  getChatCredits,
  generateDesignImage,
  saveReferenceImage,
  setStoredAIQuoteRef,
} from "@/lib/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function AIChatbot() {
  const navigate = useNavigate();
  const deviceId = getDeviceId();
  const [open, setOpen] = useState(false);
  const [credits, setCredits] = useState<{ remaining: number; limit: number }>({
    remaining: 0,
    limit: 5,
  });
  const [creditsLoaded, setCreditsLoaded] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generatedImageDataUrl, setGeneratedImageDataUrl] = useState<string | null>(null);
  const [savingForQuote, setSavingForQuote] = useState(false);

  const refreshCredits = useCallback(() => {
    setCreditsLoaded(false);
    getChatCredits(deviceId)
      .then((c) => {
        setCredits(c);
        setCreditsLoaded(true);
      })
      .catch(() => {
        setCredits({ remaining: 0, limit: 5 });
        setCreditsLoaded(true);
      });
  }, [deviceId]);

  useEffect(() => {
    if (open) refreshCredits();
  }, [refreshCredits, open]);

  const handleGenerate = async () => {
    const trimmed = prompt.trim();
    if (!trimmed) {
      toast.error("Please enter a design idea or prompt.");
      return;
    }
    setGenerating(true);
    setGeneratedImageDataUrl(null);
    try {
      const result = await generateDesignImage(deviceId, trimmed);
      if (result.imageData) setGeneratedImageDataUrl(result.imageData);
      else toast.error("Could not get image data.");
      setCredits({ remaining: result.remaining, limit: result.limit });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Generation failed.";
      console.error("[Design idea] Image generation failed:", err);
      toast.error(message);
      refreshCredits();
    } finally {
      setGenerating(false);
    }
  };

  const handleUseInQuote = async () => {
    if (!generatedImageDataUrl) return;
    setSavingForQuote(true);
    try {
      const { ref } = await saveReferenceImage(deviceId, generatedImageDataUrl);
      setStoredAIQuoteRef(ref);
      toast.success("Reference attached. Opening quote form.");
      setOpen(false);
      navigate("/custom-requirement");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to attach.";
      console.error("[Design idea] Save reference failed:", err);
      toast.error(message);
    } finally {
      setSavingForQuote(false);
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => e.preventDefault();
  const handleDragStart = (e: React.DragEvent) => e.preventDefault();

  return (
    <>
      {/* Sticky button — right bottom, tooltip (delay) + glow */}
      <TooltipProvider delayDuration={500}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className={cn(
              "fixed bottom-6 right-6 z-[90] flex h-14 w-14 items-center justify-center rounded-full transition-all duration-300",
              "liquid-glass border-glow text-primary hover:scale-110 hover:bg-white/15",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background",
              "shadow-[0_0_20px_hsla(357,90%,46%,0.25),0_0_40px_hsla(357,90%,46%,0.1)] hover:shadow-[0_0_24px_hsla(357,90%,46%,0.35),0_0_48px_hsla(357,90%,46%,0.15)]"
            )}
            aria-label="Open Design idea chat"
          >
            <MessageCircle className="h-7 w-7" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="left" className="font-medium">
          Design idea — generate reference images for your project
        </TooltipContent>
      </Tooltip>
      </TooltipProvider>

      {/* Off-canvas overlay */}
      {open && (
        <div
          className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm transition-opacity"
          aria-hidden
          onClick={() => setOpen(false)}
        />
      )}

      {/* Off-canvas panel — slides from right, redesigned */}
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
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/80 bg-primary/5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/20 border border-primary/30 shadow-lg shadow-primary/10">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold text-foreground">
                Design idea
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {creditsLoaded ? `${credits.remaining} / ${credits.limit} credits today` : "… credits today"}
              </p>
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

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Describe the website or app design you want. We only generate design references for websites and apps — no other types of images. Use the result in Get a Quote. No account or login required.
          </p>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. Agency website with dark theme, red accents, modern hero section"
            className="w-full min-h-[100px] rounded-xl border border-border bg-secondary/30 px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 resize-y transition-shadow"
            disabled={generating}
          />
          <Button
            type="button"
            onClick={handleGenerate}
            disabled={generating}
            className={cn(
              "w-full gap-2 rounded-xl h-11",
              generating && "opacity-60 cursor-wait"
            )}
          >
            {generating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating…
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate image
              </>
            )}
          </Button>

          {generatedImageDataUrl && (
            <div className="space-y-3 pt-2">
              <p className="text-sm font-medium text-foreground">Generated reference</p>
              {/* Protected image — no download, no right-click, no drag */}
              <div
                className="relative rounded-xl overflow-hidden border border-border bg-black/40 ring-1 ring-white/5"
                onContextMenu={handleContextMenu}
                onDragStart={handleDragStart}
              >
                <div
                  className="absolute inset-0 z-10 cursor-default select-none"
                  style={{ userSelect: "none", WebkitUserSelect: "none" }}
                  onContextMenu={handleContextMenu}
                  onDragStart={handleDragStart}
                  aria-hidden
                />
                <img
                  src={generatedImageDataUrl}
                  alt="AI-generated design reference"
                  className="block w-full h-auto pointer-events-none select-none"
                  draggable={false}
                  style={{ userSelect: "none", pointerEvents: "none" }}
                />
                <div className="absolute bottom-2 left-2 right-2 py-2 px-3 rounded-lg bg-black/70 text-center text-xs text-muted-foreground backdrop-blur-sm">
                  Reference only — use in Get a Quote to attach
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                className="w-full gap-2 rounded-xl h-11 border-primary/30 hover:bg-primary/10"
                onClick={handleUseInQuote}
                disabled={savingForQuote}
              >
                {savingForQuote ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ExternalLink className="h-4 w-4" />
                )}
                Use in Get a Quote
              </Button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
