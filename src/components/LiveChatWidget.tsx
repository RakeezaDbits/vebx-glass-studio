import { useState, useRef, type CSSProperties } from "react";
import { MessageCircle, X, Mic, ArrowRight, User, Mail, Phone, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LiveChatPanel from "@/components/LiveChatPanel";
import { requirementServices } from "@/data/customRequirement";
import { postQuote } from "@/lib/api";
import { toast } from "sonner";

const CHAT_PANEL_STYLE: CSSProperties = {
  width: "min(calc(100vw - 1.5rem), 400px)",
  height: "min(520px, calc(100dvh - 6.5rem))",
  maxHeight: "min(520px, calc(100dvh - 6.5rem))",
  overflow: "hidden",
};

type WidgetView = "form" | "chat" | "submitted";

export default function LiveChatWidget() {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<WidgetView>("form");
  const [flipping, setFlipping] = useState(false);

  // Mini form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [serviceSlug, setServiceSlug] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  const flipTo = (target: WidgetView) => {
    setFlipping(true);
    setTimeout(() => {
      setView(target);
      setFlipping(false);
    }, 300);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error("Name and email are required");
      return;
    }
    setSubmitting(true);
    try {
      await postQuote({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        serviceSlug: serviceSlug || "general",
        techIds: [],
      });
      toast.success("Request sent!");
      setView("submitted");
      // Start 60s countdown
      setCountdown(60);
      timerRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch {
      toast.error("Failed to submit. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  return (
    <>
      {/* FAB with online indicator */}
      <div className="fixed bottom-5 right-5 z-[165] sm:bottom-6 sm:right-6">
        {/* Online badge above icon */}
        {!open && (
          <div className="absolute -top-7 left-1/2 -translate-x-1/2 flex items-center gap-1 whitespace-nowrap rounded-full border border-emerald-500/30 bg-black/70 px-2 py-0.5 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400">Online</span>
          </div>
        )}
        <button
          type="button"
          onClick={() => {
            if (open) handleClose();
            else { setOpen(true); if (view !== "submitted") setView("form"); }
          }}
          className={cn(
            "flex h-[3.75rem] w-[3.75rem] items-center justify-center rounded-2xl",
            "border-glow gradient-red text-primary-foreground shadow-lg transition-transform hover:scale-[1.05] active:scale-[0.98]",
            open && "ring-2 ring-primary/60"
          )}
          aria-label={open ? "Close" : "Chat with us"}
        >
          <span className="relative z-10 drop-shadow-sm">
            {open ? <X className="h-7 w-7" /> : <MessageCircle className="h-7 w-7" strokeWidth={2} />}
          </span>
        </button>
      </div>

      {open && (
        <div
          className="fixed bottom-[5.25rem] right-3 z-[160] flex flex-col sm:bottom-[5.75rem] sm:right-6"
          style={CHAT_PANEL_STYLE}
        >
          <div
            className={cn(
              "h-full w-full transition-transform duration-300 [transform-style:preserve-3d]",
              flipping && "animate-pulse opacity-70"
            )}
          >
            {/* ── FORM VIEW ── */}
            {view === "form" && (
              <div className="flex h-full flex-col overflow-hidden rounded-[1.35rem] border border-white/[0.09] bg-gradient-to-b from-black/80 via-black/70 to-black/80 backdrop-blur-2xl sm:rounded-3xl border-glow">
                <header className="shrink-0 border-b border-white/[0.08] px-4 py-3 sm:px-5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-base font-semibold text-foreground">Get a Quote</h3>
                    <button
                      type="button"
                      onClick={() => flipTo("chat")}
                      className="text-xs font-medium text-primary hover:underline underline-offset-2"
                    >
                      Skip to Live Chat →
                    </button>
                  </div>
                </header>

                <form onSubmit={handleFormSubmit} className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-4 sm:px-5 space-y-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <User className="h-3 w-3" /> Name <span className="text-primary">*</span>
                    </Label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="h-9 bg-white/5 border-white/10 text-sm"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <Mail className="h-3 w-3" /> Email <span className="text-primary">*</span>
                    </Label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="h-9 bg-white/5 border-white/10 text-sm"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <Phone className="h-3 w-3" /> WhatsApp
                    </Label>
                    <Input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 234 567 8900"
                      className="h-9 bg-white/5 border-white/10 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <Briefcase className="h-3 w-3" /> Service
                    </Label>
                    <select
                      value={serviceSlug}
                      onChange={(e) => setServiceSlug(e.target.value)}
                      className="w-full h-9 px-3 rounded-md bg-white/5 border border-white/10 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                    >
                      <option value="">Select a service</option>
                      {requirementServices.map((s) => (
                        <option key={s.slug} value={s.slug}>{s.title}</option>
                      ))}
                    </select>
                  </div>

                  <div className="!mt-auto pt-3 flex flex-col gap-2">
                    <Button
                      type="submit"
                      variant="hero"
                      size="sm"
                      className="w-full gap-2"
                      disabled={submitting}
                    >
                      {submitting ? "Sending…" : "Develop"} <ArrowRight className="h-4 w-4" />
                    </Button>
                    <button
                      type="button"
                      onClick={() => flipTo("chat")}
                      className="text-xs text-center text-muted-foreground hover:text-foreground transition-colors"
                    >
                      or start a live chat instead
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ── SUBMITTED VIEW (timer) ── */}
            {view === "submitted" && (
              <div className="flex h-full flex-col items-center justify-center gap-6 overflow-hidden rounded-[1.35rem] border border-white/[0.09] bg-gradient-to-b from-black/80 via-black/70 to-black/80 backdrop-blur-2xl sm:rounded-3xl border-glow px-6 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <MessageCircle className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-display text-lg font-bold text-foreground">Request Sent!</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We'll get back to you shortly. {countdown > 0 && (
                    <span className="block mt-2 text-primary font-semibold text-lg tabular-nums">
                      {countdown}s
                    </span>
                  )}
                </p>
                <Button
                  variant="hero"
                  size="sm"
                  className="gap-2"
                  onClick={() => flipTo("chat")}
                >
                  <MessageCircle className="h-4 w-4" /> Start Live Chat
                </Button>
              </div>
            )}

            {/* ── CHAT VIEW ── */}
            {view === "chat" && (
              <LiveChatPanel active={open} className="min-h-0 flex-1 h-full" />
            )}
          </div>
        </div>
      )}
    </>
  );
}
