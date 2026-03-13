import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, X, Sparkles, Loader2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getDeviceId } from "@/lib/deviceId";
import {
  getChatCredits,
  useChatCredit,
  saveReferenceImage,
  setStoredAIQuoteRef,
} from "@/lib/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    puter?: {
      ai?: {
        txt2img: (
          prompt: string,
          options?: { model?: string }
        ) => Promise<HTMLImageElement>;
      };
    };
  }
}

const PUTER_MODEL = "black-forest-labs/FLUX.1-schnell";

export default function AIChatbot() {
  const navigate = useNavigate();
  const deviceId = getDeviceId();
  const [open, setOpen] = useState(false);
  const [credits, setCredits] = useState<{ remaining: number; limit: number }>({
    remaining: 0,
    limit: 5,
  });
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generatedImageDataUrl, setGeneratedImageDataUrl] = useState<string | null>(null);
  const [savingForQuote, setSavingForQuote] = useState(false);

  const refreshCredits = useCallback(() => {
    getChatCredits(deviceId).then(setCredits).catch(() => setCredits({ remaining: 0, limit: 5 }));
  }, [deviceId]);

  useEffect(() => {
    refreshCredits();
  }, [refreshCredits, open]);

  const handleGenerate = async () => {
    const trimmed = prompt.trim();
    if (!trimmed) {
      toast.error("Please enter a design idea or prompt.");
      return;
    }
    if (credits.remaining <= 0) {
      toast.error("No credits left for today. Try again tomorrow.");
      return;
    }
    const puterAi = window.puter?.ai;
    if (!puterAi?.txt2img) {
      toast.error("Image generation is not available. Please refresh the page.");
      return;
    }
    setGenerating(true);
    setGeneratedImageDataUrl(null);
    try {
      const result = await useChatCredit(deviceId);
      if (!result.success) {
        toast.error("No credits left for today. Try again tomorrow.");
        setCredits({ remaining: result.remaining, limit: result.limit });
        return;
      }
      setCredits((c) => ({ ...c, remaining: result.remaining }));
      const imgEl = await puterAi.txt2img(trimmed, { model: PUTER_MODEL });
      let dataUrl: string = imgEl.src || "";
      if (imgEl.src.startsWith("blob:")) {
        const res = await fetch(imgEl.src);
        const blob = await res.blob();
        dataUrl = await new Promise<string>((resolve, reject) => {
          const fr = new FileReader();
          fr.onload = () => resolve(String(fr.result));
          fr.onerror = reject;
          fr.readAsDataURL(blob);
        });
      }
      if (dataUrl) setGeneratedImageDataUrl(dataUrl);
      else toast.error("Could not get image data.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Generation failed.");
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
      toast.error(err instanceof Error ? err.message : "Failed to attach.");
    } finally {
      setSavingForQuote(false);
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => e.preventDefault();
  const handleDragStart = (e: React.DragEvent) => e.preventDefault();

  return (
    <>
      {/* Sticky button — right bottom */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-[90] flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all duration-300",
          "liquid-glass border-glow text-primary hover:scale-110 hover:bg-white/15",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
        )}
        aria-label="Open Design idea chat"
      >
        <MessageCircle className="h-7 w-7" />
      </button>

      {/* Off-canvas overlay */}
      {open && (
        <div
          className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm transition-opacity"
          aria-hidden
          onClick={() => setOpen(false)}
        />
      )}

      {/* Off-canvas panel — slides from right */}
      <aside
        className={cn(
          "fixed top-0 right-0 z-[100] h-full w-full max-w-md bg-background/95 shadow-2xl transition-transform duration-300 ease-out",
          "liquid-glass border-l border-border",
          "flex flex-col",
          open ? "translate-x-0" : "translate-x-full"
        )}
        role="dialog"
        aria-label="Design idea — AI reference image"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border p-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold text-foreground">
                Design idea
              </h2>
              <p className="text-xs text-muted-foreground">
                {credits.remaining} / {credits.limit} credits today
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setOpen(false)}
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <p className="text-sm text-muted-foreground">
            Describe the website or design you want. We&apos;ll generate a reference image you can use in Get a Quote. No account or login required. Image stays inside this chat and cannot be downloaded.
          </p>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. Website with liquid glass theme, dark background, red accents, modern hero section"
            className="w-full min-h-[100px] rounded-xl border border-border bg-secondary/50 px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y"
            disabled={generating}
          />
          <Button
            type="button"
            onClick={handleGenerate}
            disabled={generating || credits.remaining <= 0}
            className="w-full gap-2"
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
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">Generated reference</p>
              {/* Protected image — no download, no right-click, no drag */}
              <div
                className="relative rounded-xl overflow-hidden border border-border bg-black/30"
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
                <div className="absolute bottom-2 left-2 right-2 py-1.5 px-2 rounded bg-black/70 text-center text-xs text-muted-foreground">
                  Reference only — use in Get a Quote to attach
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                className="w-full gap-2"
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
