/**
 * Gemini Nano Banana (image generation) via REST API.
 * @see https://ai.google.dev/gemini-api/docs/image-generation
 */

const GEMINI_MODEL = process.env.GEMINI_IMAGE_MODEL || "gemini-2.5-flash-image";
const API_BASE = "https://generativelanguage.googleapis.com/v1beta";

export async function generateImage(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set");
  }

  const url = `${API_BASE}/models/${GEMINI_MODEL}:generateContent`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        responseModalities: ["IMAGE"],
      },
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini API error ${res.status}: ${errText}`);
  }

  const data = await res.json();
  const parts = data?.candidates?.[0]?.content?.parts;
  if (!parts?.length) {
    throw new Error("No image in Gemini response");
  }

  for (const part of parts) {
    if (part.inlineData?.data) {
      return Buffer.from(part.inlineData.data, "base64");
    }
  }

  throw new Error("No image data in response");
}
