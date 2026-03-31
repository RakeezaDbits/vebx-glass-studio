import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Loader2, Send, Paperclip } from "lucide-react";
import {
  adminFetch,
  adminFetchBlob,
  adminFetchForm,
  getAdminToken,
  getAdminLiveChatEventsUrl,
  type LiveChatMessageRow,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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

type SessionRow = {
  id: number;
  public_token: string;
  visitor_name: string | null;
  visitor_email: string | null;
  created_at: string;
  updated_at: string;
  last_preview: string | null;
  last_msg_type: string | null;
};

function AdminMediaBubble({ messageId, msgType }: { messageId: number; msgType: string }) {
  const [url, setUrl] = useState<string | null>(null);
  const urlRef = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    adminFetchBlob(`/api/admin/livechat/file/${messageId}`)
      .then((blob) => {
        if (cancelled) return;
        if (urlRef.current) URL.revokeObjectURL(urlRef.current);
        const u = URL.createObjectURL(blob);
        urlRef.current = u;
        setUrl(u);
      })
      .catch(() => setUrl(null));
    return () => {
      cancelled = true;
      if (urlRef.current) {
        URL.revokeObjectURL(urlRef.current);
        urlRef.current = null;
      }
    };
  }, [messageId]);

  if (!url) return <span className="text-xs text-muted-foreground">Loading media…</span>;
  if (msgType === "image") return <img src={url} alt="" className="max-h-52 rounded-lg object-contain" />;
  if (msgType === "audio") return <audio controls src={url} className="w-full max-w-xs h-9" />;
  if (msgType === "video") return <video controls src={url} className="max-h-52 rounded-lg w-full" />;
  return null;
}

export default function AdminLiveChat() {
  const [searchParams, setSearchParams] = useSearchParams();
  const sessionHint = searchParams.get("session");

  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [sessionMeta, setSessionMeta] = useState<SessionRow | null>(null);
  const [messages, setMessages] = useState<LiveChatMessageRow[]>([]);
  const [text, setText] = useState("");
  const [loadingList, setLoadingList] = useState(true);
  const [loadingThread, setLoadingThread] = useState(false);
  const [sending, setSending] = useState(false);
  const lastIdRef = useRef(0);
  const sendLockRef = useRef(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const loadSessions = useCallback(async () => {
    const res = await adminFetch("/api/admin/livechat/sessions");
    const rows = (await res.json()) as SessionRow[];
    setSessions(rows);
    return rows;
  }, []);

  useEffect(() => {
    loadSessions().finally(() => setLoadingList(false));
  }, [loadSessions]);

  useEffect(() => {
    if (!sessions.length || selectedId != null) return;
    const hint = sessionHint ? Number(sessionHint) : NaN;
    if (Number.isFinite(hint) && sessions.some((s) => s.id === hint)) {
      setSelectedId(hint);
      return;
    }
    setSelectedId(sessions[0].id);
  }, [sessions, selectedId, sessionHint]);

  const loadThread = useCallback(
    async (id: number, reset: boolean) => {
      if (reset) {
        setLoadingThread(true);
        lastIdRef.current = 0;
      }
      try {
        const res = await adminFetch(`/api/admin/livechat/sessions/${id}/messages?afterId=${reset ? 0 : lastIdRef.current}`);
        const data = (await res.json()) as { session: SessionRow; messages: LiveChatMessageRow[] };
        setSessionMeta(data.session);
        if (reset) {
          setMessages(data.messages);
          lastIdRef.current = data.messages.reduce((m, r) => Math.max(m, r.id), 0);
        } else if (data.messages.length) {
          lastIdRef.current = Math.max(lastIdRef.current, ...data.messages.map((r) => r.id));
          setMessages((prev) => appendMessagesById(prev, data.messages));
        }
      } finally {
        if (reset) setLoadingThread(false);
      }
    },
    []
  );

  useEffect(() => {
    sendLockRef.current = false;
    if (selectedId == null) return;
    loadThread(selectedId, true);
  }, [selectedId, loadThread]);

  useEffect(() => {
    if (selectedId == null) return;

    const tick = () => {
      void loadThread(selectedId, false);
    };

    void tick();
    const intervalId = window.setInterval(tick, 4000);

    const accessToken = getAdminToken();
    let es: EventSource | null = null;
    if (accessToken) {
      try {
        es = new EventSource(getAdminLiveChatEventsUrl(selectedId, accessToken));
        es.onmessage = () => {
          void loadThread(selectedId, false);
          void loadSessions();
        };
        es.onerror = () => {
          /* browser may reconnect */
        };
      } catch {
        /* ignore */
      }
    }

    return () => {
      window.clearInterval(intervalId);
      es?.close();
    };
  }, [selectedId, loadThread, loadSessions]);

  const selectSession = (id: number) => {
    setSelectedId(id);
    setSearchParams(id ? { session: String(id) } : {});
  };

  const sendText = async () => {
    if (selectedId == null || !text.trim() || sendLockRef.current) return;
    sendLockRef.current = true;
    setSending(true);
    try {
      const fd = new FormData();
      fd.append("type", "text");
      fd.append("body", text.trim());
      const res = await adminFetchForm(`/api/admin/livechat/sessions/${selectedId}/messages`, fd);
      const raw = await res.text();
      if (!res.ok) {
        let err: { error?: string } = {};
        try {
          err = JSON.parse(raw) as { error?: string };
        } catch {
          /* ignore */
        }
        throw new Error(err.error || "Failed");
      }
      try {
        const j = JSON.parse(raw) as { id?: number | string };
        const rid = j.id;
        const nid =
          typeof rid === "number" && Number.isFinite(rid)
            ? rid
            : typeof rid === "string" && /^\d+$/.test(rid)
              ? Number(rid)
              : NaN;
        if (!Number.isNaN(nid)) lastIdRef.current = Math.max(lastIdRef.current, nid);
      } catch {
        /* ignore */
      }
      setText("");
      await loadThread(selectedId, false);
      loadSessions();
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
      sendLockRef.current = false;
    }
  };

  const onPickFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || selectedId == null || sendLockRef.current) return;
    sendLockRef.current = true;
    setSending(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      if (text.trim()) fd.append("body", text.trim());
      const res = await adminFetchForm(`/api/admin/livechat/sessions/${selectedId}/messages`, fd);
      const raw = await res.text();
      if (!res.ok) {
        let err: { error?: string } = {};
        try {
          err = JSON.parse(raw) as { error?: string };
        } catch {
          /* ignore */
        }
        throw new Error(err.error || "Failed");
      }
      try {
        const j = JSON.parse(raw) as { id?: number | string };
        const rid = j.id;
        const nid =
          typeof rid === "number" && Number.isFinite(rid)
            ? rid
            : typeof rid === "string" && /^\d+$/.test(rid)
              ? Number(rid)
              : NaN;
        if (!Number.isNaN(nid)) lastIdRef.current = Math.max(lastIdRef.current, nid);
      } catch {
        /* ignore */
      }
      setText("");
      await loadThread(selectedId, false);
      loadSessions();
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
      sendLockRef.current = false;
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Live chat</h1>
      <div className="grid h-[min(560px,calc(100vh-10rem))] max-h-[calc(100vh-8rem)] min-h-0 grid-cols-1 grid-rows-[minmax(0,1fr)_minmax(0,2fr)] gap-4 lg:grid-cols-[280px_1fr] lg:grid-rows-1">
        <div className="liquid-glass flex min-h-0 flex-col overflow-hidden rounded-xl border-glow">
          <div className="shrink-0 border-b border-border p-3 text-sm font-medium">Sessions</div>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
            {loadingList && (
              <div className="p-8 flex justify-center text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            )}
            {!loadingList &&
              sessions.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => selectSession(s.id)}
                  className={cn(
                    "w-full text-left px-3 py-2.5 border-b border-border/40 text-sm transition-colors",
                    selectedId === s.id ? "bg-primary/20 text-foreground" : "hover:bg-white/5 text-muted-foreground"
                  )}
                >
                  <div className="font-medium text-foreground truncate">
                    #{s.id} · {s.visitor_name || "Anonymous"}
                  </div>
                  <div className="text-xs truncate opacity-80">{s.visitor_email || "No email"}</div>
                  <div className="text-xs truncate mt-0.5 opacity-60">
                    {s.last_msg_type === "text" ? s.last_preview : s.last_msg_type ? `[${s.last_msg_type}]` : "—"}
                  </div>
                </button>
              ))}
            {!loadingList && sessions.length === 0 && (
              <p className="p-6 text-sm text-muted-foreground text-center">No conversations yet.</p>
            )}
          </div>
        </div>

        <div className="liquid-glass flex min-h-0 flex-col overflow-hidden rounded-xl border-glow">
          {selectedId == null ? (
            <div className="flex min-h-0 flex-1 items-center justify-center text-sm text-muted-foreground">Select a session</div>
          ) : (
            <>
              <div className="shrink-0 space-y-1 border-b border-border p-4">
                <h2 className="font-semibold">
                  Session #{selectedId}
                  {sessionMeta?.visitor_name && ` · ${sessionMeta.visitor_name}`}
                </h2>
                {sessionMeta?.visitor_email && (
                  <a href={`mailto:${sessionMeta.visitor_email}`} className="text-sm text-primary hover:underline">
                    {sessionMeta.visitor_email}
                  </a>
                )}
              </div>
              <div ref={listRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto overflow-x-hidden overscroll-contain p-4">
                {loadingThread && (
                  <div className="flex justify-center py-16">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                )}
                {!loadingThread &&
                  messages.map((m) => {
                    const isAdmin = m.sender === "admin";
                    return (
                      <div
                        key={m.id}
                        className={cn(
                          "max-w-[88%] rounded-2xl px-3 py-2 text-sm border",
                          isAdmin
                            ? "ml-auto bg-primary/20 border-primary/30"
                            : "mr-auto bg-white/[0.06] border-white/10"
                        )}
                      >
                        {(m.msg_type === "image" || m.msg_type === "audio" || m.msg_type === "video") && (
                          <div className="mb-1">
                            <AdminMediaBubble messageId={m.id} msgType={m.msg_type} />
                          </div>
                        )}
                        {m.body ? <p className="whitespace-pre-wrap break-words">{m.body}</p> : null}
                        <p className="text-[10px] opacity-50 mt-1">
                          {new Date(m.created_at).toLocaleString()}
                        </p>
                      </div>
                    );
                  })}
              </div>
              <div className="shrink-0 border-t border-border bg-black/10 p-3">
                <div className="flex gap-2 items-end">
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
                    className="shrink-0 h-10 w-10"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={sending}
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendText();
                      }
                    }}
                    placeholder="Reply…"
                    rows={2}
                    className={cn(
                      "flex-1 resize-none rounded-md border border-input bg-background px-3 py-2 text-sm",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    )}
                    disabled={sending}
                  />
                  <Button type="button" size="icon" className="shrink-0 gradient-red h-10 w-10" onClick={sendText} disabled={sending || !text.trim()}>
                    {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
