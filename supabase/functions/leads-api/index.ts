import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const EXPORT_COLUMNS: { key: string; label: string }[] = [
  { key: 'id', label: 'ID' },
  { key: 'created_at', label: 'Date_Soumission' },
  { key: 'type_logement', label: 'Type_Logement' },
  { key: 'age_logement', label: 'Age_Logement' },
  { key: 'superficie', label: 'Superficie_m2' },
  { key: 'chauffage_actuel', label: 'Chauffage_Actuel' },
  { key: 'types_travaux', label: 'Types_Travaux' },
  { key: 'code_postal', label: 'Code_Postal' },
  { key: 'ville', label: 'Ville' },
  { key: 'type_occupant', label: 'Type_Occupant' },
  { key: 'nombre_personnes', label: 'Nombre_Personnes' },
  { key: 'tranche_revenus', label: 'Tranche_Revenus' },
  { key: 'prenom', label: 'Prenom' },
  { key: 'nom', label: 'Nom' },
  { key: 'telephone', label: 'Telephone' },
  { key: 'email', label: 'Email' },
  { key: 'consentement_rgpd', label: 'Consentement_RGPD' },
];

type Lead = Record<string, unknown> & { id: string; created_at: string };

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function errorResponse(message: string, status: number) {
  return json({ error: message }, status);
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function cleanPhone(tel: string | null): string {
  return tel ? tel.replace(/\D/g, '') : '';
}

function escapeCSV(value: string): string {
  if (value == null) return '';
  const needsQuotes = /[",\n;]/.test(value);
  const v = String(value).replace(/"/g, '""');
  return needsQuotes ? `"${v}"` : v;
}

function buildCSV(leads: Lead[]): string {
  const header = EXPORT_COLUMNS.map((c) => c.label).join(';');
  const rows = leads.map((lead, idx) =>
    EXPORT_COLUMNS.map((col) => {
      if (col.key === 'id') return String(idx + 1);
      if (col.key === 'created_at') return escapeCSV(formatDate(lead.created_at));
      if (col.key === 'telephone') return escapeCSV(cleanPhone(lead.telephone as string | null));
      if (col.key === 'consentement_rgpd') return lead.consentement_rgpd ? 'TRUE' : 'FALSE';
      return escapeCSV(String(lead[col.key] ?? ''));
    }).join(';'),
  );
  return '\uFEFF' + [header, ...rows].join('\n');
}

async function handleInsert(req: Request): Promise<Response> {
  const body = await req.json();
  const required = [
    'type_logement', 'chauffage_actuel', 'types_travaux', 'code_postal',
    'type_occupant', 'tranche_revenus', 'prenom', 'nom', 'telephone', 'email', 'consentement_rgpd',
  ];
  for (const f of required) {
    if (body[f] === undefined || body[f] === null || body[f] === '') {
      return errorResponse(`Champ manquant: ${f}`, 400);
    }
  }
  if (typeof body.consentement_rgpd !== 'boolean' || !body.consentement_rgpd) {
    return errorResponse('Consentement RGPD requis', 400);
  }
  const payload = {
    type_logement: body.type_logement,
    age_logement: body.age_logement ? parseInt(body.age_logement, 10) : null,
    superficie: body.superficie ? parseInt(body.superficie, 10) : null,
    chauffage_actuel: body.chauffage_actuel,
    types_travaux: body.types_travaux,
    code_postal: body.code_postal,
    ville: body.ville ?? null,
    type_occupant: body.type_occupant,
    nombre_personnes: body.nombre_personnes ? parseInt(body.nombre_personnes, 10) : null,
    tranche_revenus: body.tranche_revenus,
    prenom: String(body.prenom).trim(),
    nom: String(body.nom).trim(),
    telephone: String(body.telephone).replace(/\D/g, ''),
    email: String(body.email).trim(),
    consentement_rgpd: true,
  };
  const { data, error } = await supabase.from('leads').insert(payload).select().single();
  if (error) return errorResponse(error.message, 500);
  return json({ success: true, id: (data as Lead).id });
}

async function handleList(): Promise<Response> {
  const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
  if (error) return errorResponse(error.message, 500);
  return json({ leads: data });
}

async function handleDelete(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  if (!id) return errorResponse('ID requis', 400);
  const { error } = await supabase.from('leads').delete().eq('id', id);
  if (error) return errorResponse(error.message, 500);
  return json({ success: true });
}

async function handleExport(): Promise<Response> {
  const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
  if (error) return errorResponse(error.message, 500);
  const csv = buildCSV((data as Lead[]) ?? []);
  return new Response(csv, {
    headers: {
      ...corsHeaders,
      'Content-Type': 'text/csv;charset=utf-8;',
      'Content-Disposition': `attachment; filename="leads_renovation_${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }
  try {
    const url = new URL(req.url);
    const action = url.searchParams.get('action') ?? (req.method === 'POST' ? 'insert' : 'list');

    if (req.method === 'POST' && action === 'insert') return await handleInsert(req);
    if (req.method === 'GET' && action === 'list') return await handleList();
    if (req.method === 'GET' && action === 'export') return await handleExport();
    if (req.method === 'DELETE' && action === 'delete') return await handleDelete(req);

    return errorResponse('Action non supportée', 404);
  } catch (err) {
    return errorResponse(err instanceof Error ? err.message : 'Erreur serveur', 500);
  }
});
