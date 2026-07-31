-- ════════════════════════════════════════════════════════════════
-- DATABASE SCHEMA — Rénovation Énergétique Lead Capture
-- ════════════════════════════════════════════════════════════════
-- This file documents the database layer. The actual migration was
-- applied via the Supabase MCP tool. This SQL is idempotent and safe
-- to re-run.
--
-- TABLE: leads
--   Stores all homeowner leads from the simulator.
--
-- COLUMNS:
--   id                    uuid, primary key
--   type_logement         text — Maison, Appartement, Autre
--   age_logement          integer — age of the property in years
--   superficie            integer — surface area in m²
--   chauffage_actuel      text — current heating system
--   types_travaux         text — comma-separated desired work types
--   code_postal           text — postal code
--   ville                 text — resolved city
--   type_occupant         text — Propriétaire occupant, Propriétaire bailleur, Locataire, Occupant à titre gratuit
--   nombre_personnes      integer — number of people at the address
--   tranche_revenus       text — revenue bracket (0-20k, 20k-50k, 50k-100k, 100k+)
--   prenom                text
--   nom                   text
--   telephone             text
--   email                 text
--   consentement_rgpd     boolean — GDPR consent
--   created_at            timestamptz — submission timestamp
--
-- SECURITY (RLS):
--   This is a no-auth public landing page (no sign-in screen).
--   anon + authenticated can INSERT (visitors submit leads).
--   anon + authenticated can SELECT/UPDATE/DELETE (admin dashboard).
-- ════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type_logement text,
  age_logement integer,
  superficie integer,
  chauffage_actuel text,
  types_travaux text,
  code_postal text,
  ville text,
  type_occupant text,
  nombre_personnes integer,
  tranche_revenus text,
  prenom text,
  nom text,
  telephone text,
  email text,
  consentement_rgpd boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_leads" ON leads;
CREATE POLICY "anon_select_leads" ON leads FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_leads" ON leads;
CREATE POLICY "anon_insert_leads" ON leads FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_leads" ON leads;
CREATE POLICY "anon_update_leads" ON leads FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_leads" ON leads;
CREATE POLICY "anon_delete_leads" ON leads FOR DELETE
  TO anon, authenticated USING (true);
