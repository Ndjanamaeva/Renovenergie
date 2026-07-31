export type FormState = {
  type_logement: string | null;
  age_logement: string;
  superficie: string;
  chauffage_actuel: string | null;
  chauffage_actuel_autre: string;
  types_travaux: string[];
  types_travaux_autre: string;
  code_postal: string;
  ville: string | null;
  type_occupant: string | null;
  nombre_personnes: string;
  tranche_revenus: string | null;
  prenom: string;
  nom: string;
  telephone: string;
  email: string;
  consentement_rgpd: boolean;
};

export const initialFormState: FormState = {
  type_logement: null,
  age_logement: '',
  superficie: '',
  chauffage_actuel: null,
  chauffage_actuel_autre: '',
  types_travaux: [],
  types_travaux_autre: '',
  code_postal: '',
  ville: null,
  type_occupant: null,
  nombre_personnes: '',
  tranche_revenus: null,
  prenom: '',
  nom: '',
  telephone: '',
  email: '',
  consentement_rgpd: false,
};

export const STEP_KEYS = [
  'type_logement',
  'age_logement',
  'superficie',
  'chauffage_actuel',
  'types_travaux',
  'code_postal',
  'type_occupant',
  'nombre_personnes',
  'tranche_revenus',
  'coordonnees',
] as const;

export type StepKey = (typeof STEP_KEYS)[number];

export const TOTAL_STEPS = STEP_KEYS.length;

export const STEP_LABELS: Record<StepKey, string> = {
  type_logement: 'Votre logement',
  age_logement: 'Âge du bien',
  superficie: 'Superficie',
  chauffage_actuel: 'Chauffage actuel',
  types_travaux: 'Travaux souhaités',
  code_postal: 'Localisation',
  type_occupant: 'Votre statut',
  nombre_personnes: 'Foyer',
  tranche_revenus: 'Revenus',
  coordonnees: 'Coordonnées',
};

export const STEP_ENCOURAGEMENT: Record<StepKey, string> = {
  type_logement: 'C\'est parti !',
  age_logement: 'Continuez !',
  superficie: 'Bien noté !',
  chauffage_actuel: 'Bon démarrage !',
  types_travaux: 'Plus que la moitié !',
  code_postal: 'Presque fini !',
  type_occupant: 'Avancez !',
  nombre_personnes: 'Continuez !',
  tranche_revenus: 'Dernières étapes !',
  coordonnees: 'Dernière étape !',
};

export const TRAVAUX_OPTIONS = [
  'PAC Air / Air',
  'PAC Air / Eau',
  'SSC',
  'Ballon solaire',
  'Poêle à granulés',
  'Isolation des combles',
  'Autre',
] as const;

export function formatTravauxForDB(travaux: string[], autre: string): string {
  const list = [...travaux];
  if (list.includes('Autre') && autre.trim()) {
    const idx = list.indexOf('Autre');
    list[idx] = `Autre: ${autre.trim()}`;
  }
  return list.join(', ');
}
