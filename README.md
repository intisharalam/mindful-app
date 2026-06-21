# Mindful — setup notes

## Database: Neon Postgres (via Vercel)

This app now uses Neon Postgres (serverless, HTTP-based) instead of local SQLite — the earlier SQLite version could not run on Vercel's read-only serverless filesystem.

### Local development

1. Get your Neon connection string: in your Vercel project dashboard → Storage tab → your Neon database → `.env.local` tab, copy the `DATABASE_URL` value.
2. Create a `.env.local` file in the project root:
   ```
   DATABASE_URL="postgresql://...your-neon-connection-string...?sslmode=require"
   ```
3. `npm install`
4. `npm run dev`

The schema (users, sessions, stats, settings tables) is created automatically on first request — no manual migration step needed.

### Deploying to Vercel

`DATABASE_URL` should already be set automatically in your Vercel project's Environment Variables once you created the Neon database through the Storage tab. No extra config needed — just push and deploy.

## What's real vs. mocked

**Real and persisted to Neon Postgres:**
- Accounts (signup/login/logout), with bcrypt-hashed passwords
- Sessions (server-side, stored in the database, 30-day expiry)
- Streak, level, XP, and time-tracking stats — synced per logged-in user
- Settings: parent/kid mode, PIN, category enable/budgets, kid's allowed micro-categories

**Still mocked / client-side only:**
- Video and book content (hardcoded in src/lib/content.ts and src/lib/books.ts) — the intended next seam for a real content API
- Subscriptions (channel list and subscribe/unsubscribe state resets on refresh — not yet persisted)
- Search does not exist yet
- If you're not logged in, stats/settings still work but stay local to that browser session only

## Architecture notes for whoever picks this up next

- **Database client**: src/lib/server/db.ts — `@neondatabase/serverless`, schema created automatically via `ensureSchema()` on first query
- **Auth helpers**: src/lib/server/auth.ts (all async now — every DB call is a network round-trip)
- **API routes**: src/app/api/auth/*, src/app/api/stats, src/app/api/settings
- **Client contexts**: AuthContext, EngagementContext (stats), AppSettingsContext — sync to the API when logged in, fall back to local-only state when not
- **Content data**: src/lib/content.ts (videos), src/lib/books.ts, src/lib/channels.ts — natural seams to swap in a real content API and search later

### Why Neon instead of SQLite

Vercel's serverless functions run on a read-only filesystem except `/tmp`, and even `/tmp` doesn't persist across invocations or between the multiple instances Vercel may run concurrently. A file-based database (SQLite, including Node's built-in `node:sqlite`) cannot work reliably in that environment. Neon's HTTP-based serverless driver has no persistent connection or local file to manage, which is why it's the standard pairing for Postgres-on-Vercel.
