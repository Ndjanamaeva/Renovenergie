import { Pencil, Home, Flame, MapPin, User, Mail, Phone, ShieldCheck, ArrowRight, Ruler, Hash, Wrench, KeyRound, TrendingUp } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { FormState, StepKey } from '@/shared/types';

type Props = { form: FormState; onEdit: (step: StepKey) => void; onSubmit: () => void; submitting: boolean };
type CardDef = { step: StepKey; icon: LucideIcon; label: string; value: string };

export function ReviewHub({ form, onEdit, onSubmit, submitting }: Props) {
  const travauxText = form.types_travaux.length > 0
    ? form.types_travaux.map((t) => t === 'Autre' && form.types_travaux_autre ? `Autre: ${form.types_travaux_autre}` : t).join(', ')
    : '—';

  const cards: CardDef[] = [
    { step: 'type_logement', icon: Home, label: 'Logement', value: form.type_logement ?? '—' },
    { step: 'age_logement', icon: Hash, label: 'Âge', value: form.age_logement ? `${form.age_logement} ans` : '—' },
    { step: 'superficie', icon: Ruler, label: 'Superficie', value: form.superficie ? `${form.superficie} m²` : '—' },
    { step: 'chauffage_actuel', icon: Flame, label: 'Chauffage', value: form.chauffage_actuel === 'Autre' && form.chauffage_actuel_autre ? `Autre: ${form.chauffage_actuel_autre}` : (form.chauffage_actuel ?? '—') },
    { step: 'types_travaux', icon: Wrench, label: 'Travaux', value: travauxText },
    { step: 'code_postal', icon: MapPin, label: 'Localisation', value: form.ville ? `${form.code_postal} · ${form.ville}` : form.code_postal || '—' },
    { step: 'type_occupant', icon: KeyRound, label: 'Statut', value: form.type_occupant ?? '—' },
    { step: 'nombre_personnes', icon: User, label: 'Foyer', value: form.nombre_personnes ? `${form.nombre_personnes} personne(s)` : '—' },
    { step: 'tranche_revenus', icon: TrendingUp, label: 'Revenus', value: form.tranche_revenus ?? '—' },
    { step: 'coordonnees', icon: User, label: 'Contact', value: `${form.prenom} ${form.nom}`.trim() || '—' },
  ];

  const contactDetails = [
    { icon: Phone, value: form.telephone },
    { icon: Mail, value: form.email },
  ];

  return (
    <div className="animate-fade-up">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-slate-800 sm:text-3xl">Résumé de vos informations</h2>
        <p className="mt-1 text-slate-500">Vérifiez vos réponses avant de calculer vos aides.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.step} className="group relative rounded-2xl border-2 border-slate-200 bg-white p-5 shadow-soft transition hover:border-brand-200">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-brand-50 p-2.5"><Icon className="h-5 w-5 text-brand-700" /></div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{card.label}</p>
                    <p className="mt-0.5 font-semibold text-slate-800">{card.value}</p>
                  </div>
                </div>
                <button onClick={() => onEdit(card.step)} className="rounded-lg p-1.5 text-slate-400 opacity-0 transition hover:bg-eco-50 hover:text-eco-600 group-hover:opacity-100" aria-label="Modifier"><Pencil className="h-4 w-4" /></button>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 rounded-2xl border-2 border-slate-200 bg-white p-5 shadow-soft">
        <div className="grid gap-3 sm:grid-cols-2">
          {contactDetails.map((c, i) => {
            const Icon = c.icon;
            return <div key={i} className="flex items-center gap-3"><Icon className="h-5 w-5 text-slate-400" /><span className="text-slate-700">{c.value || '—'}</span></div>;
          })}
        </div>
      </div>
      <div className="mt-6 flex items-center justify-center gap-2 rounded-2xl bg-eco-50 p-3 text-sm text-eco-700"><ShieldCheck className="h-4 w-4" /> Vos données sont sécurisées et conformes au RGPD</div>
      <button onClick={onSubmit} disabled={submitting} className="btn-primary mx-auto mt-6 w-full px-10 py-5 text-lg animate-pulse-soft">{submitting ? 'Calcul en cours...' : (<>Valider et Calculer mes aides <ArrowRight className="h-5 w-5" /></>)}</button>
    </div>
  );
}
