# AI Chatbot (Design idea) + Nano Banana image generation

## Overview

- **Design idea** floating chat: user types a prompt (e.g. “Website with liquid glass theme, dark background, red accents”). AI generates an image via **Gemini Nano Banana** (image generation API).
- **Credits**: Device-based limit (e.g. 5 generations per device per day). No login required; fingerprint stored in `localStorage`.
- **Image protection**: Images are served inline only (`Content-Disposition: inline`), no download link. Right-click and drag disabled in UI. Screenshots cannot be fully blocked by the app.
- **Get a Quote**: User can click “Use in Get a Quote” so the generated image is attached to the Custom Requirement form. The image is sent as a **reference** (stored by ref on server); user does not download it.

## Backend

- **Routes**: `server/routes/chat.js`
  - `GET /api/chat/credits?deviceId=...` – remaining credits for device
  - `POST /api/chat/generate-image` – body: `{ prompt, deviceId }` → calls Gemini, saves image under `server/generated/<ref>.png`, returns `{ ref, creditsLeft, limit }`
  - `GET /api/chat/generated-image/:ref` – serves image (inline only, no download)
- **Gemini**: `server/utils/gemini-image.js` – REST call to `gemini-2.5-flash-image` (or `GEMINI_IMAGE_MODEL`). Needs `GEMINI_API_KEY` in env.
- **DB**:
  - `device_credits` – (device_id, period_start, credits_used) for daily limit
  - `ai_generated_images` – (ref, file_path, device_id)
  - `quote_submissions.reference_image_ref` – optional ref linking quote to an AI-generated image

## Env (server)

```env
GEMINI_API_KEY=your_key
GEMINI_IMAGE_MODEL=gemini-2.5-flash-image
AI_CHAT_DAILY_CREDITS=5
```

## Migration (existing DB)

Run once:

```bash
mysql -u root -p vebx_studio < server/sql/migration-ai-chat.sql
```

If `reference_image_ref` already exists (e.g. from fresh schema), skip or comment out the `ALTER TABLE quote_submissions ...` line.

## Frontend

- **AIChatbot** (`src/components/AIChatbot.tsx`): Floating button → panel with prompt input, “Generate”, then image + “Use in Get a Quote”. Device ID from `src/lib/deviceId.ts` (hash of UA, language, screen, TZ).
- **Custom Requirement**: Step 4 reads `getStoredAIQuoteRef()`; if set, shows “AI reference image attached” and sends `referenceImageRef` with the quote. After submit, ref is cleared.

## Flow: image → quote

1. User opens Design idea chat, enters prompt, gets image.
2. User clicks “Use in Get a Quote” → ref saved in `localStorage`.
3. User goes to Custom Requirement, fills steps 1–4. On step 4 they see “AI reference image attached”.
4. On submit, payload includes `referenceImageRef`; backend stores it in `quote_submissions.reference_image_ref`.
5. Admin in Quotes sees “AI image” link and can open `/api/chat/generated-image/<ref>` to view the reference.

## References

- [Gemini API – Image generation (Nano Banana)](https://ai.google.dev/gemini-api/docs/image-generation)
