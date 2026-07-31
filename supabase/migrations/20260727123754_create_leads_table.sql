/*
# Create leads table for energy renovation lead capture

1. New Tables
- `leads`
  - `id` (uuid, primary key, auto-generated)
  - `statut_occupation` (text) - homeowner status: Propriétaire Occupant / Propriétaire Bailleur
  - `type_logement` (text) - Maison Individuelle / Appartement
  - `chauffage_actuel` (text) - current heating system
  - `tranche_revenus` (text) - ANAH income bracket
  - `code_postal` (text) - 5-digit French postal code
  - `ville` (text) - city name resolved from postal code
  - `prenom` (text) - first name
  - `nom` (text) - last name
  - `telephone` (text) - 10-digit French phone, clean digits
  - `email` (text) - email address
  - `consentement_rgpd` (boolean) - GDPR consent flag
  - `created_at` (timestamptz, default now()) - submission timestamp

2. Security
- Enable RLS on `leads`.
- This is a no-auth public landing page (no sign-in screen): allow anon + authenticated
  to INSERT (leads are submitted by anonymous visitors) and allow anon + authenticated
  to SELECT/UPDATE/DELETE so the admin dashboard (no auth) can manage and export data.
  The data is intentionally shared across the single-tenant admin operation.
*/

CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  statut_occupation text,
  type_logement text,
  chauffage_actuel text,
  tranche_revenus text,
  code_postal text,
  ville text,
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
