# Okoye Emmanuel Obiajulu Portfolio (Next.js + MongoDB CMS)

Revamped personal portfolio with:
- Premium responsive UI/UX (App Router + Tailwind + shadcn/ui)
- GSAP entrance + scroll reveal animations with reduced-motion support
- Hidden admin system at `/admin` with protected `/admin/dashboard`
- MongoDB content storage + GridFS media storage
- GitHub credibility stats and project metadata auto-fetch logic

## Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS + shadcn/ui
- MongoDB (`siteContent`, `skills`, `projects`, `awards`, `images` + GridFS bucket `media`)
- GSAP + ScrollTrigger
- JWT session cookies (`jose`) + middleware route protection

## Environment Variables
Create `.env.local` (already gitignored) and set:

```bash
MONGODB_URI=your_mongodb_connection_string
MONGODB_DB=okoyePortfolio

ADMIN_EMAIL=okoyeemmanuel998@gmail.com
ADMIN_PASSWORD_HASH=your_bcrypt_hash
SESSION_SECRET=long_random_secret_min_24_chars

# Optional, enables richer GraphQL stats and better rate limits
GITHUB_TOKEN=ghp_xxx

# Optional local-dev fallback if you don't want to hash yet
# ADMIN_PASSWORD=plain_text_dev_password
```

### Generate `ADMIN_PASSWORD_HASH`
Use bcrypt (recommended):

```bash
node -e "const bcrypt=require('bcryptjs'); bcrypt.hash(process.argv[1], 12).then(v=>console.log(v));" 'your-password'
```

## Install & Run
```bash
npm install
npm run seed
npm run dev
```

Open:
- Site: `http://localhost:3000`
- Admin login: `http://localhost:3000/admin`
- Admin dashboard: `http://localhost:3000/admin/dashboard` (requires login)

## Admin Usage
`/admin/dashboard` includes tabs:
- `Content`: hero/about/socials/contact/stellar section + experience/education JSON editing
- `Skills`: add/edit/delete/reorder skill entries
- `Projects`: add/edit/delete/reorder projects, manual overrides, and per-project **Re-fetch from GitHub**
- `Projects`: includes automatic missing-metadata resolution and a bulk **Resolve missing metadata** action
- `Awards`: add/edit/delete/reorder awards, proof links, optional image attachment
- `Media`: upload images to GridFS and select uploaded images directly in Content/Projects/Awards forms

No Admin link is rendered in the public UI.

## Media Storage (GridFS)
- Upload endpoint: `POST /api/admin/media/upload` (multipart/form-data)
- Metadata collection: `images`
- Binary files: GridFS bucket `media`
- Public stream endpoint: `GET /api/media/[id]`

Use stored `imageId` in content/projects/awards to render media from GridFS.

## GitHub Metadata & Stats
### Projects
- Repo discovery searches GitHub by name (GraphQL if token exists, REST fallback)
- Matching logic normalizes/fuzzy-matches names and prioritizes owner/contributor relevance
- Auto metadata fetched: `githubUrl`, `description`, `tags`, `languages`, `homepage`, `heroImageUrl`
- If unresolved: `needsRepo=true` and admin manual override remains available

### Credibility Stats
`lib/github.ts` server-fetches and caches:
- public repos
- followers
- total stars received
- approx commits in last 365 days
- merged PRs in last 365 days
- activity summary

## Seeding
- `npm run seed`: seeds content/skills/projects/awards defaults
- `npm run seed:github`: seeds + resolves project metadata from GitHub (may be slower/rate-limited without token)

## Security Notes
- Admin APIs and `/admin/dashboard` are protected by middleware and JWT httpOnly cookie session
- Login endpoint includes basic in-memory rate limiting
- Keep secrets only in `.env.local`
