

# Text-to-Video Web Application — Implementation Plan

## Platform Constraints

Lovable runs **React + Tailwind + TypeScript** on the frontend with **Supabase Cloud** as backend. No Node.js/Express servers, no MongoDB. We adapt your architecture accordingly.

## Architecture

```text
┌──────────────────────────────────┐
│        React Frontend            │
│  Landing · Auth · Dashboard      │
│  Script Editor · Scene Builder   │
│  Canvas Preview · Export UI      │
├──────────────────────────────────┤
│       Supabase Cloud             │
│  Auth · PostgreSQL · Storage     │
│  Edge Functions (TTS, Export)    │
└──────────────────────────────────┘
```

## Phase 1 — UI Foundation & Auth

- **Landing page** with hero section, features overview, CTA
- **Auth pages** (Login/Signup) via Supabase Cloud (email + Google)
- **Dashboard** — list user projects, create/delete/rename
- **Sidebar navigation** — Dashboard, Templates, Settings
- **Database tables**: `profiles`, `projects`, `templates`, `exports`, `user_roles`

## Phase 2 — Script Editor & Scene Builder

- **Rich text editor** — write script organized by scenes (intro, body, outro)
- **Scene timeline** — visual timeline bar, drag to reorder scenes
- **Scene settings panel** — duration, background color/image, text style, font, transition type
- **Scene types**: Title card, Text overlay, Image + caption, Split screen

## Phase 3 — Canvas Preview

- **HTML5 Canvas preview** rendering scenes in real-time in the browser
- **Text animations** — fade in, typewriter, slide
- **Transitions** — fade, wipe, slide between scenes
- **Background media** — solid colors, gradients, uploaded images
- **Playback controls** — play/pause, scrub timeline, scene navigation

## Phase 4 — Template Library

- **Pre-built templates**: Marketing, Educational, Social Media (Reels/TikTok), Presentation
- **Template browser** with category filters and preview thumbnails
- **Apply template** — loads scene structure, colors, fonts, timing into editor

## Phase 5 — Export & AI Integration

- **TTS via Edge Function** — convert script text to speech audio (external API)
- **Video export** — browser-side rendering for short-form (up to ~3 min)
- **Export settings** — resolution (720p, 1080p), format
- **Export history** — track status in `exports` table, download from Supabase Storage

## Database Schema

| Table | Key Columns |
|---|---|
| `profiles` | id, user_id (FK auth.users), display_name, avatar_url |
| `projects` | id, user_id, title, script_json, settings_json, status, thumbnail_url |
| `templates` | id, name, category, config_json, thumbnail_url, is_premium |
| `exports` | id, project_id, resolution, status, video_url, created_at |
| `user_roles` | id, user_id, role (enum: admin, user) |

## Key Routes

| Route | Page |
|---|---|
| `/` | Landing page |
| `/login` | Auth (login/signup) |
| `/dashboard` | Projects list |
| `/editor/:id` | Main video editor |
| `/templates` | Template browser |
| `/settings` | Account settings |

## Implementation Order

1. Landing page + navigation layout
2. Auth setup (Supabase Cloud)
3. Dashboard with project CRUD
4. Editor page — script input + scene builder UI
5. Canvas-based scene preview with playback
6. Template library
7. TTS integration via Edge Function
8. Video export (short-form, browser-side)

## Honest Limitations

- **1-hour / 4K videos** require dedicated rendering infrastructure beyond the browser. Initial release supports short-form content (2-3 min) at 720p/1080p.
- **FFmpeg/WebAssembly** in-browser is limited by memory. Longer videos would need a server-side pipeline added later.
- Security (JWT, HTTPS, input validation) is handled natively by Supabase Cloud.

## What Gets Built First

I will start with **Phase 1**: Landing page, auth, dashboard, and database setup. This gives you a working app skeleton to build upon incrementally.

