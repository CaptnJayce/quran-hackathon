# Halaq — Claude Code Scaffold
> Online Quran Circle · Hackathon Build · 18 Days

---

## 0. Before You Start — Key Decisions Made

### On security, user data & cost

**Problem:** The hackathon requires at least one User API (Streaks, Bookmarks, Goals, Activity).
Those APIs require an authenticated Quran Foundation user. You *must* have some auth.

**Solution — zero data collected by you:**
- Auth is 100% delegated to Quran Foundation's own login page (OAuth2 PKCE)
- You never see a password. You never store a user's name, email, or profile
- You receive only an opaque `access_token` to call their APIs on behalf of the user
- No custom user table. No personal data in your database. Ever.
- Room/session data in Supabase is **ephemeral** — auto-deleted when a session ends
- The only thing persisted: the Quran Foundation APIs themselves (streaks, bookmarks) — on *their* servers, not yours

**Cost:**
- Quran Foundation APIs — free
- Supabase — free tier (500MB DB, 2GB bandwidth, Realtime included)
- Vercel — free tier (frontend hosting)
- No custom backend server needed at all

**AI used in this build:**
- Quran MCP (mcp.quran.ai) — free, provided by Quran Foundation
  - Semantic search, word-level morphology, tafsir retrieval
  - Used for the "word lens" feature (tap any word → meaning popup)
  - No API key needed, no cost, no rate limit concerns for a hackathon

---

## 1. What You're Building

**Halaq** — a real-time multiplayer Quran reading circle.

```
Host creates room → Friends join via link → Ayahs display one at a time
→ Each person reads in turn → Audio plays after each ayah
→ Tap any word for meaning (MCP word lens)
→ Session ends → Summary card → Streak recorded
```

### Core features (in scope)
- Room creation with shareable invite link
- Turn-based ayah display (Surah or Juz selection)
- Audio recitation playback after each ayah (Audio API)
- Translation toggle per ayah (Translation API)
- Word lens: tap a word → Arabic meaning + transliteration (Quran MCP)
- Session summary: who read how many ayahs, group streak
- Individual streak tracking (Streak API)
- Bookmark where the circle left off (Bookmarks API)
- Points per session, simple badge system (client-side only, no DB)

### Out of scope (post-hackathon)
- Public room discovery
- Buzzer/catch mechanic
- AI tajweed feedback
- Offline mode

---

## 2. Tech Stack

```
Frontend       React + TypeScript + Vite
Real-time      Supabase Realtime (room sync, turn management)
Auth           Quran Foundation OAuth2 PKCE (no custom auth)
Quran data     Quran Foundation JS SDK + REST APIs
AI / Semantic  Quran MCP (mcp.quran.ai) — free, no key needed
Hosting        Netlify (free tier)
```

No Express server. No custom backend. No user database.

---

## 3. Project Structure

```
halaq/
├── .env.local                  # VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY,
│                               # VITE_QF_CLIENT_ID, VITE_QF_REDIRECT_URI
├── .env.example
├── index.html
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
│
├── public/
│   └── fonts/                  # Quran Arabic font (KFGQPC / Uthmanic)
│
└── src/
    ├── main.tsx
    ├── App.tsx                  # Route: /, /room/:id, /summary/:id
    │
    ├── types/
    │   ├── quran.ts             # Ayah, Surah, Translation, Audio types
    │   ├── room.ts              # Room, Participant, TurnState types
    │   └── session.ts          # SessionSummary, ParticipantStats types
    │
    ├── lib/
    │   ├── supabase.ts          # Supabase client init
    │   ├── quranApi.ts          # Quran Foundation SDK wrapper
    │   ├── audioPlayer.ts       # Audio API helper (play, pause, preload next)
    │   └── mcpClient.ts        # Quran MCP fetch wrapper (word lens queries)
    │
    ├── auth/
    │   ├── oauth.ts             # PKCE generation, redirect, callback handling
    │   ├── tokenStore.ts        # access_token in memory only (never localStorage)
    │   └── AuthProvider.tsx     # React context: user identity, login, logout
    │
    ├── hooks/
    │   ├── useRoom.ts           # Subscribe to Supabase Realtime room channel
    │   ├── useTurn.ts           # Who is current reader, advance turn
    │   ├── useAyah.ts           # Fetch current ayah text + translation
    │   ├── useAudio.ts          # Audio playback state, trigger after ayah done
    │   ├── useWordLens.ts       # MCP query on word tap
    │   └── useStreak.ts         # Read/write streak via QF User API
    │
    ├── pages/
    │   ├── Home.tsx             # Landing: login CTA, "Create Room" / "Join Room"
    │   ├── Lobby.tsx            # Pre-session: Surah/Juz selector, participants list
    │   ├── Session.tsx          # Main reading view (see components below)
    │   └── Summary.tsx          # Post-session stats, streak, share card
    │
    ├── components/
    │   ├── layout/
    │   │   ├── Header.tsx
    │   │   └── PageWrapper.tsx
    │   │
    │   ├── home/
    │   │   ├── HeroSection.tsx
    │   │   ├── LoginButton.tsx   # Triggers QF OAuth2 redirect
    │   │   └── JoinForm.tsx      # Enter room code to join
    │   │
    │   ├── lobby/
    │   │   ├── SurahSelector.tsx  # Dropdown from Quran API chapters list
    │   │   ├── JuzSelector.tsx
    │   │   ├── ParticipantCard.tsx
    │   │   ├── InviteLink.tsx     # Copy-to-clipboard invite URL
    │   │   └── StartButton.tsx    # Host only — starts the session
    │   │
    │   ├── session/
    │   │   ├── AyahDisplay.tsx    # Large Arabic text, current reader name
    │   │   ├── TurnIndicator.tsx  # Rotating circle of participant avatars
    │   │   ├── TranslationPanel.tsx  # Slide-up translation (toggle)
    │   │   ├── AudioControls.tsx  # Play/pause recitation, auto-play setting
    │   │   ├── WordLens.tsx       # Popup on word tap: meaning, transliteration
    │   │   ├── ProgressBar.tsx    # Ayahs completed / total in session
    │   │   └── DoneButton.tsx     # Current reader marks their ayah complete
    │   │
    │   └── summary/
    │       ├── StatsGrid.tsx      # Ayahs per participant
    │       ├── StreakBadge.tsx    # Group + individual streak display
    │       ├── ShareCard.tsx      # OG-style card for sharing
    │       └── NextSessionCTA.tsx
    │
    └── supabase/
        └── schema.sql            # Room and participant tables (ephemeral)
```

---

## 4. Supabase Schema

```sql
-- Ephemeral. Rooms auto-delete 24h after created_at via pg_cron or a cleanup edge function.
-- No user PII stored. participant_name is display-only, user-entered, not linked to any account.

create table rooms (
  id          uuid primary key default gen_random_uuid(),
  code        text unique not null,        -- 6-char join code e.g. "BQRS71"
  host_id     text not null,              -- QF user sub (opaque ID, not PII)
  surah_id    int,                        -- null if Juz session
  juz_number  int,                        -- null if Surah session
  status      text default 'lobby',      -- lobby | active | complete
  created_at  timestamptz default now()
);

create table participants (
  id            uuid primary key default gen_random_uuid(),
  room_id       uuid references rooms(id) on delete cascade,
  user_sub      text not null,            -- QF user sub
  display_name  text not null,            -- shown in UI, entered by user
  turn_order    int not null,
  ayahs_read    int default 0,
  joined_at     timestamptz default now()
);

create table turn_state (
  room_id         uuid primary key references rooms(id) on delete cascade,
  current_ayah    int not null default 1, -- ayah number within Surah/Juz
  current_turn    uuid references participants(id),
  audio_played    boolean default false,
  updated_at      timestamptz default now()
);

-- RLS: participants can only read/write rows in rooms they belong to
alter table rooms enable row level security;
alter table participants enable row level security;
alter table turn_state enable row level security;
```

Supabase Realtime is enabled on `turn_state` — every client subscribes to changes on their room's row. Turn advances broadcast instantly to all participants.

---

## 5. Auth Flow (No Data Collected)

```
User clicks "Sign in with Quran Foundation"
  → oauth.ts generates code_verifier + code_challenge (PKCE)
  → Redirect to: https://auth.quran.foundation/oauth2/authorize
      ?client_id=YOUR_CLIENT_ID
      &redirect_uri=https://halaq.app/auth/callback
      &response_type=code
      &scope=openid streak bookmark reading_session
      &code_challenge=...
      &code_challenge_method=S256
      &state=...

User logs in on Quran Foundation's page (you never see this)
  → QF redirects back to /auth/callback?code=...&state=...

oauth.ts validates state, exchanges code for access_token
  → access_token stored IN MEMORY ONLY (React context, never localStorage)
  → id_token decoded for display_name + sub only
  → Nothing written to your DB

All QF User API calls use access_token in x-auth-token header
```

**Why no localStorage?** Token dies when tab closes. No persistent session = no security surface. For a hackathon multiplayer app where sessions are short, this is fine and actually preferable.

---

## 6. API Integration Map

| Feature | API / Service | Endpoint / Method |
|---|---|---|
| Surah list for selector | Quran Foundation JS SDK | `chapters.findAll()` |
| Ayah text display | Quran Foundation JS SDK | `verses.findByChapter(surahId)` |
| Juz breakdown | Quran Foundation JS SDK | `juzs.findAll()` |
| Audio recitation | Audio API | `GET /chapter_recitations/{reciter_id}/{chapter_id}` |
| Translation per ayah | Translation API | `GET /verses/by_chapter/{id}?translations=131` (Saheeh Int'l) |
| Word lens (tap a word) | Quran MCP | `search_quran` or `get_word_by_position` |
| Record streak | QF Streak API | `POST /auth/v1/streak` |
| Bookmark last ayah | QF Bookmarks API | `POST /auth/v1/bookmarks` |
| Activity log | QF Activity API | `POST /auth/v1/reading_sessions` |

---

## 7. Realtime Turn Logic

```typescript
// Simplified — lives in useTurn.ts

// Supabase Realtime subscription
const channel = supabase
  .channel(`room:${roomId}`)
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'turn_state',
    filter: `room_id=eq.${roomId}`
  }, (payload) => {
    setCurrentAyah(payload.new.current_ayah)
    setCurrentTurn(payload.new.current_turn)
  })
  .subscribe()

// Host advances turn after current reader taps "Done"
async function advanceTurn() {
  const nextParticipant = getNextInOrder(participants, currentTurn)
  const nextAyah = currentAyah + 1

  if (nextAyah > totalAyahsInSession) {
    await endSession()
    return
  }

  await supabase
    .from('turn_state')
    .update({
      current_ayah: nextAyah,
      current_turn: nextParticipant.id,
      audio_played: false,
      updated_at: new Date().toISOString()
    })
    .eq('room_id', roomId)
  // All clients receive this update instantly via the subscription above
}
```

---

## 8. Word Lens (Quran MCP)

```typescript
// lib/mcpClient.ts
// Quran MCP runs at mcp.quran.ai — free, no key required for search queries

export async function getWordMeaning(
  surahNumber: number,
  ayahNumber: number,
  wordPosition: number
): Promise<WordMeaning> {
  const response = await fetch('https://mcp.quran.ai/mcp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      method: 'tools/call',
      params: {
        name: 'get_word_by_position',
        arguments: {
          chapter_number: surahNumber,
          verse_number: ayahNumber,
          word_position: wordPosition
        }
      }
    })
  })
  const data = await response.json()
  return {
    arabic: data.result.text_uthmani,
    transliteration: data.result.transliteration,
    translation: data.result.translation,
    rootWord: data.result.char_type
  }
}
```

In `AyahDisplay.tsx`, each Arabic word is wrapped in a `<span>` with an `onClick` handler passing its word position. Tap → `WordLens.tsx` popup slides up from bottom.

---

## 9. Environment Variables

```bash
# .env.local — never commit this

VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...

VITE_QF_CLIENT_ID=your_client_id_from_quran_foundation
VITE_QF_REDIRECT_URI=http://localhost:5173/auth/callback

# No CLIENT_SECRET here — this is a public PKCE client
# No AI API keys — Quran MCP is free and keyless
# No analytics keys — we collect nothing
```

---

## 10. Claude Code Prompt — Getting Started

Paste this into Claude Code to begin:

```
We are building Halaq — a real-time multiplayer Quran reading circle web app
for a hackathon. 18-day deadline. Here is the full context:

STACK
- React + TypeScript + Vite
- Tailwind CSS
- Supabase (Realtime + DB, free tier) — no custom backend
- Quran Foundation APIs + JS SDK
- Quran MCP at mcp.quran.ai (free, no key) for word-level meaning lookup
- Vercel for hosting

AUTH
- Quran Foundation OAuth2 PKCE only
- access_token stored in React context memory only — never localStorage or DB
- No user PII collected or stored by us

DATABASE
- Supabase only — rooms, participants, turn_state (all ephemeral)
- Schema provided in supabase/schema.sql
- No user table

WHAT TO BUILD FIRST
1. Scaffold the full project structure per the scaffold doc
2. Set up Supabase client in src/lib/supabase.ts
3. Implement OAuth2 PKCE flow in src/auth/oauth.ts and AuthProvider.tsx
4. Build the Home page with login CTA and join form

Use the scaffold in halaq-scaffold.md as the single source of truth for
file structure, types, and naming conventions.
Keep components small and focused — one responsibility per file.
All Quran Foundation API calls go through src/lib/quranApi.ts only.
```

---

## 11. Build Order (18 Days)

```
Days 01–02  Project init, Supabase setup, schema, env
Days 03–04  OAuth2 PKCE auth flow, AuthProvider, token in memory
Days 05–06  Quran API integration (chapters, verses, juzs)
Days 07–08  Room creation, Supabase Realtime subscription, join flow
Days 09–10  Session view: AyahDisplay, TurnIndicator, turn advance logic
Days 11–12  Audio API integration, auto-play after ayah, AudioControls
Days 13–13  Translation API, TranslationPanel toggle
Days 14–14  Word Lens — MCP integration, WordLens popup component
Days 15–15  QF User APIs: streak write, bookmark last ayah, reading session
Days 16–16  Summary page, stats, ShareCard
Days 17–17  Polish, mobile responsiveness, accessibility (aria labels)
Days 18–18  Demo video, submission write-up, deploy to Vercel
```

---

## 12. Submission Checklist

- [ ] Live demo URL (Vercel)
- [ ] GitHub repo (public)
- [ ] 2–3 min demo video showing: login → create room → join → read together → summary
- [ ] API usage description: list every QF API used with which feature it powers
- [ ] Short description (1 para): "Halaq brings the ancient tradition of the Quran circle online..."
- [ ] Team member names

---

*Built for the Quran Foundation × Provision Launch Hackathon — April 2026*
