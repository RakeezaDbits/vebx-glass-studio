import { useCallback, useEffect, useRef, useState } from "react";
import PageLayout from "@/components/PageLayout";
import SeoHead from "@/components/SeoHead";
import { Button } from "@/components/ui/button";
import {
  Bot,
  Loader2,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Send,
  Sparkles,
  User,
  Volume2,
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const INITIAL_ASSISTANT_MESSAGE =
  "Hello! I am **Vebx Tech Agent**. I help only with technology-related topics such as web development, apps, AI, APIs, cloud, UX for digital products, debugging, and architecture. Ask your tech question to get started.";

const QUICK_PROMPTS = [
  "Best tech stack for a SaaS MVP?",
  "How should I design a scalable REST API?",
  "How can I optimize a React app for speed?",
];

function createId() {
  return crypto.randomUUID();
}

export default function VebxAI() {
  const [messages, setMessages] = useState<Message[]>([
    { id: createId(), role: "assistant", content: INITIAL_ASSISTANT_MESSAGE },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isOnCall, setIsOnCall] = useState(false);
  const [isConnectingCall, setIsConnectingCall] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [callStatus, setCallStatus] = useState("Ready for a realtime tech call");

  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const callTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);
  const callAssistantMessageIdRef = useRef<string | null>(null);
  const messagesRef = useRef(messages);

  const deviceId = useRef(
    localStorage.getItem("vebx_device_id") ||
      (() => {
        const id = crypto.randomUUID();
        localStorage.setItem("vebx_device_id", id);
        return id;
      })()
  ).current;

  useEffect(() => {
    messagesRef.current = messages;
    const chatScroll = chatScrollRef.current;
    if (!chatScroll) return;

    chatScroll.scrollTo({
      top: chatScroll.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const appendMessage = useCallback((role: Message["role"], content: string) => {
    const next = { id: createId(), role, content };
    setMessages((prev) => [...prev, next]);
    return next.id;
  }, []);

  const upsertAssistantMessage = useCallback((messageId: string, content: string) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === messageId ? { ...msg, content } : msg))
    );
  }, []);

  const stopCallTimer = useCallback(() => {
    if (callTimerRef.current) {
      clearInterval(callTimerRef.current);
      callTimerRef.current = null;
    }
  }, []);

  const cleanupRealtimeResources = useCallback(() => {
    stopCallTimer();

    dataChannelRef.current?.close();
    dataChannelRef.current = null;

    peerConnectionRef.current?.close();
    peerConnectionRef.current = null;

    localStreamRef.current?.getTracks().forEach((track) => track.stop());
    localStreamRef.current = null;

    remoteAudioRef.current?.pause();
    remoteAudioRef.current = null;

    callAssistantMessageIdRef.current = null;
  }, [stopCallTimer]);

  useEffect(() => {
    return () => cleanupRealtimeResources();
  }, [cleanupRealtimeResources]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg: Message = { id: createId(), role: "user", content: text };
    const nextConversation = [...messagesRef.current, userMsg];

    setInput("");
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    const assistantId = createId();
    setMessages((prev) => [...prev, { id: assistantId, role: "assistant", content: "" }]);

    try {
      const res = await fetch(`${API_BASE}/api/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deviceId,
          messages: nextConversation.map((m) => ({ role: m.role, content: m.content })),
          useCredits: false,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { error?: string }).error || `Error ${res.status}`);
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response stream received");

      const decoder = new TextDecoder();
      let assistantText = "";
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        let newlineIdx = buffer.indexOf("\n");
        while (newlineIdx !== -1) {
          const line = buffer.slice(0, newlineIdx).trim();
          buffer = buffer.slice(newlineIdx + 1);

          if (line.startsWith("data: ")) {
            const jsonStr = line.slice(6).trim();
            if (jsonStr !== "[DONE]") {
              try {
                const parsed = JSON.parse(jsonStr) as { content?: string };
                if (parsed.content) {
                  assistantText += parsed.content;
                  upsertAssistantMessage(assistantId, assistantText);
                }
              } catch {
                // Ignore partial chunks from the SSE stream.
              }
            }
          }

          newlineIdx = buffer.indexOf("\n");
        }
      }

      if (!assistantText.trim()) {
        upsertAssistantMessage(
          assistantId,
          "I could not generate a response right now. Please send your tech question again."
        );
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "AI chat request failed unexpectedly";
      upsertAssistantMessage(assistantId, `❌ ${message}`);
    } finally {
      setIsLoading(false);
    }
  }, [deviceId, input, isLoading, upsertAssistantMessage]);

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

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });

        setIsLoading(true);
        try {
          const res = await fetch(`${API_BASE}/api/ai/stt`, {
            method: "POST",
            headers: { "Content-Type": "audio/webm" },
            body: audioBlob,
          });
          const data = (await res.json().catch(() => ({}))) as { text?: string };
          if (data.text) setInput(data.text);
        } catch (err) {
          console.error("STT error:", err);
        } finally {
          setIsLoading(false);
        }
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
    } catch {
      window.alert("Microphone access denied");
    }
  }, [isRecording]);

  const handleRealtimeEvent = useCallback(
    (event: unknown) => {
      if (!event || typeof event !== "object" || !("type" in event)) return;

      const payload = event as Record<string, unknown>;
      const type = String(payload.type || "");

      if (type === "conversation.item.input_audio_transcription.completed") {
        const transcript = String(payload.transcript || "").trim();
        if (transcript) appendMessage("user", transcript);
        return;
      }

      if (type === "response.audio_transcript.delta") {
        const delta = String(payload.delta || "");
        if (!delta) return;

        let assistantId = callAssistantMessageIdRef.current;
        if (!assistantId) {
          assistantId = appendMessage("assistant", delta);
          callAssistantMessageIdRef.current = assistantId;
          return;
        }

        const existing =
          messagesRef.current.find((msg) => msg.id === assistantId)?.content || "";
        upsertAssistantMessage(assistantId, existing + delta);
        return;
      }

      if (type === "response.audio_transcript.done") {
        callAssistantMessageIdRef.current = null;
        return;
      }

      if (type === "error") {
        const errorMessage =
          typeof payload.error === "object" && payload.error && "message" in payload.error
            ? String((payload.error as { message?: unknown }).message || "Realtime error")
            : "Realtime error";
        appendMessage("assistant", `❌ ${errorMessage}`);
      }
    },
    [appendMessage, upsertAssistantMessage]
  );

  const endCall = useCallback(
    (withMessage = true) => {
      cleanupRealtimeResources();
      setIsOnCall(false);
      setIsConnectingCall(false);
      setCallDuration(0);
      setCallStatus("Call ended");
      if (withMessage) {
        appendMessage(
          "assistant",
          "📞 Call ended. You can send your next tech question in chat."
        );
      }
    },
    [appendMessage, cleanupRealtimeResources]
  );

  const startRealtimeCall = useCallback(async () => {
    if (isOnCall || isConnectingCall) return;

    setIsConnectingCall(true);
    setCallStatus("Connecting to realtime agent...");

    try {
      const localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      localStreamRef.current = localStream;

      const peerConnection = new RTCPeerConnection();
      peerConnectionRef.current = peerConnection;

      const remoteAudio = new Audio();
      remoteAudio.autoplay = true;
      remoteAudioRef.current = remoteAudio;

      localStream.getTracks().forEach((track) => peerConnection.addTrack(track, localStream));
      peerConnection.ontrack = (event) => {
        remoteAudio.srcObject = event.streams[0];
        void remoteAudio.play().catch(() => {});
      };

      const dataChannel = peerConnection.createDataChannel("oai-events");
      dataChannelRef.current = dataChannel;
      dataChannel.onmessage = (event) => {
        try {
          handleRealtimeEvent(JSON.parse(event.data));
        } catch (err) {
          console.error("Realtime event parse error:", err);
        }
      };

      const offer = await peerConnection.createOffer({
        offerToReceiveAudio: true,
      });
      await peerConnection.setLocalDescription(offer);

      const localSdp = peerConnection.localDescription?.sdp;
      if (!localSdp || !localSdp.includes("v=")) {
        throw new Error("Realtime offer could not be created");
      }

      const response = await fetch(`${API_BASE}/api/ai/realtime/session`, {
        method: "POST",
        headers: { "Content-Type": "application/sdp" },
        body: localSdp,
      });

      const rawResponse = await response.text();
      if (!response.ok) {
        let message = rawResponse || "Could not start realtime call";
        try {
          const parsed = JSON.parse(rawResponse) as { error?: string; details?: string };
          message = parsed.details || parsed.error || message;
        } catch {
          // Keep plain-text error bodies as-is.
        }
        throw new Error(message);
      }

      await peerConnection.setRemoteDescription({
        type: "answer",
        sdp: rawResponse,
      });

      dataChannel.onopen = () => {
        setIsOnCall(true);
        setIsConnectingCall(false);
        setCallDuration(0);
        setCallStatus("Live realtime tech call connected");
        stopCallTimer();
        callTimerRef.current = setInterval(() => {
          setCallDuration((prev) => prev + 1);
        }, 1000);

        appendMessage(
          "assistant",
          "📞 Realtime voice call connected. The agent will introduce itself and is ready for your tech questions."
        );

        dataChannel.send(
          JSON.stringify({
            type: "response.create",
            response: {
              instructions:
                "Introduce yourself briefly right now in English only. Say you are Vebx Tech Agent, mention that you only help with technology-related topics, and then invite the user to ask one tech question. Do not use Urdu, Hindi, Arabic, or any other language unless the user explicitly asks for it.",
            },
          })
        );
      };

      dataChannel.onclose = () => {
        if (peerConnectionRef.current || localStreamRef.current) {
          endCall(false);
        }
      };
    } catch (err) {
      console.error("Realtime call error:", err);
      cleanupRealtimeResources();
      setIsConnectingCall(false);
      setIsOnCall(false);
      setCallDuration(0);
      setCallStatus("Call connection failed");
      appendMessage(
        "assistant",
        `❌ ${err instanceof Error ? err.message : "Realtime call could not be started"}`
      );
    }
  }, [
    appendMessage,
    cleanupRealtimeResources,
    endCall,
    handleRealtimeEvent,
    isConnectingCall,
    isOnCall,
    stopCallTimer,
  ]);

  const toggleCall = useCallback(async () => {
    if (isOnCall || isConnectingCall) {
      endCall();
      return;
    }

    await startRealtimeCall();
  }, [endCall, isConnectingCall, isOnCall, startRealtimeCall]);

  const formatTime = (seconds: number) =>
    `${Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;

  return (
    <PageLayout>
      <SeoHead
        title="Vebx Tech Agent — AI Chat & Realtime Call"
        description="Chat or talk live with Vebx Tech Agent for technology-related guidance on software, apps, web development, AI, and digital product engineering."
        canonicalPath="/ai"
      />

      <section className="relative min-h-[40vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/15 via-background to-background" />
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/3 h-[500px] w-[500px] rounded-full bg-primary/8 blur-[150px] animate-pulse" />
          <div className="absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-primary/5 blur-[120px] animate-pulse delay-1000" />
        </div>
        <div className="container relative z-10 py-16 text-center">
          <div className="liquid-glass border-glow mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">OpenAI Realtime Tech Agent</span>
          </div>
          <h1 className="font-display mb-4 text-4xl font-bold text-foreground md:text-6xl">
            Vebx <span className="text-gradient-red">Tech Agent</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Get help with software, apps, AI, APIs, cloud, and digital product engineering through chat
            or a live call.
          </p>
        </div>
      </section>

      <section className="container -mt-4 scroll-mt-28 px-4 pb-20 lg:px-8">
        <div className="mx-auto grid max-w-5xl items-start gap-6 lg:grid-cols-[1fr_300px]">
          <div
            className="liquid-glass border-glow flex flex-col overflow-hidden rounded-2xl lg:sticky lg:top-24"
            style={{ height: "min(78vh, 860px)" }}
          >
            <div className="flex items-center gap-3 border-b border-white/10 px-5 py-3">
              <div className="gradient-red flex h-9 w-9 items-center justify-center rounded-full">
                <Bot className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-display text-sm font-semibold text-foreground">Vebx Tech Agent</h3>
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
                  </span>
                  <span className="text-[10px] font-medium text-green-400">Tech-only assistance</span>
                </div>
              </div>
            </div>

            <div ref={chatScrollRef} className="flex-1 space-y-4 overflow-y-auto p-5">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="gradient-red mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full">
                      <Bot className="h-3.5 w-3.5 text-primary-foreground" />
                    </div>
                  )}

                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm ${
                      msg.role === "user"
                        ? "gradient-red rounded-br-md text-primary-foreground"
                        : "liquid-glass border-glow rounded-bl-md text-foreground"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <div className="max-w-none whitespace-pre-wrap leading-6">{msg.content || "..."}</div>
                    ) : (
                      <p>{msg.content}</p>
                    )}
                  </div>

                  {msg.role === "user" && (
                    <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10">
                      <User className="h-3.5 w-3.5 text-foreground" />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-3">
                  <div className="gradient-red flex h-7 w-7 shrink-0 items-center justify-center rounded-full">
                    <Bot className="h-3.5 w-3.5 text-primary-foreground" />
                  </div>
                  <div className="liquid-glass border-glow rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <span
                        className="h-2 w-2 animate-bounce rounded-full bg-primary/60"
                        style={{ animationDelay: "0ms" }}
                      />
                      <span
                        className="h-2 w-2 animate-bounce rounded-full bg-primary/60"
                        style={{ animationDelay: "150ms" }}
                      />
                      <span
                        className="h-2 w-2 animate-bounce rounded-full bg-primary/60"
                        style={{ animationDelay: "300ms" }}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            <div className="border-t border-white/10 p-4">
              <div className="flex gap-2">
                <button
                  onClick={toggleRecording}
                  className={`rounded-xl p-3 transition-all ${
                    isRecording
                      ? "gradient-red animate-pulse text-primary-foreground"
                      : "liquid-glass border-glow text-muted-foreground hover:text-foreground"
                  }`}
                  title={isRecording ? "Stop recording" : "Voice input"}
                >
                  {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </button>

                <input
                  type="text"
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      void sendMessage();
                    }
                  }}
                  placeholder="Ask a tech question, such as API design, React, AI, or cloud..."
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  disabled={isLoading}
                />

                <Button
                  onClick={() => void sendMessage()}
                  disabled={!input.trim() || isLoading}
                  variant="hero"
                  size="icon"
                  className="h-12 w-12 rounded-xl"
                >
                  {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                </Button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 lg:sticky lg:top-24">
            <div className="liquid-glass border-glow rounded-2xl p-6 text-center">
              <h3 className="font-display mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Realtime Voice Call
              </h3>

              {(isOnCall || isConnectingCall) && (
                <div className="mb-4">
                  <p className="font-mono text-2xl font-bold tabular-nums text-primary">
                    {formatTime(callDuration)}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{callStatus}</p>
                </div>
              )}

              {!isOnCall && !isConnectingCall && (
                <p className="mb-4 text-xs text-muted-foreground">{callStatus}</p>
              )}

              <button
                onClick={() => void toggleCall()}
                className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full transition-all duration-300 ${
                  isOnCall
                    ? "animate-pulse bg-red-600 shadow-[0_0_30px_rgba(220,38,38,0.5)] hover:bg-red-700"
                    : isConnectingCall
                      ? "cursor-wait bg-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.45)]"
                      : "gradient-red glow-red hover:scale-110"
                }`}
                disabled={isConnectingCall}
              >
                {isOnCall ? (
                  <PhoneOff className="h-7 w-7 text-white" />
                ) : isConnectingCall ? (
                  <Loader2 className="h-7 w-7 animate-spin text-white" />
                ) : (
                  <Phone className="h-7 w-7 text-primary-foreground" />
                )}
              </button>

              <p className="mt-3 text-xs text-muted-foreground">
                {isOnCall ? "Tap to end call" : "Start realtime call"}
              </p>
            </div>

            <div className="liquid-glass border-glow rounded-2xl p-6">
              <h3 className="font-display mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Agent Capabilities
              </h3>
              <ul className="space-y-3 text-sm text-foreground/80">
                <li className="flex items-start gap-2">
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>Web, app, backend, and AI engineering guidance</span>
                </li>
                <li className="flex items-start gap-2">
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>Architecture, APIs, databases, and cloud recommendations</span>
                </li>
                <li className="flex items-start gap-2">
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>Debugging, performance, scalability, and security advice</span>
                </li>
                <li className="flex items-start gap-2">
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>Digital product UX for technical workflows</span>
                </li>
                <li className="flex items-start gap-2">
                  <Volume2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>Realtime voice interaction with intro on call start</span>
                </li>
              </ul>
            </div>

            <div className="liquid-glass border-glow rounded-2xl p-5">
              <h3 className="font-display mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Quick Prompts
              </h3>
              <div className="space-y-2">
                {QUICK_PROMPTS.map((question) => (
                  <button
                    key={question}
                    onClick={() => setInput(question)}
                    className="w-full rounded-lg border border-white/5 px-3 py-2 text-left text-xs text-foreground/70 transition-colors hover:bg-white/5 hover:text-foreground"
                  >
                    {question}
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
