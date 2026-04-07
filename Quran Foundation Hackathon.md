**Hackathon page:** https://launch.provisioncapital.com/quran-hackathon
**API docs:** https://api-docs.quran.foundation/docs/tutorials/oidc/user-apis-quickstart

---

## Ideas

### 1. Gamified Quran Learning
Target younger audiences (children to teens). Duolingo-style — reward users for consistency and accuracy, with social leaderboards for competitiveness.

### 2. Project: Halaqah *(Ibrahim's idea — get his notes)*

One line: A real-time multiplayer Quran circle where each participant reads one ayah in turn to complete a Surah or Juz together — online.

Core loop:
  1. Host creates a room, selects a Surah or Juz
  2. Friends join via invite link
  3. Ayahs display one at a time — the current reader's name is highlighted
  4. After each ayah, optional audio playback (Quran Audio API) so the group can hear the correct recitation
  5. Turns rotate in a circle until the Surah/Juz is complete
  6. Session summary: who read how many, group streak, option to share

  The "catch each other out" mechanic (the fun part):
  Other participants can tap a button if they think the person misread or paused too long — like a buzzer. Adds the
  competitive edge you described from in-person.

  ---
  API mapping (you need at least 1 Content + 1 User):
  - Quran API — ayah text, Surah metadata, Juz breakdown
  - Audio API — recitation playback after each ayah
  - Translation API — optional for non-Arabic speakers in the group
  - Streak Tracking — consecutive days a user completed a halaqah session
  - Activity & Goals — track Surahs and Juz completed across sessions

  That covers both required categories cleanly.

  ---
  Judging criteria breakdown:

  ┌──────────────────────┬───────────────────────────────────────────────────────────────┬─────┐
  │       Criteria       │                          Your angle                           │ Pts │
  ├──────────────────────┼───────────────────────────────────────────────────────────────┼─────┤
  │ Impact on Engagement │ Social accountability + fun = people actually come back daily │ 30  │
  ├──────────────────────┼───────────────────────────────────────────────────────────────┼─────┤
  │ Product Quality & UX │ Real-time turns, clean room UI, mobile-friendly               │ 20  │
  ├──────────────────────┼───────────────────────────────────────────────────────────────┼─────┤
  │ Technical Execution  │ Socket.io, full-stack, live sync                              │ 20  │
  ├──────────────────────┼───────────────────────────────────────────────────────────────┼─────┤
  │ Innovation           │ Digitising halaqah — nobody has done this well                │ 15  │
  ├──────────────────────┼───────────────────────────────────────────────────────────────┼─────┤
  │ API Use              │ Audio + Quran + Streak + Activity                             │ 15  │
  └──────────────────────┴───────────────────────────────────────────────────────────────┴─────┘

  ---
  Suggested stack: React + Node/Express + Socket.io, Quran Foundation API, hosted on Netlify (frontend) + Railway or Render
  (backend, free tier).

  ---
  Biggest open questions before you start building:
  1. Do you want public rooms (anyone joins) or invite-only, or both?
  2. Is the "buzzer/catch" mechanic in scope for the hackathon or do you want to simplify to just turn-based reading?
  3. Solo or team? You're allowed up to 4 — is it just you on idea 2?

### 3. Accessibility Tool
Interface for users to contribute to translations. The blind Muslim community has difficulty sourcing Braille material — unclear how far a web solution can go here, but broader accessibility (screen reader support, audio-first UX, underserved language translations) is worth exploring.

### 4. AI-Driven Feedback Loop
Track individual strengths and weaknesses, visualise progress through graphs and patterns. Small chatbot trained on Quran/Hadith/scholarly opinion to give Tajweed improvement advice.

---

## Stack

- **Frontend:** React + TypeScript
- **Backend/DB:** Supabase
- **Optional:** Pixi.js if going heavy on the game side
- **AI:** TBD — depends on direction chosen
