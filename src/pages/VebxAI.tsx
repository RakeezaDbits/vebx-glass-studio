import { useState, useRef, useCallback, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import PageLayout from "@/components/PageLayout";
import SeoHead from "@/components/SeoHead";
import { Button } from "@/components/ui/button";
import { Send, Mic, MicOff, Volume2, Loader2, Bot, User, Sparkles, Phone, PhoneOff } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function VebxAI() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "👋 Hi! I'm **Vebx Agent** — your intelligent design & development companion. Ask me anything about web development, app design, branding, or digital strategy!" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isOnCall, setIsOnCall] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const callTimerRef = useRef<ReturnType<typeof setInterval>>();

  const deviceId = useRef(
    localStorage.getItem("vebx_device_id") || (() => {
      const id = crypto.randomUUID();
      localStorage.setItem("vebx_device_id", id);
      return id;
    })()
  ).current;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ─── AI Chat (Streaming) ───
  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || isLoading) return;
    setInput("");

    const userMsg: Message = { role: "user", content: text };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deviceId,
          messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })),
          useCredits: false,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as any).error || `Error ${res.status}`);
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No stream");

      const decoder = new TextDecoder();
      let assistantText = "";
      let buffer = "";

      setMessages(prev => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let newlineIdx;
        while ((newlineIdx = buffer.indexOf("\n")) !== -1) {
          const line = buffer.slice(0, newlineIdx).trim();
          buffer = buffer.slice(newlineIdx + 1);

          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") continue;

          try {
            const parsed = JSON.parse(jsonStr);
            if (parsed.content) {
              assistantText += parsed.content;
              setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = { role: "assistant", content: assistantText };
                return updated;
              });
            }
          } catch {}
        }
      }
    } catch (err: any) {
      setMessages(prev => [...prev, { role: "assistant", content: `❌ ${err.message}` }]);
    } finally {
      setIsLoading(false);
    }
  }, [input, messages, isLoading, deviceId]);

  // ─── Voice Recording (STT) ───
  const toggleRecording = useCallback(async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });

        setIsLoading(true);
        try {
          const res = await fetch(`${API_BASE}/api/ai/stt`, {
            method: "POST",
            headers: { "Content-Type": "audio/webm" },
            body: audioBlob,
          });
          const data = await res.json();
          if (data.text) {
            setInput(data.text);
          }
        } catch (err: any) {
          console.error("STT error:", err);
        } finally {
          setIsLoading(false);
        }
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
    } catch {
      alert("Microphone access denied");
    }
  }, [isRecording]);

  // ─── Voice Call (simulated real-time agent) ───
  const toggleCall = useCallback(() => {
    if (isOnCall) {
      setIsOnCall(false);
      setCallDuration(0);
      if (callTimerRef.current) clearInterval(callTimerRef.current);
      setMessages(prev => [...prev, { role: "assistant", content: "📞 Voice call ended. Feel free to continue chatting!" }]);
    } else {
      setIsOnCall(true);
      setCallDuration(0);
      callTimerRef.current = setInterval(() => setCallDuration(p => p + 1), 1000);
      setMessages(prev => [...prev, { role: "assistant", content: "📞 Voice call started! I'm listening... Speak naturally and I'll assist you in real-time." }]);
    }
  }, [isOnCall]);

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <PageLayout>
      <SeoHead
        title="Vebx Agent — AI-Powered Digital Companion"
        description="Chat with Vebx Agent — your intelligent assistant for web development, app design, branding, and digital strategy."
        canonicalPath="/ai"
      />

      {/* Hero Banner */}
      <section className="relative min-h-[40vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/15 via-background to-background" />
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[150px] animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-[120px] animate-pulse delay-1000" />
        </div>
        <div className="container relative z-10 text-center py-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full liquid-glass border-glow mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">AI-Powered Agent</span>
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-4 text-foreground">
            Vebx <span className="text-gradient-red">Agent</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your intelligent companion for design, development & digital strategy. Chat or call — always ready.
          </p>
        </div>
      </section>

      {/* Main Content — Chat + Voice Call side by side */}
      <section className="container px-4 lg:px-8 pb-20 -mt-4">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-[1fr_300px] gap-6">

          {/* Chat Panel */}
          <div className="liquid-glass rounded-2xl border-glow overflow-hidden flex flex-col" style={{ height: "600px" }}>
            {/* Header */}
            <div className="border-b border-white/10 px-5 py-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full gradient-red flex items-center justify-center">
                <Bot className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-display text-sm font-semibold text-foreground">Vebx Agent</h3>
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
                  </span>
                  <span className="text-[10px] text-green-400 font-medium">Online</span>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "assistant" && (
                    <div className="w-7 h-7 rounded-full gradient-red flex items-center justify-center shrink-0 mt-1">
                      <Bot className="w-3.5 h-3.5 text-primary-foreground" />
                    </div>
                  )}
                  <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm ${
                    msg.role === "user"
                      ? "gradient-red text-primary-foreground rounded-br-md"
                      : "liquid-glass border-glow text-foreground rounded-bl-md"
                  }`}>
                    {msg.role === "assistant" ? (
                      <div className="prose prose-sm prose-invert max-w-none [&_p]:mb-2 [&_ul]:mb-2 [&_ol]:mb-2">
                        <ReactMarkdown>{msg.content || "..."}</ReactMarkdown>
                      </div>
                    ) : (
                      <p>{msg.content}</p>
                    )}
                  </div>
                  {msg.role === "user" && (
                    <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-1">
                      <User className="w-3.5 h-3.5 text-foreground" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-full gradient-red flex items-center justify-center shrink-0">
                    <Bot className="w-3.5 h-3.5 text-primary-foreground" />
                  </div>
                  <div className="liquid-glass border-glow rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-white/10 p-4">
              <div className="flex gap-2">
                <button
                  onClick={toggleRecording}
                  className={`p-3 rounded-xl transition-all ${
                    isRecording
                      ? "gradient-red text-primary-foreground animate-pulse"
                      : "liquid-glass border-glow text-muted-foreground hover:text-foreground"
                  }`}
                  title={isRecording ? "Stop recording" : "Voice input"}
                >
                  {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                  placeholder="Ask Vebx Agent anything..."
                  className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  disabled={isLoading}
                />
                <Button
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  variant="hero"
                  size="icon"
                  className="w-12 h-12 rounded-xl"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                </Button>
              </div>
            </div>
          </div>

          {/* Right Sidebar — Voice Call + Info */}
          <div className="flex flex-col gap-4">
            {/* Voice Call Card */}
            <div className="liquid-glass rounded-2xl border-glow p-6 text-center">
              <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Voice Call</h3>

              {isOnCall && (
                <div className="mb-4">
                  <p className="text-2xl font-mono font-bold text-primary tabular-nums">{formatTime(callDuration)}</p>
                  <p className="text-xs text-muted-foreground mt-1">Call in progress</p>
                </div>
              )}

              <button
                onClick={toggleCall}
                className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto transition-all duration-300 ${
                  isOnCall
                    ? "bg-red-600 hover:bg-red-700 animate-pulse shadow-[0_0_30px_rgba(220,38,38,0.5)]"
                    : "gradient-red glow-red hover:scale-110"
                }`}
              >
                {isOnCall ? <PhoneOff className="w-7 h-7 text-white" /> : <Phone className="w-7 h-7 text-primary-foreground" />}
              </button>
              <p className="text-xs text-muted-foreground mt-3">
                {isOnCall ? "Tap to end call" : "Start voice call"}
              </p>
            </div>

            {/* Agent Info Card */}
            <div className="liquid-glass rounded-2xl border-glow p-6">
              <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Agent Capabilities</h3>
              <ul className="space-y-3 text-sm text-foreground/80">
                <li className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Web & app development guidance</span>
                </li>
                <li className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>UI/UX design consultation</span>
                </li>
                <li className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Branding & marketing strategy</span>
                </li>
                <li className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Tech stack recommendations</span>
                </li>
                <li className="flex items-start gap-2">
                  <Volume2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Real-time voice interaction</span>
                </li>
              </ul>
            </div>

            {/* Quick Actions */}
            <div className="liquid-glass rounded-2xl border-glow p-5">
              <h3 className="font-display text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Quick Prompts</h3>
              <div className="space-y-2">
                {["Best tech stack for SaaS?", "How to improve website SEO?", "Mobile app vs web app?"].map(q => (
                  <button
                    key={q}
                    onClick={() => { setInput(q); }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs text-foreground/70 hover:text-foreground hover:bg-white/5 transition-colors border border-white/5"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
