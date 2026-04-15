import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Loader2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getDeviceId } from "@/lib/deviceId";
import {
  getChatCredits,
  generateDesignImage,
  saveReferenceImage,
  setStoredAIQuoteRef,
} from "@/lib/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

type DesignAssistantContentProps = {
  /** Chatbot panel: refresh credits when open */
  isActive?: boolean;
  onAfterQuote?: () => void;
  className?: string;
};

export default function DesignAssistantContent({
  isActive = true,
  onAfterQuote,
  className,
}: DesignAssistantContentProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const deviceId = getDeviceId();
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
    if (isActive) refreshCredits();
  }, [isActive, refreshCredits]);

  const handleGenerate = async () => {
    const trimmed = prompt.trim();
    if (!trimmed) {
      toast.error(t("designAssistant.promptRequired"));
      return;
    }
    setGenerating(true);
    setGeneratedImageDataUrl(null);
    try {
      const result = await generateDesignImage(deviceId, trimmed);
      if (result.imageData) setGeneratedImageDataUrl(result.imageData);
      else toast.error(t("designAssistant.imageDataMissing"));
      setCredits({ remaining: result.remaining, limit: result.limit });
    } catch (err) {
      const message = err instanceof Error ? err.message : t("designAssistant.generationFailed");
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
      toast.success(t("designAssistant.referenceAttached"));
      onAfterQuote?.();
      navigate("/custom-requirement");
    } catch (err) {
      const message = err instanceof Error ? err.message : t("designAssistant.attachFailed");
      console.error("[Design idea] Save reference failed:", err);
      toast.error(message);
    } finally {
      setSavingForQuote(false);
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => e.preventDefault();
  const handleDragStart = (e: React.DragEvent) => e.preventDefault();

  return (
    <div className={cn("space-y-5", className)}>
      <p className="text-xs text-muted-foreground">
        {creditsLoaded
          ? t("designAssistant.creditsToday", { remaining: credits.remaining, limit: credits.limit })
          : t("designAssistant.creditsLoading")}
      </p>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {t("designAssistant.intro")}
      </p>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder={t("designAssistant.promptPlaceholder")}
        className="w-full min-h-[100px] rounded-xl border border-border bg-secondary/30 px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 resize-y transition-shadow"
        disabled={generating}
      />
      <Button
        type="button"
        onClick={handleGenerate}
        disabled={generating}
        className={cn("w-full gap-2 rounded-xl h-11", generating && "opacity-60 cursor-wait")}
      >
        {generating ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {t("designAssistant.generating")}
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4" />
            {t("designAssistant.generate")}
          </>
        )}
      </Button>

      {generatedImageDataUrl && (
        <div className="space-y-3 pt-2">
          <p className="text-sm font-medium text-foreground">{t("designAssistant.generatedReference")}</p>
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
              alt={t("designAssistant.generatedImageAlt")}
              className="block w-full h-auto pointer-events-none select-none"
              draggable={false}
              style={{ userSelect: "none", pointerEvents: "none" }}
            />
            <div className="absolute bottom-2 left-2 right-2 py-2 px-3 rounded-lg bg-black/70 text-center text-xs text-muted-foreground backdrop-blur-sm">
              {t("designAssistant.referenceOnly")}
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
            {t("designAssistant.useInQuote")}
          </Button>
        </div>
      )}
    </div>
  );
}
