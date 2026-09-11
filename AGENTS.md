<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project Context: Jobloom

- **App Name**: Jobloom
- **Production URL**: https://jobloom.digitat.in

## Overview
A local-first web app to track job applications, interview rounds, and follow-ups. Built with Next.js (client-only), Tailwind CSS v4, and IndexedDB — no backend, single-user, all data stored securely on-device with full JSON export/import for backup and cross-device portability.

## Tech Stack & Architecture
- **Framework**: Next.js (App Router, React 19, TypeScript, client-first architecture)
- **Styling**: Tailwind CSS v4, Lucide Icons, Shadcn UI / Base UI
- **Storage**: IndexedDB via `idb` wrapper (Local persistence)
- **Data Portability**: Full JSON export & import functionality for backups and cross-device transfers
- **Visuals**: WebGL shader gradients (`GradientWaves`) and glassmorphic modern UI

---

## Module-wise Feature List

### 1. Applications (Core Module)
- **CRUD**: Add / Edit / Delete application entries.
- **Fields**: Company, role, job link, location, salary range, source (LinkedIn / Referral / Naukri / Wellfound / etc.), applied date, status.
- **Status Pipeline**: `Wishlist` → `Applied` → `OA` → `Interview` → `Offer` → `Rejected` → `Ghosted`.
- **Views**:
  - **Kanban Board View**: Drag-and-drop status changes across columns.
  - **Table View**: Compact list view with quick status updating directly from table rows.
- **Batch Actions**: Bulk delete and bulk status update.
- **Search & Filter**: Filter by company, status, source, date range, location, and role keywords.
- **Sorting**: Sort by applied date, last updated date, company name, salary.

### 2. Interviews
- **Interview Rounds**: Add multiple interview rounds per application (type: HR / Technical / Managerial / System Design / Culture Fit / Assignment).
- **Details**: Scheduled date/time, interviewer names/roles, meeting link/mode.
- **Preparation & Freeform Notes**: Rich notes per round.
- **Reminders**: Upcoming interview visual badges / indicator tags (computed locally, no push required).
- **Outcomes**: Track round outcomes (`Pass` / `Fail` / `Pending`).

### 3. Documents
- **Resumes & Cover Letters**: Attach resume version used per application (stored as Blobs in IndexedDB).
- **Version Tagging**: `Resume_v1`, `Resume_v2`, role-tailored versions.
- **Preview & Download**: Instant in-browser preview and file download directly from application entry.

### 4. Contacts
- **Network & Referrals**: Add recruiter, hiring manager, or referral contacts per application.
- **Fields**: Name, role, company, LinkedIn URL, email, phone, notes.
- **Application Linking**: Link contacts to one or more job applications.

### 5. Notes & Timeline
- **Automated Activity Log**: Auto-records status changes, interview additions, document attachments, and timestamps.
- **Manual Notes**: Add freeform timestamped comments and interview reflections.
- **Timeline View**: Interactive vertical stepper UI showing the complete journey of each application.

### 6. Dashboard & Analytics
- **Summary Metrics**: Total applications, active in-flight pipelines, offers received, rejection rate, ghosting rate.
- **Funnel Chart**: Visual conversion funnel (`Applied` → `OA` → `Interview` → `Offer`).
- **Activity & Velocity**: Applications submitted per week / month charts.
- **Source Effectiveness**: Analysis of which application sources yield the highest interview and offer conversion rates.

### 7. Follow-Up Reminders
- **Follow-up Date**: Set target follow-up date per application.
- **"Needs Follow-Up" Computed Filter**: Flags applications with no response/activity in *X* days.
- **Action Widget**: Dashboard widget highlighting upcoming interview rounds and pending recruiter follow-ups.

### 8. Settings & Data Portability
- **JSON Export**: Export entire IndexedDB database to a structured JSON file.
- **JSON Import**: Restore data from backup JSON with validation.
- **Wipe Data**: Clean-slate reset / purge option.
- **Theme Preferences**: Dark mode / Light mode / System default toggle.
- **Custom Status Stages**: Rename pipeline stages or customize status colors.

### 9. Storage & Infrastructure (Client-Only DB)
- **IndexedDB Wrapper**: Custom wrapper using `idb` library.
- **Stores / Schema**: `applications`, `interviews`, `documents`, `contacts`, `notes_timeline`, `settings`.
- **Migrations**: Schema version management and migration handlers.
- **Auto-Backup Prompt**: Non-intrusive periodic backup reminders to ensure zero data loss on browser cache purges.

---

## Codebase Organization Blueprint
Recommended modular architecture under `src/modules/`:
```
src/
├── modules/
│   ├── storage/             # IndexedDB db setup, schemas, migrations, repository base
│   ├── applications/        # CRUD, Kanban board, Table view, filters, search
│   ├── interviews/          # Round management, scheduling, round notes
│   ├── documents/           # IndexedDB blob storage, versioning, preview/download
│   ├── contacts/            # Recruiters & referral network linked to applications
│   ├── timeline/            # Activity logging & chronological vertical stepper
│   ├── dashboard/           # Metrics cards, conversion funnels, velocity charts
│   ├── reminders/           # Computed follow-ups & upcoming interview widgets
│   └── settings/            # Export/Import JSON, custom pipeline configuration
├── components/
│   ├── background/          # WebGL shader gradients (GradientWaves)
│   ├── layout/              # Navbar, Sidebar, AppShell, Footer
│   ├── ui/                  # Shadcn / Base UI design system components
│   └── index.ts
└── lib/                     # Utilities, formatting, date helpers
```

## Recommended Implementation Order
1. **Storage Infra (`modules/storage`)**: `idb` initialization, schema types, stores, repository helpers.
2. **Applications Module (`modules/applications`)**: Table view, Kanban drag-and-drop, creation modal, filtering.
3. **Dashboard (`modules/dashboard`)**: Summary cards, pipeline funnel, conversion analytics.
4. **Interviews Module (`modules/interviews`)**: Multi-round tracker, round types, status badges.
5. **Notes & Timeline (`modules/timeline`)**: Automated activity logging, manual notes, vertical timeline.
6. **Contacts & Documents (`modules/contacts`, `modules/documents`)**: Recruiter contacts & Blob resume storage.
7. **Reminders (`modules/reminders`)**: Follow-up heuristics & upcoming interview alerts.
8. **Settings & Portability (`modules/settings`)**: JSON import/export, data backup prompts, stage customization.


