import { Home, Building2, HelpCircle, Flame, Zap, Wind, Droplets, Sun, Thermometer, Snowflake, TrendingUp, TrendingDown, Minus, Info, KeyRound, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type ChoiceOption<T extends string = string> = {
  value: T;
  label: string;
  description?: string;
  icon: LucideIcon;
};

// ─── Screen 1: Type de logement ───
export const logementOptions: ChoiceOption[] = [
  { value: 'Maison', label: 'Maison', icon: Home },
  { value: 'Appartement', label: 'Appartement', icon: Building2 },
];

// ─── Screen 4: Mode de chauffage actuel (illustrated cards) ───
export const chauffageOptions: ChoiceOption[] = [
  { value: 'Chaudière Fioul', label: 'Chaudière Fioul', icon: Flame },
  { value: 'Chaudière Gaz', label: 'Chaudière Gaz', icon: Flame },
  { value: 'Chauffage Électrique', label: 'Chauffage Électrique', icon: Zap },
  { value: 'Pompe à chaleur', label: 'Pompe à chaleur', icon: Wind },
  { value: 'Poêle / Cheminée', label: 'Poêle / Cheminée', icon: Flame },
  { value: 'Autre', label: 'Autre', icon: HelpCircle },
];

// ─── Screen 5: Types de travaux (multi-select) ───
export const travauxOptions: { value: string; label: string; icon: LucideIcon }[] = [
  { value: 'PAC Air / Air', label: 'PAC Air / Air', icon: Wind },
  { value: 'PAC Air / Eau', label: 'PAC Air / Eau', icon: Droplets },
  { value: 'SSC', label: 'Système Solaire Combiné', icon: Sun },
  { value: 'Ballon solaire', label: 'Ballon solaire', icon: Sun },
  { value: 'Poêle à granulés', label: 'Poêle à granulés', icon: Flame },
  { value: 'Isolation des combles', label: 'Isolation des combles', icon: Thermometer },
];

// ─── Screen 7: Type d'occupant ───
export const occupantOptions: ChoiceOption[] = [
  { value: 'Propriétaire occupant', label: 'Propriétaire occupant', description: 'Vous vivez dans votre logement', icon: Home },
  { value: 'Propriétaire bailleur', label: 'Propriétaire bailleur', description: 'Vous faites louer votre logement.', icon: KeyRound },
  { value: 'Locataire', label: 'Locataire', description: 'Vous louez votre logement', icon: Users },
  { value: 'Occupant à titre gratuit', label: 'Occupant à titre gratuit', description: 'Vous occupez sans titre de propriété ni bail', icon: HelpCircle },
];

// ─── Screen 9: Catégorie de revenus ───
export type RevenuOption = {
  value: string;
  label: string;
  description: string;
  icon: LucideIcon;
  badgeClass: string;
  iconClass: string;
};

export const revenusOptions: RevenuOption[] = [
  {
    value: 'Entre 0 € et 20 000 €', label: 'Entre 0 € et 20 000 €',
    description: '', icon: TrendingDown,
    badgeClass: 'border-sky-200 bg-sky-50 hover:border-sky-400',
    iconClass: 'bg-sky-100 text-sky-600',
  },
  {
    value: 'Entre 20 000 € et 40 000 €', label: 'Entre 20 000 € et 40 000 €',
    description: '', icon: Minus,
    badgeClass: 'border-eco-200 bg-eco-50 hover:border-eco-400',
    iconClass: 'bg-eco-100 text-eco-600',
  },
  {
    value: 'Entre 40 000 € et 60 000 €', label: 'Entre 40 000 € et 60 000 €',
    description: '', icon: TrendingUp,
    badgeClass: 'border-amber-200 bg-amber-50 hover:border-amber-400',
    iconClass: 'bg-amber-100 text-amber-600',
  },
  {
    value: '60 000 € et plus', label: '60 000 € et plus',
    description: '', icon: TrendingUp,
    badgeClass: 'border-rose-200 bg-rose-50 hover:border-rose-400',
    iconClass: 'bg-rose-100 text-rose-600',
  },
];

export function RevenusInfoPopup({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-card animate-pop" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-full bg-brand-100 p-2"><Info className="h-5 w-5 text-brand-700" /></div>
          <h3 className="text-xl font-bold text-slate-800">Barèmes de revenus</h3>
        </div>
        <p className="mb-4 text-sm text-slate-600">
          Les barèmes ci-dessous déterminent le montant de vos aides MaPrimeRénov' et CEE. Choisissez la tranche correspondant aux revenus fiscaux de référence de votre foyer.
        </p>
        <div className="space-y-3">
          {revenusOptions.map((opt) => {
            const Icon = opt.icon;
            return (
              <div key={opt.value} className={`rounded-2xl border-2 p-4 ${opt.badgeClass}`}>
                <div className="flex items-center gap-3">
                  <div className={`rounded-xl p-2 ${opt.iconClass}`}><Icon className="h-5 w-5" /></div>
                  <div>
                    <p className="font-semibold text-slate-800">{opt.label}</p>
                    <p className="text-xs text-slate-500">{opt.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <button onClick={onClose} className="btn-primary mt-5 w-full">J'ai compris</button>
      </div>
    </div>
  );
}
