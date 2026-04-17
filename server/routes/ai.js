import express from "express";
import db from "../config/db.js";
import crypto from "crypto";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const GENERATED_DIR = path.join(__dirname, "..", "generated");

const OPENAI_API_KEY = process.env.OPEN_API_KEY || process.env.OPENAI_API_KEY;
const DAILY_CREDITS = parseInt(process.env.AI_CHAT_DAILY_CREDITS || "5", 10);
const CHAT_MODEL = process.env.OPENAI_CHAT_MODEL || "gpt-4o-mini";
const REALTIME_MODEL = process.env.OPENAI_REALTIME_MODEL || "gpt-realtime";
const REALTIME_VOICE = process.env.OPENAI_REALTIME_VOICE || "marin";

function getTechOnlyInstructions(mode = "chat") {
  const shared = `You are VXR Tech Agent for vebx.run.
You only help with technology-related topics such as software development, websites, mobile apps, AI, SaaS, APIs, cloud, product UX for digital products, debugging, architecture, performance, security, databases, DevOps, and technical project planning.
If a user asks about non-technical topics, politely refuse in one short sentence and redirect them to ask a technology-related question instead.
Keep answers practical, concise, and professional.
If pricing, hiring, or project inquiry comes up, briefly guide them to /pricing or /contact.
Always respond in English by default unless the user explicitly asks for another language.
Do not switch languages on your own because of the user's name, accent, browser locale, region, or detected language.
Do not claim abilities you do not have.`;

  if (mode === "voice") {
    return `${shared}
Speak naturally and clearly.
When the call begins, your first spoken reply must be exactly this one sentence in English and nothing else — no extra words before or after: "Hello, I am VXR Agent. How can I help you?"
After that greeting, follow the rules above for all further turns.
Do not use Urdu, Hindi, Arabic, or any other language for that opening line unless the user explicitly asks for it.
Keep spoken replies short unless the user asks for detail.`;
  }

  return `${shared}
Use markdown when useful.`;
}

function ensureGeneratedDir() {
  if (!fs.existsSync(GENERATED_DIR)) fs.mkdirSync(GENERATED_DIR, { recursive: true });
}

// ─── Helper: check & consume credit ───
async function consumeCredit(deviceId) {
  const today = new Date().toISOString().slice(0, 10);
  await db.execute(
    "INSERT INTO device_credits (device_id, period_start, credits_used) VALUES (?, ?, 0) ON DUPLICATE KEY UPDATE device_id = device_id",
    [deviceId, today]
  );
  const [rows] = await db.execute(
    "SELECT credits_used FROM device_credits WHERE device_id = ? AND period_start = ?",
    [deviceId, today]
  );
  const used = rows[0] ? rows[0].credits_used : 0;
  if (used >= DAILY_CREDITS) {
    return { allowed: false, remaining: 0 };
  }
  await db.execute(
    "UPDATE device_credits SET credits_used = credits_used + 1 WHERE device_id = ? AND period_start = ?",
    [deviceId, today]
  );
  return { allowed: true, remaining: DAILY_CREDITS - used - 1 };
}

// ─── 1. AI Text Chat (Streaming) ───
router.post("/chat", async (req, res) => {
  try {
    if (!OPENAI_API_KEY) return res.status(500).json({ error: "AI API key not configured" });

    const deviceId = (req.body?.deviceId || "").toString().slice(0, 64);
    const messages = req.body?.messages;
    const useCredits = req.body?.useCredits !== false;

    if (!deviceId) return res.status(400).json({ error: "deviceId required" });
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "messages required" });
    }

    // Optional credit check
    if (useCredits) {
      const credit = await consumeCredit(deviceId);
      if (!credit.allowed) {
        return res.status(402).json({ error: "No credits left", remaining: 0, limit: DAILY_CREDITS });
      }
    }

    const systemPrompt = {
      role: "system",
      content: getTechOnlyInstructions("chat"),
    };

    // Stream response from OpenAI
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: CHAT_MODEL,
        messages: [systemPrompt, ...messages.slice(-20)],
        stream: true,
        max_tokens: 1024,
        temperature: 0.7,
      }),
    });

    if (!openaiRes.ok) {
      const errText = await openaiRes.text();
      console.error("OpenAI chat error:", openaiRes.status, errText);
      return res.status(500).json({ error: "AI service error" });
    }

    // SSE streaming
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("Access-Control-Allow-Origin", "*");

    const reader = openaiRes.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

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
        if (jsonStr === "[DONE]") {
          res.write("data: [DONE]\n\n");
          continue;
        }
        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) {
            res.write(`data: ${JSON.stringify({ content })}\n\n`);
          }
        } catch { /* partial json, skip */ }
      }
    }

    res.end();
  } catch (err) {
    console.error("AI chat error:", err);
    if (!res.headersSent) {
      res.status(500).json({ error: err.message || "AI chat failed" });
    }
  }
});

// ─── 2. Text-to-Speech (TTS) ───
router.post("/tts", async (req, res) => {
  try {
    if (!OPENAI_API_KEY) return res.status(500).json({ error: "AI API key not configured" });

    const text = (req.body?.text || "").toString().trim().slice(0, 4096);
    const voice = req.body?.voice || "alloy"; // alloy, echo, fable, onyx, nova, shimmer
    
    if (!text) return res.status(400).json({ error: "text required" });

    const openaiRes = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "tts-1",
        input: text,
        voice,
        response_format: "mp3",
      }),
    });

    if (!openaiRes.ok) {
      const errText = await openaiRes.text();
      console.error("TTS error:", openaiRes.status, errText);
      return res.status(500).json({ error: "TTS failed" });
    }

    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Access-Control-Allow-Origin", "*");
    
    const audioBuffer = await openaiRes.arrayBuffer();
    res.send(Buffer.from(audioBuffer));
  } catch (err) {
    console.error("TTS error:", err);
    res.status(500).json({ error: err.message || "TTS failed" });
  }
});

// ─── 3. Speech-to-Text (STT / Whisper) ───
router.post("/stt", async (req, res) => {
  try {
    if (!OPENAI_API_KEY) return res.status(500).json({ error: "AI API key not configured" });

    // Expect raw audio in body (wav/webm/mp3)
    const contentType = req.headers["content-type"] || "audio/webm";
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const audioBuffer = Buffer.concat(chunks);

    if (audioBuffer.length < 100) {
      return res.status(400).json({ error: "No audio data received" });
    }

    const ext = contentType.includes("wav") ? "wav" : contentType.includes("mp3") ? "mp3" : "webm";
    
    // Use FormData for OpenAI Whisper
    const formData = new FormData();
    const blob = new Blob([audioBuffer], { type: contentType });
    formData.append("file", blob, `audio.${ext}`);
    formData.append("model", "whisper-1");
    formData.append("language", "en");

    const openaiRes = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: formData,
    });

    if (!openaiRes.ok) {
      const errText = await openaiRes.text();
      console.error("STT error:", openaiRes.status, errText);
      return res.status(500).json({ error: "Speech recognition failed" });
    }

    const data = await openaiRes.json();
    res.json({ text: data.text || "" });
  } catch (err) {
    console.error("STT error:", err);
    res.status(500).json({ error: err.message || "STT failed" });
  }
});

// ─── 4. Realtime Call Session (WebRTC) ───
router.post("/realtime/session", express.text({ type: ["application/sdp", "text/plain"] }), async (req, res) => {
  try {
    if (!OPENAI_API_KEY) return res.status(500).json({ error: "AI API key not configured" });

    const sdp = typeof req.body === "string" ? req.body : (req.body || "").toString();
    if (!sdp || !sdp.includes("v=")) return res.status(400).json({ error: "SDP offer required" });

    const sessionConfig = {
      type: "realtime",
      model: REALTIME_MODEL,
      instructions: getTechOnlyInstructions("voice"),
      output_modalities: ["audio"],
      audio: {
        input: {
          turn_detection: {
            type: "server_vad",
            create_response: true,
            interrupt_response: true,
            silence_duration_ms: 450,
            prefix_padding_ms: 300,
          },
        },
        output: {
          voice: REALTIME_VOICE,
        },
      },
    };

    const formData = new FormData();
    formData.set("sdp", sdp);
    formData.set("session", JSON.stringify(sessionConfig));

    const openaiRes = await fetch("https://api.openai.com/v1/realtime/calls", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: formData,
    });

    const answerSdp = await openaiRes.text();
    if (!openaiRes.ok) {
      console.error("Realtime session error:", openaiRes.status, answerSdp);
      let details = answerSdp;
      try {
        const parsed = JSON.parse(answerSdp);
        details = parsed?.error?.message || parsed?.error || answerSdp;
      } catch {
        // Keep non-JSON upstream bodies as-is.
      }
      return res.status(openaiRes.status).json({
        error: "Realtime session failed",
        details,
      });
    }

    const location = openaiRes.headers.get("location");
    if (location) res.setHeader("X-Realtime-Call-Location", location);
    res.setHeader("Content-Type", "application/sdp");
    res.send(answerSdp);
  } catch (err) {
    console.error("Realtime session error:", err);
    res.status(500).json({ error: err.message || "Realtime session failed" });
  }
});

// ─── 5. Image Generation (DALL-E 3 upgrade) ───
router.post("/generate-image", async (req, res) => {
  try {
    if (!OPENAI_API_KEY) return res.status(500).json({ error: "AI API key not configured" });

    const deviceId = (req.body?.deviceId || "").toString().slice(0, 64);
    const prompt = (req.body?.prompt || "").toString().trim().slice(0, 1000);
    const size = req.body?.size || "1024x1024"; // 1024x1024, 1024x1792, 1792x1024

    if (!deviceId) return res.status(400).json({ error: "deviceId required" });
    if (!prompt) return res.status(400).json({ error: "prompt required" });

    const credit = await consumeCredit(deviceId);
    if (!credit.allowed) {
      return res.status(402).json({ error: "No credits left", remaining: 0, limit: DAILY_CREDITS });
    }

    const openaiRes = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt,
        n: 1,
        size,
        quality: "standard",
        response_format: "b64_json",
      }),
    });

    if (!openaiRes.ok) {
      const errText = await openaiRes.text();
      console.error("Image gen error:", openaiRes.status, errText);
      let msg = "Image generation failed";
      try {
        const j = JSON.parse(errText);
        if (j.error?.message) msg = j.error.message;
      } catch {}
      return res.status(500).json({ error: msg });
    }

    const data = await openaiRes.json();
    const b64 = data?.data?.[0]?.b64_json;
    if (!b64) return res.status(500).json({ error: "No image in response" });

    // Save to disk
    ensureGeneratedDir();
    const ref = crypto.randomBytes(12).toString("hex");
    const filePath = path.join(GENERATED_DIR, `${ref}.png`);
    fs.writeFileSync(filePath, Buffer.from(b64, "base64"));

    await db.execute(
      "INSERT INTO ai_generated_images (ref, file_path, device_id) VALUES (?, ?, ?)",
      [ref, `${ref}.png`, deviceId]
    ).catch(() => {});

    res.json({
      imageData: `data:image/png;base64,${b64}`,
      ref,
      remaining: credit.remaining,
      limit: DAILY_CREDITS,
      revisedPrompt: data?.data?.[0]?.revised_prompt || "",
    });
  } catch (err) {
    console.error("Image gen error:", err);
    res.status(500).json({ error: err.message || "Image generation failed" });
  }
});

// ─── 5. Credits check ───
router.get("/credits", async (req, res) => {
  try {
    const deviceId = (req.query.deviceId || "").toString().slice(0, 64);
    if (!deviceId) return res.json({ remaining: 0, limit: DAILY_CREDITS });
    
    const today = new Date().toISOString().slice(0, 10);
    const [rows] = await db.execute(
      "SELECT credits_used FROM device_credits WHERE device_id = ? AND period_start = ?",
      [deviceId, today]
    );
    const used = rows[0] ? rows[0].credits_used : 0;
    if (rows.length === 0) {
      await db.execute(
        "INSERT INTO device_credits (device_id, period_start, credits_used) VALUES (?, ?, 0)",
        [deviceId, today]
      );
    }
    res.json({ remaining: Math.max(0, DAILY_CREDITS - used), limit: DAILY_CREDITS });
  } catch (err) {
    console.error(err);
    res.status(500).json({ remaining: 0, limit: DAILY_CREDITS });
  }
});

export default router;
