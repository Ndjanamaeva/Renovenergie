// Mock postal code → city resolution for French departments.
// Maps the department prefix (first 2 digits) to a representative city.
const DEPARTMENT_CITIES: Record<string, string> = {
  '01': 'Bourg-en-Bresse', '02': 'Saint-Quentin', '03': 'Montluçon', '04': 'Manosque',
  '05': 'Gap', '06': 'Nice', '07': 'Aubenas', '08': 'Charleville-Mézières',
  '09': 'Foix', '10': 'Troyes', '11': 'Narbonne', '12': 'Rodez',
  '13': 'Marseille', '14': 'Caen', '15': 'Aurillac', '16': 'Angoulême',
  '17': 'La Rochelle', '18': 'Bourges', '19': 'Brive-la-Gaillarde', '20': 'Ajaccio',
  '21': 'Dijon', '22': 'Saint-Brieuc', '23': 'Guéret', '24': 'Périgueux',
  '25': 'Besançon', '26': 'Valence', '27': 'Évreux', '28': 'Chartres',
  '29': 'Quimper', '30': 'Nîmes', '31': 'Toulouse', '32': 'Auch',
  '33': 'Bordeaux', '34': 'Montpellier', '35': 'Rennes', '36': 'Châteauroux',
  '37': 'Tours', '38': 'Grenoble', '39': 'Lons-le-Saunier', '40': 'Mont-de-Marsan',
  '41': 'Blois', '42': 'Saint-Étienne', '43': 'Le Puy-en-Velay', '44': 'Nantes',
  '45': 'Orléans', '46': 'Cahors', '47': 'Agen', '48': 'Mende',
  '49': 'Angers', '50': 'Cherbourg-en-Cotentin', '51': 'Reims', '52': 'Chaumont',
  '53': 'Laval', '54': 'Nancy', '55': 'Verdun', '56': 'Vannes',
  '57': 'Metz', '58': 'Nevers', '59': 'Lille', '60': 'Beauvais',
  '61': 'Alençon', '62': 'Calais', '63': 'Clermont-Ferrand', '64': 'Pau',
  '65': 'Tarbes', '66': 'Perpignan', '67': 'Strasbourg', '68': 'Mulhouse',
  '69': 'Lyon', '70': 'Vesoul', '71': 'Chalon-sur-Saône', '72': 'Le Mans',
  '73': 'Chambéry', '74': 'Annecy', '75': 'Paris', '76': 'Le Havre',
  '77': 'Meaux', '78': 'Versailles', '79': 'Niort', '80': 'Amiens',
  '81': 'Castres', '82': 'Montauban', '83': 'Toulon', '84': 'Avignon',
  '85': 'La Roche-sur-Yon', '86': 'Poitiers', '87': 'Limoges', '88': 'Épinal',
  '89': 'Auxerre', '90': 'Belfort', '91': 'Évry', '92': 'Nanterre',
  '93': 'Bobigny', '94': 'Créteil', '95': 'Cergy', '97': 'Fort-de-France',
  '98': 'Bastia',
};

export function resolveCityFromPostalCode(code: string): string | null {
  if (!/^\d{5}$/.test(code)) return null;
  const dept = code.slice(0, 2);
  return DEPARTMENT_CITIES[dept] ?? null;
}

export function isValidPostalCode(code: string): boolean {
  return /^\d{5}$/.test(code);
}

export function formatFrenchPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 10);
  if (digits.length <= 2) return digits;
  const groups = digits.match(/.{1,2}/g) ?? [];
  return groups.join(' ');
}

export function isValidFrenchPhone(raw: string): boolean {
  const digits = raw.replace(/\D/g, '');
  return /^0[1-9]\d{8}$/.test(digits);
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
