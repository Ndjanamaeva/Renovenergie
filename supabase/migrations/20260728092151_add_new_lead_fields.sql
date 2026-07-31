/*
# Add new lead fields for evolved simulator

1. New Columns on `leads`
- `age_logement` (integer) — age of the property in years
- `superficie` (integer) — surface area in m²
- `types_travaux` (text) — comma-separated list of desired work types (PAC Air/Air, PAC Air/Eau, SSC, Ballon solaire, Poêle à granulés, Isolation des combles, Autre)
- `type_occupant` (text) — occupant status (Propriétaire occupant, Propriétaire bailleur, Locataire, Occupant à titre gratuit)
- `nombre_personnes` (integer) — number of people declared at the address

2. Modified Columns
- `statut_occupation` renamed conceptually to `type_occupant` (old column kept for backward compat, new column used going forward)
- `tranche_revenus` now uses new revenue brackets (0-20k, 20k-50k, 50k-100k, 100k+)

3. Security
- No changes to RLS policies — existing anon+authenticated CRUD policies still apply to all columns.

4. Notes
- All new columns are nullable so old leads remain valid.
- The old `statut_occupation` column is kept (not dropped) to preserve existing data.
*/

ALTER TABLE leads ADD COLUMN IF NOT EXISTS age_logement integer;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS superficie integer;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS types_travaux text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS type_occupant text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS nombre_personnes integer;
