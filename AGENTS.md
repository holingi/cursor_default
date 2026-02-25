# AGENTS.md

## Cursor Cloud specific instructions

This is a **Task Manager** example project (Node.js + Express + vanilla frontend). See `README.md` for full details.

### Quick reference

| Action | Command |
|--------|---------|
| Install deps | `npm install` |
| Dev server | `npm run dev` (port 3000, auto-restarts on save) |
| Lint | `npm run lint` |
| Tests | `npm test` (Vitest + Supertest, 15 tests) |

### Notes

- The backend uses in-memory storage — data resets on server restart
- `npm run dev` uses Node's built-in `--watch` flag (no extra tooling needed)
- The frontend is served as static files from `public/`; no build step is required
