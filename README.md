# Mindful — setup notes

## Requirements

- **Node.js 22.5 or newer** (important: this app uses Node's built-in `node:sqlite` module, which is not available in older Node versions and is still labeled experimental by Node itself). Run `node --version` to check. If you're on an older Node, install Node 22+ via nvm or nodejs.org.

## Running it

```
npm install
npm run dev
```

Then open http://localhost:3000.

A SQLite database file will be created automatically at `data/mindful.db` on first run. This file is gitignored — delete it any time to reset all accounts, stats, and settings.

## What's real vs. mocked

**Real and persisted to disk:**
- Accounts (signup/login/logout), with bcrypt-hashed passwords
- Sessions (server-side, stored in SQLite, 30-day expiry)
- Streak, level, XP, and time-tracking stats — synced to the database per logged-in user
- Settings: parent/kid mode, PIN, category enable/budgets, kid's allowed micro-categories

**Still mocked / client-side only:**
- Video and book content (hardcoded in src/lib/content.ts and src/lib/books.ts) — this is the part meant to be replaced by a real content API next
- Subscriptions (channel list and subscribe/unsubscribe state resets on refresh — not yet persisted)
- Search does not exist yet
- If you're not logged in, stats/settings still work but stay local to that browser session only (no account to sync to)

## Architecture notes for whoever picks this up next

- **Database**: src/lib/server/db.ts — Node's built-in node:sqlite, schema created automatically on first run
- **Auth helpers**: src/lib/server/auth.ts
- **API routes**: src/app/api/auth/*, src/app/api/stats, src/app/api/settings
- **Client contexts**: AuthContext, EngagementContext (stats), AppSettingsContext — all sync to the API when logged in, fall back to local-only state when not
- **Content data**: src/lib/content.ts (videos), src/lib/books.ts, src/lib/channels.ts — these are the natural seams to swap in a real content API and search later
