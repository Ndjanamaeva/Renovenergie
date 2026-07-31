import { useEffect, useState, useMemo } from 'react';
import { Download, Trash2, RefreshCw, Search, Lock, ArrowLeft, Database } from 'lucide-react';
import { fetchLeads, deleteLead, exportLeadsCSV, type Lead } from '@/shared/api';

const EXPORT_COLUMNS: { key: keyof Lead; label: string }[] = [
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

function formatDate(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function cleanPhone(tel: string | null): string {
  return tel ? tel.replace(/\D/g, '') : '';
}

export function AdminDashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [exporting, setExporting] = useState(false);

  const fetchLeadsData = async () => {
    setLoading(true); setError(null);
    try { setLeads(await fetchLeads()); }
    catch (err) { setError(err instanceof Error ? err.message : 'Erreur de chargement'); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (authed) fetchLeadsData(); }, [authed]);

  const filteredLeads = useMemo(() => {
    if (!search.trim()) return leads;
    const q = search.toLowerCase();
    return leads.filter((l) =>
      (l.prenom ?? '').toLowerCase().includes(q) || (l.nom ?? '').toLowerCase().includes(q) ||
      (l.email ?? '').toLowerCase().includes(q) || (l.telephone ?? '').includes(q) ||
      (l.code_postal ?? '').includes(q) || (l.ville ?? '').toLowerCase().includes(q),
    );
  }, [leads, search]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin2024') { setAuthed(true); setPasswordError(false); }
    else setPasswordError(true);
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const blob = await exportLeadsCSV();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `leads_renovation_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) { setError(err instanceof Error ? err.message : 'Erreur d\'export'); }
    finally { setExporting(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce lead définitivement ?')) return;
    try { await deleteLead(id); fetchLeadsData(); }
    catch (err) { setError(err instanceof Error ? err.message : 'Erreur de suppression'); }
  };

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-card animate-fade-up">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 inline-flex rounded-2xl bg-brand-800 p-3"><Lock className="h-7 w-7 text-white" /></div>
            <h1 className="text-2xl font-bold text-slate-800">Espace Admin</h1>
            <p className="mt-1 text-sm text-slate-500">Accès réservé aux conseillers</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mot de passe" className="input-field" autoFocus />
            {passwordError && <p className="text-sm text-red-500">Mot de passe incorrect.</p>}
            <button type="submit" className="btn-primary w-full">Se connecter</button>
          </form>
          <a href="/" className="mt-4 flex items-center justify-center gap-1.5 text-sm text-slate-400 hover:text-brand-700"><ArrowLeft className="h-4 w-4" /> Retour au simulateur</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-brand-800 p-2"><Database className="h-5 w-5 text-white" /></div>
            <div>
              <h1 className="font-bold text-slate-800">Dashboard Leads</h1>
              <p className="text-xs text-slate-500">{leads.length} lead{leads.length > 1 ? 's' : ''} au total</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={fetchLeadsData} className="rounded-xl border border-slate-200 p-2.5 text-slate-500 transition hover:bg-slate-50 hover:text-brand-700" aria-label="Rafraîchir"><RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /></button>
            <button onClick={handleExport} disabled={exporting} className="btn-primary px-4 py-2.5 text-sm"><Download className="h-4 w-4" /> {exporting ? 'Export...' : 'Exporter Excel / CSV'}</button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6">
        <div className="mb-4 relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher (nom, email, téléphone...)" className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-brand-500" />
        </div>
        {error && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">Erreur: {error}</div>}
        {loading ? (
          <div className="py-20 text-center text-slate-400">Chargement des leads...</div>
        ) : filteredLeads.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-slate-200 py-20 text-center text-slate-400">Aucun lead pour le moment. Les nouvelles soumissions apparaîtront ici.</div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-soft">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  {EXPORT_COLUMNS.map((col) => <th key={col.key} className="whitespace-nowrap px-3 py-3 font-semibold">{col.label}</th>)}
                  <th className="px-3 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLeads.map((lead, idx) => (
                  <tr key={lead.id} className="transition hover:bg-eco-50/40">
                    <td className="px-3 py-3 text-slate-400">{idx + 1}</td>
                    <td className="whitespace-nowrap px-3 py-3 text-slate-600">{formatDate(lead.created_at)}</td>
                    <td className="px-3 py-3 text-slate-700">{lead.type_logement ?? '—'}</td>
                    <td className="px-3 py-3 text-slate-700">{lead.age_logement ?? '—'}</td>
                    <td className="px-3 py-3 text-slate-700">{lead.superficie ?? '—'}</td>
                    <td className="px-3 py-3 text-slate-700">{lead.chauffage_actuel ?? '—'}</td>
                    <td className="px-3 py-3 text-slate-700">{lead.types_travaux ?? '—'}</td>
                    <td className="px-3 py-3 text-slate-700">{lead.code_postal ?? '—'}</td>
                    <td className="px-3 py-3 text-slate-700">{lead.ville ?? '—'}</td>
                    <td className="px-3 py-3 text-slate-700">{lead.type_occupant ?? '—'}</td>
                    <td className="px-3 py-3 text-slate-700">{lead.nombre_personnes ?? '—'}</td>
                    <td className="px-3 py-3 text-slate-700">{lead.tranche_revenus ?? '—'}</td>
                    <td className="px-3 py-3 font-medium text-slate-800">{lead.prenom ?? '—'}</td>
                    <td className="px-3 py-3 font-medium text-slate-800">{lead.nom ?? '—'}</td>
                    <td className="whitespace-nowrap px-3 py-3 text-slate-700">{cleanPhone(lead.telephone) || '—'}</td>
                    <td className="px-3 py-3 text-slate-700">{lead.email ?? '—'}</td>
                    <td className="px-3 py-3">{lead.consentement_rgpd ? <span className="rounded-full bg-eco-100 px-2 py-0.5 text-xs font-medium text-eco-700">TRUE</span> : <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">FALSE</span>}</td>
                    <td className="px-3 py-3"><button onClick={() => handleDelete(lead.id)} className="rounded-lg p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-500" aria-label="Supprimer"><Trash2 className="h-4 w-4" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
