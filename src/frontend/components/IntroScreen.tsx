import { ArrowRight, ShieldCheck, Clock, CheckCircle2, Zap, Leaf } from 'lucide-react';

export function IntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="text-center animate-fade-up">
      <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-eco-100 px-4 py-1.5 text-sm font-medium text-eco-700">
        <Leaf className="h-4 w-4" /> Simulateur 100% gratuit · Sans engagement
      </div>
      <h1 className="mb-4 text-3xl font-extrabold leading-tight text-brand-900 sm:text-4xl md:text-5xl">
        Simulez vos aides <span className="text-eco-600">MaPrimeRénov'</span> et CEE pour votre Pompe à Chaleur en 2 minutes
      </h1>
      <p className="mx-auto mb-8 max-w-2xl text-lg text-slate-600">
        Découvrez le montant exact de vos subventions de l'État pour changer de chauffage.
      </p>
      <button onClick={onStart} className="btn-primary mx-auto px-10 py-5 text-lg animate-pulse-soft">
        Démarrer le test gratuit <ArrowRight className="h-5 w-5" />
      </button>
      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <TrustBadge icon={Clock} title="2 minutes" text="Simulation rapide" />
        <TrustBadge icon={ShieldCheck} title="100% sécurisé" text="Vos données protégées" />
        <TrustBadge icon={CheckCircle2} title="Sans engagement" text="Réponse sous 48h" />
      </div>
      <div className="mt-8 flex items-center justify-center gap-6 text-sm text-slate-400">
        <span className="flex items-center gap-1.5"><Zap className="h-4 w-4 text-eco-500" /> Pompe à Chaleur</span>
        <span className="flex items-center gap-1.5"><Leaf className="h-4 w-4 text-eco-500" /> Économies d'énergie</span>
      </div>
    </div>
  );
}

function TrustBadge({ icon: Icon, title, text }: { icon: typeof Clock; title: string; text: string }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl bg-white p-4 shadow-soft">
      <div className="rounded-full bg-brand-50 p-3"><Icon className="h-6 w-6 text-brand-700" /></div>
      <p className="font-semibold text-slate-800">{title}</p>
      <p className="text-sm text-slate-500">{text}</p>
    </div>
  );
}
