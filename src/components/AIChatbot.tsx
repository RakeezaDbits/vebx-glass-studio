import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Sparkles, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getDeviceId } from "@/lib/deviceId";
import {
  getChatCredits,
  generateAIImage,
  getGeneratedImageUrl,
  setStoredAIQuoteRef,
} from "@/lib/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function AIChatbot() {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [credits, setCredits] = useState<{ remaining: number; limit: number } | null>(null);
  const [lastResult, setLastResult] = useState<{ ref: string } | null>(null);
  const [imageError, setImageError] = useState(false);
  const deviceId = getDeviceId();
  const panelRef = useRef<HTMLDivElement>(null);

  const loadCredits = () => {
    getChatCredits(deviceId).then(setCredits).catch(() => setCredits({ remaining: 0, limit: 5 }));
  };

  useEffect(() => {
    if (open) loadCredits();
  }, [open]);

  const handleGenerate = async () => {
    if (!prompt.trim() || loading) return;
    if (credits && credits.remaining <= 0) {
      toast.error("No credits left. Try again tomorrow.");
      return;
    }
    setLoading(true);
    setImageError(false);
    setLastResult(null);
    try {
      const data = await generateAIImage(prompt.trim(), deviceId);
      setLastResult({ ref: data.ref });
      setCredits({ remaining: data.creditsLeft, limit: data.limit });
      toast.success("Image generated");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleUseAsReference = () => {
    if (!lastResult?.ref) return;
    setStoredAIQuoteRef(lastResult.ref);
    toast.success("Attached to Get a Quote. Go to Custom Requirement and submit to send it.");
    setOpen(false);
  };

  const imageUrl = lastResult ? getGeneratedImageUrl(lastResult.ref) : null;

  return (
    <>
      <Button
        type="button"
        size="icon"
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg border border-primary/30 bg-background/95 backdrop-blur"
        onClick={() => setOpen((o) => !o)}
        aria-label="AI design assistant"
      >
        <MessageCircle className="h-6 w-6 text-primary" />
      </Button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-[min(400px,calc(100vw-3rem))] rounded-2xl border border-border bg-card/95 backdrop-blur shadow-xl overflow-hidden"
          >
            <div className="flex items-center justify-between p-3 border-b border-border bg-muted/30">
              <span className="font-display font-semibold text-foreground flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Design idea
              </span>
              <Button type="button" variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Close">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
              {credits != null && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Lock className="h-3 w-3" />
                  {credits.remaining} of {credits.limit} generations left today (per device)
                </p>
              )}

              <div className="flex gap-2">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                  placeholder="e.g. Website with liquid glass theme, dark background, red accents"
                  className="flex-1 min-w-0 rounded-xl border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  disabled={loading}
                />
                <Button
                  type="button"
                  size="icon"
                  onClick={handleGenerate}
                  disabled={loading || !prompt.trim() || (credits != null && credits.remaining <= 0)}
                  className="shrink-0 rounded-xl"
                >
                  {loading ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {imageUrl && (
                <div
                  className={cn(
                    "relative rounded-xl overflow-hidden border border-border bg-muted/30",
                    "select-none touch-none",
                    "flex items-center justify-center min-h-[200px]"
                  )}
                  style={{
                    userSelect: "none",
                    WebkitUserSelect: "none",
                    WebkitTouchCallout: "none",
                  }}
                  onContextMenu={(e) => e.preventDefault()}
                  onDragStart={(e) => e.preventDefault()}
                >
                  {imageError ? (
                    <p className="text-sm text-muted-foreground p-4">Image unavailable</p>
                  ) : (
                    <img
                      src={imageUrl}
                      alt="AI generated reference"
                      className="max-w-full max-h-[320px] w-auto h-auto object-contain pointer-events-none"
                      draggable={false}
                      loading="lazy"
                      onError={() => setImageError(true)}
                      style={{ pointerEvents: "none" }}
                    />
                  )}
                  <div className="absolute bottom-2 left-2 right-2 flex justify-center">
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      className="gap-1.5 text-xs"
                      onClick={handleUseAsReference}
                    >
                      Use in Get a Quote
                    </Button>
                  </div>
                </div>
              )}

              <p className="text-[10px] text-muted-foreground">
                Generated images are for reference only and stay in this chat. You can attach one to your quote
                request.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
