// Shared API client — used by both the frontend and admin to talk to the backend.
// Neither the frontend nor the admin touches the database directly.

export type Lead = {
  id: string;
  created_at: string;
  type_logement: string | null;
  age_logement: number | null;
  superficie: number | null;
  chauffage_actuel: string | null;
  types_travaux: string | null;
  code_postal: string | null;
  ville: string | null;
  type_occupant: string | null;
  nombre_personnes: number | null;
  tranche_revenus: string | null;
  prenom: string | null;
  nom: string | null;
  telephone: string | null;
  email: string | null;
  consentement_rgpd: boolean;
};

export type LeadInput = {
  type_logement: string;
  age_logement: number;
  superficie: number;
  chauffage_actuel: string;
  types_travaux: string;
  code_postal: string;
  ville: string | null;
  type_occupant: string;
  nombre_personnes: number;
  tranche_revenus: string;
  prenom: string;
  nom: string;
  telephone: string;
  email: string;
  consentement_rgpd: boolean;
};

const FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/leads-api`;
const HEADERS = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
  apikey: import.meta.env.VITE_SUPABASE_ANON_KEY as string,
};

async function parseError(res: Response): Promise<string> {
  try {
    const body = await res.json();
    return body.error ?? `Erreur ${res.status}`;
  } catch {
    return `Erreur ${res.status}`;
  }
}

export async function submitLead(input: LeadInput): Promise<{ success: boolean; id: string }> {
  const res = await fetch(FUNCTION_URL, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function fetchLeads(): Promise<Lead[]> {
  const res = await fetch(`${FUNCTION_URL}?action=list`, { headers: HEADERS });
  if (!res.ok) throw new Error(await parseError(res));
  const body = await res.json();
  return body.leads as Lead[];
}

export async function deleteLead(id: string): Promise<void> {
  const res = await fetch(`${FUNCTION_URL}?action=delete&id=${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: HEADERS,
  });
  if (!res.ok) throw new Error(await parseError(res));
}

export async function exportLeadsCSV(): Promise<Blob> {
  const res = await fetch(`${FUNCTION_URL}?action=export`, { headers: HEADERS });
  if (!res.ok) throw new Error(await parseError(res));
  return res.blob();
}
