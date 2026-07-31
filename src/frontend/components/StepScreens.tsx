import { useState } from 'react';
import { ArrowRight, Info, MapPin, CheckCircle2, User, Mail, Phone, Home, Hash, Ruler } from 'lucide-react';
import {
  logementOptions, chauffageOptions, travauxOptions, occupantOptions,
  revenusOptions, RevenusInfoPopup, type ChoiceOption,
} from '@/frontend/components/choices';
import { resolveCityFromPostalCode, isValidPostalCode, formatFrenchPhone, isValidFrenchPhone, isValidEmail } from '@/shared/postal';
import type { FormState } from '@/shared/types';

type ScreenProps = {
  form: FormState;
  setField: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
  onNext: () => void;
  onBack: () => void;
};

// ───────────────────────── Reusable ChoiceGrid ─────────────────────────
function ChoiceGrid({ options, selected, onSelect, columns = 'grid-cols-1 sm:grid-cols-2' }: {
  options: ChoiceOption[]; selected: string | null; onSelect: (value: string) => void; columns?: string;
}) {
  return (
    <div className={`grid ${columns} gap-4`}>
      {options.map((opt) => {
        const Icon = opt.icon;
        const isSelected = selected === opt.value;
        return (
          <button key={opt.value} type="button" onClick={() => onSelect(opt.value)} className={`card-choice ${isSelected ? 'card-choice-selected' : ''}`}>
            <div className={`rounded-2xl p-5 transition-colors ${isSelected ? 'bg-eco-100' : 'bg-slate-50'}`}>
              <Icon className={`h-12 w-12 ${isSelected ? 'text-eco-600' : 'text-brand-700'}`} strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-lg font-semibold text-slate-800">{opt.label}</p>
              {opt.description && <p className="mt-1 text-sm text-slate-500">{opt.description}</p>}
            </div>
            {isSelected && <div className="absolute right-4 top-4"><CheckCircle2 className="h-6 w-6 text-eco-500" /></div>}
          </button>
        );
      })}
    </div>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return <button onClick={onClick} className="mt-6 text-sm font-medium text-slate-400 transition hover:text-brand-700">← Retour</button>;
}

// ───────────────────────── Screen 1: Type de logement ─────────────────────────
export function LogementScreen({ form, setField, onNext, onBack }: ScreenProps) {
  return (
    <div className="animate-slide-in">
      <h2 className="mb-2 text-2xl font-bold text-slate-800 sm:text-3xl">Quel est votre type de logement ?</h2>
      <p className="mb-6 text-slate-500">Sélectionnez le type de bien à rénover.</p>
      <ChoiceGrid options={logementOptions} selected={form.type_logement} onSelect={(v) => { setField('type_logement', v); setTimeout(onNext, 350); }} />
      <BackButton onClick={onBack} />
    </div>
  );
}

// ───────────────────────── Screen 2: Âge du logement ─────────────────────────
export function AgeLogementScreen({ form, setField, onNext, onBack }: ScreenProps) {
  const valid = form.age_logement.trim() !== '' && parseInt(form.age_logement, 10) > 0 && parseInt(form.age_logement, 10) < 500;
  return (
    <div className="animate-slide-in">
      <h2 className="mb-2 text-2xl font-bold text-slate-800 sm:text-3xl">Quel est l'âge de votre logement ?</h2>
      <p className="mb-6 text-slate-500">Indiquez l'âge approximatif en années.</p>
      <div className="mx-auto max-w-md">
        <div className="relative">
          <Home className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="number" inputMode="numeric" min="0" max="499"
            value={form.age_logement}
            onChange={(e) => setField('age_logement', e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && valid && onNext()}
            placeholder="35"
            className="input-field pl-14 text-left text-2xl"
            autoFocus
          />
          <span className="absolute right-5 top-1/2 -translate-y-1/2 text-sm text-slate-400">ans</span>
        </div>
        <button onClick={onNext} disabled={!valid} className="btn-primary mt-6 w-full">Continuer <ArrowRight className="h-5 w-5" /></button>
      </div>
      <BackButton onClick={onBack} />
    </div>
  );
}

// ───────────────────────── Screen 3: Superficie ─────────────────────────
export function SuperficieScreen({ form, setField, onNext, onBack }: ScreenProps) {
  const valid = form.superficie.trim() !== '' && parseInt(form.superficie, 10) > 0 && parseInt(form.superficie, 10) < 10000;
  return (
    <div className="animate-slide-in">
      <h2 className="mb-2 text-2xl font-bold text-slate-800 sm:text-3xl">Quelle est la superficie de votre logement ?</h2>
      <p className="mb-6 text-slate-500">Indiquez la surface habitable en m².</p>
      <div className="mx-auto max-w-md">
        <div className="relative">
          <Ruler className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="number" inputMode="numeric" min="0" max="9999"
            value={form.superficie}
            onChange={(e) => setField('superficie', e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && valid && onNext()}
            placeholder="90"
            className="input-field pl-14 text-left text-2xl"
            autoFocus
          />
          <span className="absolute right-5 top-1/2 -translate-y-1/2 text-sm text-slate-400">m²</span>
        </div>
        <button onClick={onNext} disabled={!valid} className="btn-primary mt-6 w-full">Continuer <ArrowRight className="h-5 w-5" /></button>
      </div>
      <BackButton onClick={onBack} />
    </div>
  );
}

// ───────────────────────── Screen 4: Mode de chauffage actuel ─────────────────────────
export function ChauffageScreen({ form, setField, onNext, onBack }: ScreenProps) {
  const isAutre = form.chauffage_actuel === 'Autre';
  const autreValid = form.chauffage_actuel_autre.trim().length >= 2;
  const canContinue = form.chauffage_actuel !== null && (!isAutre || autreValid);

  const handleSelect = (v: string) => {
    setField('chauffage_actuel', v);
    if (v !== 'Autre') {
      setField('chauffage_actuel_autre', '');
      setTimeout(onNext, 350);
    }
  };

  return (
    <div className="animate-slide-in">
      <h2 className="mb-2 text-2xl font-bold text-slate-800 sm:text-3xl">Quel est votre mode de chauffage actuel ?</h2>
      <p className="mb-6 text-slate-500">Indiquez votre système de chauffage principal.</p>
      <ChoiceGrid options={chauffageOptions} selected={form.chauffage_actuel} onSelect={handleSelect} columns="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" />
      {isAutre && (
        <div className="mt-4 animate-fade-up">
          <label className="mb-1.5 block text-sm font-medium text-slate-600">Précisez votre mode de chauffage</label>
          <input
            type="text"
            value={form.chauffage_actuel_autre}
            onChange={(e) => setField('chauffage_actuel_autre', e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && canContinue && onNext()}
            placeholder="Ex: Géothermie, biomasse..."
            className="input-field"
            autoFocus
          />
          <button onClick={onNext} disabled={!canContinue} className="btn-primary mt-4 w-full">Continuer <ArrowRight className="h-5 w-5" /></button>
        </div>
      )}
      <BackButton onClick={onBack} />
    </div>
  );
}

// ───────────────────────── Screen 5: Types de travaux (multi-select) ─────────────────────────
export function TravauxScreen({ form, setField, onNext, onBack }: ScreenProps) {
  const toggle = (value: string) => {
    const current = form.types_travaux;
    if (current.includes(value)) {
      setField('types_travaux', current.filter((v) => v !== value));
    } else {
      setField('types_travaux', [...current, value]);
    }
  };

  const hasSelection = form.types_travaux.length > 0;
  const showAutre = form.types_travaux.includes('Autre');

  return (
    <div className="animate-slide-in">
      <h2 className="mb-2 text-2xl font-bold text-slate-800 sm:text-3xl">Quels travaux souhaitez-vous réaliser ?</h2>
      <p className="mb-6 text-slate-500">Sélectionnez un ou plusieurs types de travaux.</p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {travauxOptions.map((opt) => {
          const Icon = opt.icon;
          const isSelected = form.types_travaux.includes(opt.value);
          return (
            <button key={opt.value} type="button" onClick={() => toggle(opt.value)}
              className={`flex items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-soft ${isSelected ? 'border-eco-500 bg-eco-50 shadow-selected' : 'border-slate-200 bg-white hover:border-brand-200'}`}>
              <div className={`rounded-xl p-3 ${isSelected ? 'bg-eco-100' : 'bg-slate-50'}`}><Icon className={`h-6 w-6 ${isSelected ? 'text-eco-600' : 'text-brand-700'}`} /></div>
              <span className="flex-1 font-semibold text-slate-800">{opt.label}</span>
              {isSelected && <CheckCircle2 className="h-6 w-6 text-eco-500" />}
            </button>
          );
        })}
        {/* Autre toggle */}
        <button type="button" onClick={() => toggle('Autre')}
          className={`flex items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-soft ${form.types_travaux.includes('Autre') ? 'border-eco-500 bg-eco-50 shadow-selected' : 'border-slate-200 bg-white hover:border-brand-200'}`}>
          <div className={`rounded-xl p-3 ${form.types_travaux.includes('Autre') ? 'bg-eco-100' : 'bg-slate-50'}`}><Info className={`h-6 w-6 ${form.types_travaux.includes('Autre') ? 'text-eco-600' : 'text-brand-700'}`} /></div>
          <span className="flex-1 font-semibold text-slate-800">Autre</span>
          {form.types_travaux.includes('Autre') && <CheckCircle2 className="h-6 w-6 text-eco-500" />}
        </button>
      </div>
      {showAutre && (
        <div className="mt-4 animate-fade-up">
          <input type="text" value={form.types_travaux_autre} onChange={(e) => setField('types_travaux_autre', e.target.value)}
            placeholder="Précisez le type de travaux" className="input-field" autoFocus />
        </div>
      )}
      <button onClick={onNext} disabled={!hasSelection} className="btn-primary mt-6 w-full">Continuer <ArrowRight className="h-5 w-5" /></button>
      <BackButton onClick={onBack} />
    </div>
  );
}

// ───────────────────────── Screen 6: Code postal ─────────────────────────
export function PostalScreen({ form, setField, onNext, onBack }: ScreenProps) {
  const valid = isValidPostalCode(form.code_postal);
  const city = valid ? resolveCityFromPostalCode(form.code_postal) : null;
  const handleChange = (raw: string) => {
    const digits = raw.replace(/\D/g, '').slice(0, 5);
    setField('code_postal', digits);
    setField('ville', isValidPostalCode(digits) ? resolveCityFromPostalCode(digits) : null);
  };
  return (
    <div className="animate-slide-in">
      <h2 className="mb-2 text-2xl font-bold text-slate-800 sm:text-3xl">Quel est votre code postal ?</h2>
      <p className="mb-6 text-slate-500">Pour adapter les aides à votre région.</p>
      <div className="mx-auto max-w-md">
        <div className="relative">
          <MapPin className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input type="text" inputMode="numeric" pattern="[0-9]*" value={form.code_postal}
            onChange={(e) => handleChange(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && valid && onNext()}
            placeholder="75001" className="input-field pl-14 text-left text-2xl tracking-[0.15em]" maxLength={5} autoFocus />
        </div>
        {city && <div className="mt-4 flex items-center justify-center gap-2 rounded-2xl bg-eco-50 p-3 text-eco-700 animate-fade-up"><MapPin className="h-4 w-4" /><span className="font-medium">{city}</span></div>}
        <button onClick={onNext} disabled={!valid} className="btn-primary mt-6 w-full">Continuer <ArrowRight className="h-5 w-5" /></button>
      </div>
      <BackButton onClick={onBack} />
    </div>
  );
}

// ───────────────────────── Screen 7: Type d'occupant ─────────────────────────
export function OccupantScreen({ form, setField, onNext, onBack }: ScreenProps) {
  return (
    <div className="animate-slide-in">
      <h2 className="mb-2 text-2xl font-bold text-slate-800 sm:text-3xl">Quel est votre type d'occupation ?</h2>
      <p className="mb-6 text-slate-500">Indiquez votre statut d'occupation.</p>
      <ChoiceGrid options={occupantOptions} selected={form.type_occupant} onSelect={(v) => { setField('type_occupant', v); setTimeout(onNext, 350); }} columns="grid-cols-1 sm:grid-cols-2" />
      <BackButton onClick={onBack} />
    </div>
  );
}

// ───────────────────────── Screen 8: Nombre de personnes ─────────────────────────
export function NombrePersonnesScreen({ form, setField, onNext, onBack }: ScreenProps) {
  const valid = form.nombre_personnes.trim() !== '' && parseInt(form.nombre_personnes, 10) > 0 && parseInt(form.nombre_personnes, 10) < 50;
  return (
    <div className="animate-slide-in">
      <h2 className="mb-2 text-2xl font-bold text-slate-800 sm:text-3xl">Combien de personnes sont déclarées à cette adresse ?</h2>

      <div className="mx-auto max-w-md">
        <div className="relative">
          <Hash className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input type="number" inputMode="numeric" min="1" max="49"
            value={form.nombre_personnes} onChange={(e) => setField('nombre_personnes', e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && valid && onNext()}
            placeholder="3" className="input-field pl-14 text-left text-2xl" autoFocus />
        </div>
        <button onClick={onNext} disabled={!valid} className="btn-primary mt-6 w-full">Continuer <ArrowRight className="h-5 w-5" /></button>
      </div>
      <BackButton onClick={onBack} />
    </div>
  );
}

// ───────────────────────── Screen 9: Catégorie de revenus ─────────────────────────
export function RevenusScreen({ form, setField, onNext, onBack }: ScreenProps) {
  const [showInfo, setShowInfo] = useState(false);
  return (
    <div className="animate-slide-in">
      <div className="mb-2 flex items-center gap-2">
        <h2 className="text-2xl font-bold text-slate-800 sm:text-3xl">Quelle est votre catégorie de revenus ?</h2>
        <button onClick={() => setShowInfo(true)} className="rounded-full bg-slate-100 p-1.5 text-slate-500 transition hover:bg-brand-100 hover:text-brand-700" aria-label="Plus d'informations"><Info className="h-4 w-4" /></button>
      </div>
      <p className="mb-6 text-slate-500">Revenus fiscaux de référence du foyer.</p>
      <div className="space-y-3">
        {revenusOptions.map((opt) => {
          const Icon = opt.icon;
          const isSelected = form.tranche_revenus === opt.value;
          return (
            <button key={opt.value} type="button" onClick={() => { setField('tranche_revenus', opt.value); setTimeout(onNext, 350); }}
              className={`flex w-full items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-soft ${opt.badgeClass} ${isSelected ? 'shadow-selected ring-2 ring-eco-500' : ''}`}>
              <div className={`rounded-xl p-3 ${opt.iconClass}`}><Icon className="h-6 w-6" /></div>
              <div className="flex-1"><p className="font-semibold text-slate-800">{opt.label}</p></div>
              {isSelected && <CheckCircle2 className="h-6 w-6 text-eco-500" />}
            </button>
          );
        })}
      </div>
      <BackButton onClick={onBack} />
      {showInfo && <RevenusInfoPopup onClose={() => setShowInfo(false)} />}
    </div>
  );
}

// ───────────────────────── Screen 10: Coordonnées ─────────────────────────
export function CoordonneesScreen({ form, setField, onNext, onBack }: ScreenProps) {
  const prenomValid = form.prenom.trim().length >= 2;
  const nomValid = form.nom.trim().length >= 2;
  const emailValid = isValidEmail(form.email);
  const phoneValid = isValidFrenchPhone(form.telephone);
  const allValid = prenomValid && nomValid && emailValid && phoneValid && form.consentement_rgpd;
  return (
    <div className="animate-slide-in">
      <h2 className="mb-2 text-2xl font-bold text-slate-800 sm:text-3xl">Vos coordonnées</h2>
      <p className="mb-6 text-slate-500">Pour recevoir votre simulation personnalisée.</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field icon={User} label="Prénom" valid={prenomValid}>
          <input type="text" value={form.prenom} onChange={(e) => setField('prenom', e.target.value)} placeholder="Jean" className="input-field" autoFocus />
        </Field>
        <Field icon={User} label="Nom" valid={nomValid}>
          <input type="text" value={form.nom} onChange={(e) => setField('nom', e.target.value)} placeholder="Dupont" className="input-field" />
        </Field>
        <Field icon={Mail} label="Adresse Email" valid={emailValid} full>
          <input type="email" value={form.email} onChange={(e) => setField('email', e.target.value)} placeholder="jean.dupont@email.fr" className="input-field" />
        </Field>
        <Field icon={Phone} label="Téléphone" valid={phoneValid} full>
          <input type="tel" inputMode="tel" value={form.telephone} onChange={(e) => setField('telephone', formatFrenchPhone(e.target.value))} placeholder="06 12 34 56 78" className="input-field" maxLength={14} />
        </Field>
      </div>
      <div className="mt-5 rounded-2xl border-2 border-eco-200 bg-eco-50 p-4">
        <label className="flex cursor-pointer items-start gap-3">
          <input type="checkbox" checked={form.consentement_rgpd} onChange={(e) => setField('consentement_rgpd', e.target.checked)} className="mt-0.5 h-5 w-5 shrink-0 rounded accent-eco-500" />
          <span className="text-sm text-slate-700">En cochant cette case, j'accepte d'être recontacté gratuitement par téléphone par vos conseillers pour l'étude de mon dossier d'éligibilité conformément aux règles RGPD.</span>
        </label>
      </div>
      <button onClick={onNext} disabled={!allValid} className="btn-primary mt-6 w-full">Continuer <ArrowRight className="h-5 w-5" /></button>
      <BackButton onClick={onBack} />
    </div>
  );
}

function Field({ icon: Icon, label, valid, full, children }: { icon: typeof User; label: string; valid: boolean; full?: boolean; children: React.ReactNode }) {
  return (
    <div className={full ? 'sm:col-span-2' : ''}>
      <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-slate-600">
        <Icon className="h-4 w-4 text-slate-400" />{label}{valid && <CheckCircle2 className="h-4 w-4 text-eco-500" />}
      </label>
      {children}
    </div>
  );
}
