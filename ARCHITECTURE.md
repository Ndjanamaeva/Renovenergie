# Architecture — MaPrimeRénov' Lead Simulator

A simple, clean 4-layer architecture for a lead-generation web app.

```
project/
├── src/                        # Frontend (Vite + React + TypeScript)
│   ├── App.tsx                 # Entry point — routes /admin → admin, else → frontend
│   ├── main.tsx                # React root
│   ├── index.css               # Tailwind + global styles
│   ├── shared/                 # Shared code (used by both frontend & admin)
│   │   ├── api.ts              # API client — calls the backend, never touches DB
│   │   ├── types.ts            # Form state, step definitions
│   │   └── postal.ts           # Postal code → city lookup, phone/email validation
│   ├── frontend/               # Visitor-facing simulator
│   │   ├── FrontendApp.tsx     # Main simulator orchestrator (state, navigation)
│   │   ├── assets/             # Centralized image registry
│   │   │   └── images.ts       # All image URLs in one place
│   │   ├── hooks/              # Frontend-specific hooks
│   │   │   └── useInView.ts    # Scroll-reveal IntersectionObserver hook
│   │   └── components/         # Simulator UI components
│   │       ├── Navbar.tsx      # Transparent sticky navbar
│   │       ├── Brand.tsx       # Reusable RénovÉnergie logo/wordmark
│   │       ├── IntroScreen.tsx
│   │       ├── StepScreens.tsx
│   │       ├── ReviewHub.tsx
│   │       ├── SuccessScreen.tsx
│   │       ├── ProgressBar.tsx
│   │       ├── LegalBanner.tsx
│   │       ├── Confetti.tsx
│   │       └── choices.tsx
│   └── admin/                  # Admin dashboard
│       ├── AdminApp.tsx        # Admin entry point
│       └── AdminDashboard.tsx  # Lead table, search, CSV export, delete
│
├── backend/                    # Backend (Supabase Edge Function)
│   ├── database/
│   │   └── schema.sql          # Database schema (leads table + RLS policies)
│   └── (deployed as Edge Function — see supabase/functions/)
│
├── supabase/
│   └── functions/
│       └── leads-api/          # Edge Function: insert, list, delete, export CSV
│           └── index.ts
│
├── .env                        # Supabase URL + anon key (pre-configured)
├── tailwind.config.js          # Brand colors (slate blue + eco green)
├── vite.config.ts              # Path alias @/ → src/
└── package.json
```

## The 4 Layers

### 1. Database (Supabase PostgreSQL)
- **Table:** `leads` — stores all submitted homeowner data
- **Security:** Row Level Security enabled; anon + authenticated can read/write (no-auth app)
- **Schema file:** `backend/database/schema.sql`

### 2. Backend (Supabase Edge Function)
- **Function:** `leads-api` (deployed, auto-scales, serverless)
- **Routes:**
  - `POST` → insert a new lead (validates required fields + GDPR consent)
  - `GET ?action=list` → return all leads as JSON
  - `GET ?action=export` → download all leads as a CSV file (server-generated)
  - `DELETE ?action=delete&id=...` → delete a lead
- **Source:** `supabase/functions/leads-api/index.ts`
- **Key rule:** The backend is the ONLY layer that touches the database

### 3. Frontend (Visitor Simulator)
- **Entry:** `src/frontend/FrontendApp.tsx`
- **Role:** The 9-screen gamified lead capture flow (intro → questions → review → success)
- **API calls:** Submits leads via `src/shared/api.ts` (POST to backend)
- **Never** imports Supabase directly

### 4. Admin (Dashboard)
- **Entry:** `src/admin/AdminApp.tsx` → `AdminDashboard.tsx`
- **Access:** Browse to `/admin` (password: `admin2024`)
- **Features:** Lead table, search, refresh, delete, CSV export
- **API calls:** Fetches/deletes/exports via `src/shared/api.ts` (GET/DELETE to backend)
- **Never** imports Supabase directly

## Data Flow

```
Visitor fills form → Frontend → POST /leads-api → Backend → INSERT into leads table
                                        ↓
Admin opens /admin → Admin → GET /leads-api?action=list → Backend → SELECT from leads
Admin clicks Export → Admin → GET /leads-api?action=export → Backend → CSV download
Admin deletes lead → Admin → DELETE /leads-api?action=delete → Backend → DELETE from leads
```

## CSV Export Columns (call-center ready)
1. ID
2. Date_Soumission (DD/MM/YYYY HH:MM)
3. Statut_Occupation
4. Type_Logement
5. Chauffage_Actuel
6. Tranche_Revenus
7. Code_Postal
8. Ville
9. Prenom
10. Nom
11. Telephone (clean digits: 0612345678)
12. Email
13. Consentement_RGPD (TRUE/FALSE)
