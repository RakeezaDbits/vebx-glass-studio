/**
 * OpenAI image generation (DALL-E 2) — lower cost than DALL-E 3.
 * Uses OPEN_API_KEY from env.
 * @see https://platform.openai.com/docs/guides/image-generation
 */

const OPENAI_API_KEY = process.env.OPEN_API_KEY || process.env.OPENAI_API_KEY;
const MODEL = "dall-e-2";
const SIZE = "512x512"; // smaller = fewer credits/cost

/** Restrict to website/app design only — no other image types. */
const DESIGN_ONLY_PREFIX =
  "Professional UI/UX design reference for a website or mobile app only. Clean, modern layout mockup or wireframe style. Must be design-related for web or app. ";

export async function generateImage(prompt) {
  if (!OPENAI_API_KEY) {
    throw new Error("OPEN_API_KEY is not set");
  }

  const userPrompt = (prompt || "").trim().slice(0, 900);
  const fullPrompt = DESIGN_ONLY_PREFIX + (userPrompt || "modern landing page design");

  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      prompt: fullPrompt.slice(0, 1000),
      n: 1,
      size: SIZE,
      response_format: "b64_json",
    }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    let msg = `OpenAI API error ${res.status}`;
    try {
      const j = JSON.parse(errBody);
      if (j.error?.message) msg = j.error.message;
    } catch (_) {
      if (errBody) msg += `: ${errBody.slice(0, 200)}`;
    }
    throw new Error(msg);
  }

  const data = await res.json();
  const b64 = data?.data?.[0]?.b64_json;
  if (!b64) {
    throw new Error("No image data in OpenAI response");
  }

  return Buffer.from(b64, "base64");
}
