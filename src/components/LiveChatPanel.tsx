import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { MessagesSquare, Send, Paperclip, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  createLiveChatSession,
  fetchLiveChatMessages,
  getLiveChatMediaUrl,
  getLiveChatToken,
  postLiveChatMessage,
  clearLiveChatToken,
  getLiveChatEventsUrl,
  type LiveChatMessageRow,
} from "@/lib/api";

/** Fallback poll if SSE disconnects; SSE delivers updates immediately. */
const POLL_MS = 4000;

function appendMessagesById(prev: LiveChatMessageRow[], incoming: LiveChatMessageRow[]): LiveChatMessageRow[] {
  if (!incoming.length) return prev;
  const seen = new Set(prev.map((m) => m.id));
  const out = [...prev];
  for (const m of incoming) {
    if (!seen.has(m.id)) {
      seen.add(m.id);
      out.push(m);
    }
  }
  return out;
}

function MessageBubble({
  m,
  token,
  isVisitor,
}: {
  m: LiveChatMessageRow;
  token: string;
  isVisitor: boolean;
}) {
  const hasFile = m.msg_type === "image" || m.msg_type === "audio" || m.msg_type === "video";
  const url = hasFile ? getLiveChatMediaUrl(token, m.id) : "";

  return (
    <div className={cn("flex w-full", isVisitor ? "justify-start" : "justify-end")}>
      <div
        className={cn(
          "min-w-0 w-fit max-w-[82%] px-3.5 py-2.5 text-[13px] leading-relaxed shadow-md",
          isVisitor
            ? "rounded-[1.15rem] rounded-bl-md border border-primary/25 bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground shadow-primary/25"
            : "rounded-[1.15rem] rounded-br-md border border-white/[0.14] bg-gradient-to-b from-white/[0.1] to-white/[0.04] text-foreground shadow-black/20 backdrop-blur-sm"
        )}
      >
        {m.msg_type === "image" && hasFile && (
          <a href={url} target="_blank" rel="noreferrer" className="mb-2 block overflow-hidden rounded-xl">
            <img src={url} alt="" className="max-h-44 w-full max-w-[260px] object-cover" loading="lazy" />
          </a>
        )}
        {m.msg_type === "audio" && hasFile && (
          <audio controls src={url} className="mb-1 h-9 w-full min-w-[200px] max-w-[260px]" />
        )}
        {m.msg_type === "video" && hasFile && (
          <video controls src={url} className="mb-2 max-h-44 w-full max-w-[260px] rounded-xl" />
        )}
        {m.body ? (
          <p className="whitespace-pre-wrap break-words font-medium tracking-[0.01em]">{m.body}</p>
        ) : null}
        <p
          className={cn(
            "mt-1.5 text-[10px] font-medium tabular-nums",
            isVisitor ? "text-primary-foreground/55" : "text-muted-foreground/75"
          )}
        >
          {new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>
    </div>
  );
}

export type LiveChatPanelProps = {
  /** Floating widget: only connect while open. Contact page: always true. */
  active: boolean;
  /** Inline on Contact — fills parent; no fixed positioning. */
  embedded?: boolean;
  className?: string;
};

export default function LiveChatPanel({ active, embedded = false, className }: LiveChatPanelProps) {
  const [token, setToken] = useState<string | null>(() => getLiveChatToken());
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<LiveChatMessageRow[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastIdRef = useRef(0);
  /** Prevents double-send; cleared when panel closes, on reconnect, and in finally. */
  const sendLockRef = useRef(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const scrollBottom = () => {
    requestAnimationFrame(() => {
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
    });
  };

  const bootstrap = useCallback(async () => {
    sendLockRef.current = false;
    setLoading(true);
    setError(null);
    setConnected(false);
    try {
      let t = getLiveChatToken();
      if (!t) {
        const { token: nt } = await createLiveChatSession();
        t = nt;
      }
      setToken(t);
      const rows = await fetchLiveChatMessages(t, 0);
      lastIdRef.current = rows.reduce((max, r) => Math.max(max, r.id), 0);
      setMessages(rows);
      setConnected(true);
      scrollBottom();
    } catch (e) {
      if (e instanceof Error && e.message === "SESSION_EXPIRED") {
        clearLiveChatToken();
        setToken(null);
        const { token: nt } = await createLiveChatSession();
        setToken(nt);
        const rows = await fetchLiveChatMessages(nt, 0);
        lastIdRef.current = rows.reduce((max, r) => Math.max(max, r.id), 0);
        setMessages(rows);
        setConnected(true);
        scrollBottom();
      } else {
        setError(e instanceof Error ? e.message : "Could not connect");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!active) {
      sendLockRef.current = false;
      return;
    }
    bootstrap();
  }, [active, bootstrap]);

  useEffect(() => {
    if (!active || !token) return;

    const tick = async () => {
      try {
        const rows = await fetchLiveChatMessages(token, lastIdRef.current);
        if (rows.length) {
          lastIdRef.current = Math.max(lastIdRef.current, ...rows.map((r) => r.id));
          setMessages((prev) => appendMessagesById(prev, rows));
          scrollBottom();
        }
      } catch {
        /* ignore */
      }
    };

    void tick();
    const intervalId = window.setInterval(tick, POLL_MS);

    let es: EventSource | null = null;
    try {
      es = new EventSource(getLiveChatEventsUrl(token));
      es.onmessage = () => {
        void tick();
      };
      es.onerror = () => {
        /* browser reconnects; still keep interval fallback */
      };
    } catch {
      /* no EventSource (very old env) — interval only */
    }

    return () => {
      window.clearInterval(intervalId);
      es?.close();
    };
  }, [active, token]);

  const sendText = async () => {
    if (!token || !text.trim() || sendLockRef.current) return;
    sendLockRef.current = true;
    setSending(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("type", "text");
      fd.append("body", text.trim());
      const created = await postLiveChatMessage(token, fd);
      setText("");
      if (created?.id != null) {
        lastIdRef.current = Math.max(lastIdRef.current, created.id);
      }
      const rows = await fetchLiveChatMessages(token, lastIdRef.current);
      if (rows.length) {
        lastIdRef.current = Math.max(lastIdRef.current, ...rows.map((r) => r.id));
        setMessages((prev) => appendMessagesById(prev, rows));
      }
      scrollBottom();
    } catch (e) {
      if (e instanceof Error && e.message === "SESSION_EXPIRED") {
        await bootstrap();
      } else {
        setError(e instanceof Error ? e.message : "Send failed");
      }
    } finally {
      setSending(false);
      sendLockRef.current = false;
    }
  };

  const onPickFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !token || sendLockRef.current) return;
    sendLockRef.current = true;
    setSending(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      if (text.trim()) fd.append("body", text.trim());
      const created = await postLiveChatMessage(token, fd);
      setText("");
      if (created?.id != null) {
        lastIdRef.current = Math.max(lastIdRef.current, created.id);
      }
      const rows = await fetchLiveChatMessages(token, lastIdRef.current);
      if (rows.length) {
        lastIdRef.current = Math.max(lastIdRef.current, ...rows.map((r) => r.id));
        setMessages((prev) => appendMessagesById(prev, rows));
      }
      scrollBottom();
    } catch (err) {
      if (err instanceof Error && err.message === "SESSION_EXPIRED") {
        await bootstrap();
      } else {
        setError(err instanceof Error ? err.message : "Upload failed");
      }
    } finally {
      setSending(false);
      sendLockRef.current = false;
    }
  };

  if (!active) return null;

  const shell = (
    <div className={cn("relative flex min-h-0 flex-1 flex-col", embedded ? "h-full" : "h-full")}>
      <div className="live-chat-ambient" aria-hidden />
      <div className="pointer-events-none h-full min-h-0 flex-1 rounded-[1.35rem] sm:rounded-3xl border-glow">
        <div
          className={cn(
            "live-chat-panel-inner pointer-events-auto flex h-full min-h-0 flex-col overflow-hidden rounded-[1.3rem] border border-white/[0.09] sm:rounded-[calc(1.5rem-2px)]"
          )}
        >
          <header className="shrink-0 border-b border-white/[0.08] px-4 py-3 sm:px-5 sm:py-3.5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2.5">
                <MessagesSquare
                  className="h-5 w-5 shrink-0 text-primary sm:h-[1.35rem] sm:w-[1.35rem]"
                  strokeWidth={2}
                  aria-hidden
                />
                <h3 className="truncate font-display text-base font-semibold tracking-tight text-foreground sm:text-lg">
                  VebxRun
                </h3>
              </div>
              {connected && !error && (
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-emerald-400/95">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                  Online
                </span>
              )}
            </div>
          </header>

          <div
            ref={listRef}
            className="min-h-0 max-h-full flex-1 space-y-3 overflow-y-auto overflow-x-hidden overscroll-contain px-4 py-4 sm:px-5"
          >
            {loading && (
              <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin opacity-60" />
                <p className="text-xs">Connecting…</p>
              </div>
            )}
            {!loading && messages.length === 0 && !error && (
              <p className="px-1 py-8 text-center text-sm leading-relaxed text-muted-foreground">
                Messages are private. Say hi — we typically reply soon.
              </p>
            )}
            {!loading &&
              token &&
              messages.map((m) => (
                <MessageBubble
                  key={m.id}
                  m={m}
                  token={token}
                  isVisitor={String(m.sender).toLowerCase() === "visitor"}
                />
              ))}
          </div>

          {error && (
            <div className="shrink-0 space-y-2 border-t border-white/[0.06] bg-black/35 px-4 py-3 sm:px-5">
              <p className="text-xs leading-relaxed text-amber-200/90 sm:text-sm">{error}</p>
              {import.meta.env.DEV ? (
                <p className="text-[11px] leading-relaxed text-muted-foreground">
                  Local: run{" "}
                  <code className="rounded bg-white/10 px-1 py-0.5 text-[10px] text-foreground/90">npm run dev:all</code>{" "}
                  or two terminals — <code className="rounded bg-white/10 px-1 text-[10px]">npm run dev</code> +{" "}
                  <code className="rounded bg-white/10 px-1 text-[10px]">npm run server</code>. Start MySQL/MariaDB and
                  set <code className="rounded bg-white/10 px-1 text-[10px]">server/.env</code>{" "}
                  <code className="rounded bg-white/10 px-1 text-[10px]">DB_*</code>.
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  If this keeps happening, email{" "}
                  <a href="mailto:support@vebx.run" className="text-primary underline-offset-2 hover:underline">
                    support@vebx.run
                  </a>
                  .
                </p>
              )}
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="flex-1 bg-white/10 hover:bg-white/15"
                  onClick={() => bootstrap()}
                  disabled={loading}
                >
                  Try again
                </Button>
                {embedded ? (
                  <Button type="button" variant="outline" size="sm" className="flex-1 border-white/20" asChild>
                    <a href="mailto:support@vebx.run">Email support</a>
                  </Button>
                ) : (
                  <Button type="button" variant="outline" size="sm" className="flex-1 border-white/20" asChild>
                    <Link to="/contact">Contact page</Link>
                  </Button>
                )}
              </div>
            </div>
          )}

          <footer className="relative z-20 shrink-0 border-t border-white/[0.08] bg-black/40 px-3 py-3 sm:px-4">
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,audio/*,video/*"
                className="hidden"
                onChange={onPickFile}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-10 w-10 shrink-0 rounded-xl border-white/15 bg-black/25"
                onClick={() => fileInputRef.current?.click()}
                disabled={sending || !token}
                aria-label="Attach"
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              <Input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    sendText();
                  }
                }}
                placeholder={token ? "Message…" : "Connect to send…"}
                className={cn(
                  "h-10 min-w-0 flex-1 border-white/15 bg-black/35 text-sm",
                  "text-foreground placeholder:text-muted-foreground/55",
                  "cursor-text caret-primary focus-visible:ring-primary/40",
                  (!token || sending) && "cursor-not-allowed opacity-80"
                )}
                disabled={sending || !token}
              />
              <Button
                type="button"
                size="icon"
                className="h-10 w-10 shrink-0 rounded-xl gradient-red shadow-md shadow-primary/25"
                onClick={sendText}
                disabled={sending || !token || !text.trim()}
                aria-label="Send"
              >
                {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className={cn(
        embedded ? "flex min-h-0 w-full flex-1 flex-col overflow-hidden" : "relative flex h-full min-h-0 max-h-full flex-col overflow-hidden",
        className
      )}
    >
      {shell}
    </div>
  );
}
