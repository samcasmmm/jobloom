<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project Context: Jobloom

- **App Name**: Jobloom
- **Production URL**: https://jobloom.digitat.in
- **One-liner**: A local-first web app to track job applications, interview rounds, and follow-ups — no backend, all data lives on-device.

## Overview

Jobloom is a single-user, client-only job application tracker. Every write goes straight to IndexedDB — there is no server, no auth, and no sync. Users own their data completely and can export/import it as JSON for backup or moving between devices/browsers.

## Non-Goals (explicit constraints — do not build these)

- No backend API, no server-side database, no auth/login.
- No multi-user support, no real-time sync between devices.
- No push notifications — "reminders" are computed on read (e.g. `followUpDate < today`), never scheduled.
- No analytics/telemetry calls out to third parties.
- Data portability (JSON export/import) is the _only_ backup mechanism — treat it as a first-class feature, not an afterthought.

## Tech Stack & Architecture

- **Framework**: Next.js (App Router, React 19, TypeScript, client-first — most routes are `"use client"`; only static/marketing pages may be server components)
- **Styling**: Tailwind CSS v4, Lucide Icons, Shadcn UI / Base UI
- **Storage**: IndexedDB via `idb` wrapper — single DB (`job-tracker-db`), versioned schema, no server round-trips
- **State management**: Local component state + React Context for cross-module state (e.g. active filters, theme); no external state library needed at this scale
- **Forms & validation**: Native controlled inputs + lightweight schema validation (zod) at the service layer before any IndexedDB write
- **Data Portability**: Full JSON export & import functionality for backups and cross-device transfers
- **Visuals**: WebGL shader gradients (`GradientWaves`) and glassmorphic modern UI

## Design System Conventions

- Glassmorphic surfaces: translucent panels (`bg-white/5` to `/10`, `backdrop-blur`), subtle borders (`border-white/10`)
- `GradientWaves` as the persistent animated background layer behind the app shell — keep it performant (canvas/WebGL, not re-rendered per state change)
- Status colors are consistent and centrally defined (one source of truth in `lib/status-colors.ts`), reused across Kanban columns, table badges, and dashboard charts
- Dark mode is the default; light mode and system are supported via the theme toggle in Settings

## Data Model (IndexedDB schema)

```typescript
// modules/storage/types/schema.ts

export interface Application {
  id: string;
  company: string;
  role: string;
  jobLink?: string;
  location?: string;
  salaryMin?: number;
  salaryMax?: number;
  source: 'LinkedIn' | 'Referral' | 'Naukri' | 'Wellfound' | 'Company Site' | 'Other';
  status: 'Wishlist' | 'Applied' | 'OA' | 'Interview' | 'Offer' | 'Rejected' | 'Ghosted';
  appliedDate: string; // ISO
  lastUpdated: string; // ISO
  followUpDate?: string; // ISO
  createdAt: string;
  updatedAt: string;
}

export interface InterviewRound {
  id: string;
  applicationId: string; // FK
  type: 'HR' | 'Tech' | 'Managerial' | 'System Design' | 'Culture Fit' | 'Assignment' | 'Other';
  mode: 'Online' | 'Offline' | 'Phone';
  scheduledAt: string; // ISO
  interviewerName?: string;
  interviewerRole?: string;
  meetingLink?: string;
  outcome: 'Pending' | 'Pass' | 'Fail';
  notes?: string;
  createdAt: string;
}

export interface DocumentFile {
  id: string;
  applicationId: string; // FK
  type: 'Resume' | 'CoverLetter' | 'Other';
  label: string; // e.g. "Resume_v2"
  blob: Blob;
  fileName: string;
  mimeType: string;
  uploadedAt: string;
}

export interface Contact {
  id: string;
  name: string;
  role?: string;
  company?: string;
  linkedinUrl?: string;
  email?: string;
  phone?: string;
  notes?: string;
  applicationIds: string[]; // many-to-many
  createdAt: string;
}

export interface NoteEntry {
  id: string;
  applicationId: string; // FK
  type: 'auto' | 'manual'; // auto = system-generated activity log
  content: string;
  createdAt: string;
}

export interface Settings {
  id: 'app-settings'; // singleton key
  theme: 'light' | 'dark' | 'system';
  statusLabels: Record<Application['status'], string>;
  statusColors?: Record<Application['status'], string>;
  followUpThresholdDays: number; // used by "needs follow-up" computed filter
  lastBackupAt?: string;
}
```

**Stores & indexes** (`modules/storage/services/db.ts`, `idb` typed schema):

- `applications` — indexes: `by-status`, `by-company`, `by-appliedDate`
- `interviews` — index: `by-applicationId`
- `documents` — index: `by-applicationId`
- `contacts` — no index (scans `applicationIds`; fine at personal-tracker scale)
- `notes` — index: `by-applicationId`
- `settings` — singleton row, keyPath `id`

Bump `DB_VERSION` and add an `upgrade()` migration branch for any schema change — never mutate existing stores in place without a migration path, since users' only copy of their data is in their own browser.

## Module-wise Feature List

### 1. Applications (Core Module)

- CRUD: Add / Edit / Delete application entries.
- Fields: company, role, job link, location, salary range, source, applied date, status.
- Status Pipeline: `Wishlist` → `Applied` → `OA` → `Interview` → `Offer` → `Rejected` → `Ghosted`.
- Views: Kanban board (drag-and-drop status change) and Table (inline status update).
- Batch actions: bulk delete, bulk status update.
- Search & filter: company, status, source, date range, location, role keywords.
- Sorting: applied date, last updated, company name, salary.

### 2. Interviews

- Multiple rounds per application (HR / Technical / Managerial / System Design / Culture Fit / Assignment).
- Scheduled date/time, interviewer name/role, meeting link/mode.
- Rich freeform prep notes per round.
- Upcoming-interview badges (computed locally, no scheduling infra).
- Round outcome: Pass / Fail / Pending.

### 3. Documents

- Attach resume/cover letter per application, stored as Blobs in IndexedDB.
- Version tagging (`Resume_v1`, role-tailored versions).
- In-browser preview and download from the application entry.

### 4. Contacts

- Recruiter/hiring-manager/referral contacts.
- Fields: name, role, company, LinkedIn, email, phone, notes.
- Link one contact to multiple applications.

### 5. Notes & Timeline

- Auto-logged activity (status changes, interview added, document attached).
- Manual timestamped notes.
- Vertical stepper timeline per application.

### 6. Dashboard & Analytics

- Summary cards: total, active, offers, rejection rate, ghosting rate.
- Funnel chart: Applied → OA → Interview → Offer.
- Applications-per-week/month velocity chart.
- Source-effectiveness breakdown (conversion by channel).

### 7. Follow-Up Reminders

- Per-application follow-up date.
- Computed "needs follow-up" filter (no activity in _X_ days, configurable in Settings).
- Dashboard widget: upcoming interviews + pending follow-ups.

### 8. Settings & Data Portability

- JSON export of the full IndexedDB dataset.
- JSON import with validation before write.
- Wipe-all-data (clean slate).
- Theme toggle: light / dark / system.
- Rename pipeline stages, customize status colors, set follow-up threshold.

### 9. Storage & Infrastructure (client-only DB)

- `idb`-based wrapper, typed schema, versioned migrations.
- Repository layer per store (CRUD functions), no direct IndexedDB calls from components.
- Periodic non-intrusive backup-reminder prompt (browser storage can be cleared by the user/OS at any time — this is the only real data-loss risk).

## Codebase Organization

```
src/
├── modules/
│   ├── storage/             # idb setup, schema, migrations, repositories
│   ├── applications/        # CRUD, Kanban, Table, filters, search
│   │   └── {components,repositories,services,types,validations,utils}
│   ├── interviews/
│   ├── documents/
│   ├── contacts/
│   ├── timeline/
│   ├── dashboard/
│   ├── reminders/
│   └── settings/
├── components/
│   ├── background/           # GradientWaves (WebGL)
│   ├── layout/                # Navbar, Sidebar, AppShell, Footer
│   ├── ui/                    # Shadcn / Base UI primitives
│   └── index.ts
└── lib/                       # date/formatting utils, status-colors, zod schemas
```

Each module follows `{components,repositories,services,types,validations,utils}` — no DI/service-locator layer; components call services directly, services call repositories directly. Keep this flat; don't add abstraction the app doesn't need.

## Coding Conventions

- Functional patterns throughout — no class-based services/repositories.
- All IndexedDB access goes through the `storage` module's repositories; no module reaches into `idb` directly.
- Validate at the service boundary (zod) before any write — repositories assume already-valid data.
- Derived/computed values (funnel stats, "needs follow-up", velocity) are pure functions in `lib/` or the owning module's `utils/`, never stored redundantly in IndexedDB.
- Keep `GradientWaves` and other animated backgrounds isolated from state that changes frequently, to avoid unnecessary re-renders.

## Error Handling & Empty States

- Every IndexedDB write path wrapped in try/catch with a toast/inline error — never fail silently, since there's no server log to fall back on.
- Empty states for each module (no applications yet, no interviews scheduled, no contacts) with a clear primary CTA.
- Import validation must reject malformed JSON with a specific error, not a generic failure.

## Performance Considerations

- Resume/cover-letter Blobs can grow the DB — surface storage usage in Settings if it becomes large; don't load all Blobs into memory at once (fetch per-application, on demand).
- Table/Kanban views should virtualize once application counts grow large (100+), rather than rendering every row/card.

## Deployment

- Static/client-heavy Next.js app — deployable to Vercel or any static host; no environment secrets required since there's no backend.
- Production at https://jobloom.digitat.in (digitat.in project).

## Implementation Order

1. `modules/storage` — idb init, schema, repositories, migrations.
2. `modules/applications` — Table + Kanban, create/edit modal, filters.
3. `modules/dashboard` — summary cards, funnel, velocity.
4. `modules/interviews` — round tracker, outcomes, badges.
5. `modules/timeline` — auto-log + manual notes, vertical stepper.
6. `modules/contacts` + `modules/documents` — referral network, Blob storage.
7. `modules/reminders` — computed follow-up heuristics, dashboard widget.
8. `modules/settings` — export/import, wipe, theme, pipeline customization.
