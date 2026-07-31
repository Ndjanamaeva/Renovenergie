import { ShieldCheck, X } from 'lucide-react';
import { useState } from 'react';

export function LegalBanner() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) {
    return (
      <button onClick={() => setDismissed(false)} className="fixed bottom-3 right-3 z-40 rounded-full bg-brand-800 p-3 text-white shadow-soft transition hover:bg-brand-700" aria-label="Afficher les mentions légales">
        <ShieldCheck className="h-5 w-5" />
      </button>
    );
  }
  return (
    <div className="sticky bottom-0 z-40 border-t border-slate-200 bg-white/95 px-4 py-2.5 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex max-w-3xl items-start gap-2 text-[11px] leading-snug text-slate-500 sm:text-xs">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-700" />
        <p className="flex-1">Site indépendant non-affilié aux organismes gouvernementaux officiels. Ce simulateur gratuit permet d'estimer vos aides privées et publiques.</p>
        <button onClick={() => setDismissed(true)} className="shrink-0 rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600" aria-label="Fermer">
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
