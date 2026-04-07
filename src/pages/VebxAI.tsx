import { useState, useRef, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";
import PageLayout from "@/components/PageLayout";
import SeoHead from "@/components/SeoHead";
import { Button } from "@/components/ui/button";
import { Send, Mic, MicOff, Image as ImageIcon, Volume2, Loader2, Bot, User, Sparkles, Download, StopCircle } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "";

type Message = {
  role: "user" | "assistant";
  content: string;
  imageData?: string;
};

type TabType = "chat" | "image" | "voice";

export default function VebxAI() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>("chat");
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "👋 Hi! I'm **VebxRun AI** — your digital design & development assistant. Ask me anything about web development, app design, branding, or get AI-generated images!" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [imagePrompt, setImagePrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [ttsText, setTtsText] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

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

  // ─── Image Generation ───
  const generateImage = useCallback(async () => {
    if (!imagePrompt.trim() || isLoading) return;
    setIsLoading(true);
    setGeneratedImage(null);

    try {
      const res = await fetch(`${API_BASE}/api/ai/generate-image`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceId, prompt: imagePrompt.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Image generation failed");
      setGeneratedImage(data.imageData);
    } catch (err: any) {
      setGeneratedImage(null);
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [imagePrompt, isLoading, deviceId]);

  // ─── Text to Speech ───
  const speakText = useCallback(async () => {
    if (!ttsText.trim() || isSpeaking) return;
    setIsSpeaking(true);

    try {
      const res = await fetch(`${API_BASE}/api/ai/tts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: ttsText.trim(), voice: "nova" }),
      });
      if (!res.ok) throw new Error("TTS failed");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(url);
      };
      audio.play();
    } catch (err: any) {
      setIsSpeaking(false);
      alert(err.message);
    }
  }, [ttsText, isSpeaking]);

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

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: "chat", label: "AI Chat", icon: <Bot className="w-4 h-4" /> },
    { id: "image", label: "Image Gen", icon: <ImageIcon className="w-4 h-4" /> },
    { id: "voice", label: "Voice", icon: <Volume2 className="w-4 h-4" /> },
  ];

  return (
    <PageLayout>
      <SeoHead
        title="VebxRun AI — Smart Design & Dev Assistant"
        description="Chat with AI, generate images, and use voice features powered by VebxRun AI."
        path="/ai"
      />

      {/* Hero Banner */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-background to-background" />
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-[100px] animate-pulse delay-700" />
        </div>
        <div className="container relative z-10 text-center py-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full liquid-glass border-glow mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Powered by AI</span>
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-4 text-foreground">
            VebxRun <span className="text-primary">AI</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Chat with our AI assistant, generate stunning images, and use voice features — all in one place.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="container px-4 lg:px-8 pb-20 -mt-8">
        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex liquid-glass rounded-2xl border-glow p-1.5 gap-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-display text-sm uppercase tracking-wider transition-all duration-300 ${
                  activeTab === tab.id
                    ? "gradient-red text-primary-foreground glow-red"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Tab */}
        {activeTab === "chat" && (
          <div className="max-w-4xl mx-auto">
            <div className="liquid-glass rounded-2xl border-glow overflow-hidden">
              {/* Messages */}
              <div className="h-[500px] overflow-y-auto p-6 space-y-4">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    {msg.role === "assistant" && (
                      <div className="w-8 h-8 rounded-full gradient-red flex items-center justify-center shrink-0">
                        <Bot className="w-4 h-4 text-primary-foreground" />
                      </div>
                    )}
                    <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm ${
                      msg.role === "user"
                        ? "gradient-red text-primary-foreground"
                        : "liquid-glass border-glow text-foreground"
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
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                        <User className="w-4 h-4 text-foreground" />
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full gradient-red flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <div className="liquid-glass border-glow rounded-2xl px-4 py-3">
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
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
                    placeholder="Ask VebxRun AI anything..."
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
          </div>
        )}

        {/* Image Generation Tab */}
        {activeTab === "image" && (
          <div className="max-w-4xl mx-auto">
            <div className="liquid-glass rounded-2xl border-glow p-8">
              <h2 className="font-display text-2xl font-bold text-foreground mb-2">AI Image Generator</h2>
              <p className="text-muted-foreground text-sm mb-6">
                Describe any image and our AI will create it for you. Uses daily credits.
              </p>

              <div className="flex gap-3 mb-6">
                <input
                  type="text"
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && generateImage()}
                  placeholder="A futuristic city skyline with neon lights..."
                  className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  disabled={isLoading}
                />
                <Button
                  onClick={generateImage}
                  disabled={!imagePrompt.trim() || isLoading}
                  variant="hero"
                  className="px-6"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><ImageIcon className="w-5 h-5" /> Generate</>}
                </Button>
              </div>

              {/* Generated Image */}
              {generatedImage && (
                <div className="relative rounded-2xl overflow-hidden border border-white/10">
                  <img src={generatedImage} alt="AI Generated" className="w-full h-auto" />
                  <a
                    href={generatedImage}
                    download="vebxrun-ai-image.png"
                    className="absolute bottom-4 right-4 p-3 rounded-xl gradient-red text-primary-foreground hover:scale-105 transition-transform"
                  >
                    <Download className="w-5 h-5" />
                  </a>
                </div>
              )}

              {!generatedImage && !isLoading && (
                <div className="h-64 rounded-2xl border border-dashed border-white/20 flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">Your generated image will appear here</p>
                  </div>
                </div>
              )}

              {isLoading && !generatedImage && (
                <div className="h-64 rounded-2xl border border-white/10 flex items-center justify-center liquid-glass">
                  <div className="text-center">
                    <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">Generating your image...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Voice Tab */}
        {activeTab === "voice" && (
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
            {/* Text to Speech */}
            <div className="liquid-glass rounded-2xl border-glow p-8">
              <h2 className="font-display text-xl font-bold text-foreground mb-2 flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-primary" /> Text to Speech
              </h2>
              <p className="text-muted-foreground text-sm mb-4">Type text and hear it spoken by AI.</p>
              <textarea
                value={ttsText}
                onChange={(e) => setTtsText(e.target.value)}
                placeholder="Enter text to convert to speech..."
                className="w-full h-32 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none mb-4"
              />
              <Button
                onClick={speakText}
                disabled={!ttsText.trim() || isSpeaking}
                variant="hero"
                className="w-full"
              >
                {isSpeaking ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Speaking...</>
                ) : (
                  <><Volume2 className="w-5 h-5" /> Speak</>
                )}
              </Button>
            </div>

            {/* Speech to Text */}
            <div className="liquid-glass rounded-2xl border-glow p-8">
              <h2 className="font-display text-xl font-bold text-foreground mb-2 flex items-center gap-2">
                <Mic className="w-5 h-5 text-primary" /> Speech to Text
              </h2>
              <p className="text-muted-foreground text-sm mb-4">Record your voice and convert to text.</p>
              
              <div className="flex flex-col items-center gap-6 py-6">
                <button
                  onClick={toggleRecording}
                  className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isRecording
                      ? "gradient-red glow-red animate-pulse"
                      : "liquid-glass border-glow hover:bg-white/10"
                  }`}
                >
                  {isRecording ? (
                    <StopCircle className="w-10 h-10 text-primary-foreground" />
                  ) : (
                    <Mic className="w-10 h-10 text-primary" />
                  )}
                </button>
                <p className="text-sm text-muted-foreground">
                  {isRecording ? "Recording... tap to stop" : "Tap to start recording"}
                </p>
                {isLoading && (
                  <div className="flex items-center gap-2 text-primary text-sm">
                    <Loader2 className="w-4 h-4 animate-spin" /> Processing audio...
                  </div>
                )}
              </div>

              {input && (
                <div className="liquid-glass border-glow rounded-xl p-4">
                  <p className="text-xs text-muted-foreground mb-1">Transcribed text:</p>
                  <p className="text-sm text-foreground">{input}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </section>
    </PageLayout>
  );
}
