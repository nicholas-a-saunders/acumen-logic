# Rantify

Implementation of the **Rantify Complete Blueprint (February 2026)** in this repo.

## What is included

- `backend/`: Node.js + Express API with WebSocket rant streaming pipeline.
- `ios/Rantify/`: Native SwiftUI iOS app structure with the core rant flow and major screens.
- `infra/firebase/`: Firestore rules and indexes.
- `docs/`: Implementation status and handoff notes.

## Backend highlights

- Authenticated REST API (`/v1/me`, `/v1/history`, `/v1/leaderboards`, `/v1/leagues`).
- WebSocket rant pipeline at `/v1/rant-stream`:
  - receives in-memory audio chunks
  - transcribes with Whisper
  - scores + moderates with GPT-4o-mini JSON output
  - applies profanity + duration penalties
  - persists score metadata only (never audio/transcript)
- Moderation strike system with escalating consequences.
- Server-side daily rant limits for free/premium tiers.

## iOS highlights

- SwiftUI tab app with:
  - Home hold-to-rant interaction
  - score reveal screen with radar chart
  - leaderboards
  - rant history
  - leagues
  - profile/stats
- In-memory microphone capture via `AVAudioEngine`.
- WebSocket streaming client for rant sessions.
- REST API client + Firebase-auth-aware headers.

## Quick start

### 1) Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

### 2) iOS

Generate/open the Xcode project via XcodeGen:

```bash
cd ios/Rantify
brew install xcodegen
xcodegen generate
open Rantify.xcodeproj
```

## Environment variables (backend)

See `backend/.env.example`.

You must provide:

- Firebase Admin credentials
- `OPENAI_API_KEY`

## Privacy model implemented

- Audio bytes are kept in memory only, never written to disk.
- Transcript is used only in-process for scoring and not persisted.
- Stored fields are score metadata only.

## Notes

- See `docs/IMPLEMENTATION_STATUS.md` for what is complete vs what still requires manual setup/external services.
