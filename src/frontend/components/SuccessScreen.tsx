import { CheckCircle2, RotateCcw, Home } from 'lucide-react';

type Props = {
  onRestart: () => void;
  onGoHome: () => void;
};

export function SuccessScreen({ onRestart, onGoHome }: Props) {
  return (
    <div className="flex flex-col items-center text-center animate-fade-up">
      <div className="mb-6 rounded-full bg-eco-100 p-6 animate-pop">
        <CheckCircle2 className="h-20 w-20 text-eco-500" strokeWidth={1.5} />
      </div>
      <h1 className="mb-4 text-3xl font-extrabold text-brand-900 sm:text-4xl">
        Félicitations ! Vous êtes parfaitement éligible aux aides à la rénovation énergétique.
      </h1>
      <p className="mx-auto max-w-2xl text-lg text-slate-600">
        Une équipe de professionnels prendra contact avec vous dans les plus brefs délais afin de confirmer votre éligibilité et les aides auxquelles vous pouvez prétendre.
      </p>
      <div className="mt-8 rounded-2xl bg-brand-50 p-5 text-sm text-brand-800">
        Merci de votre confiance. Vous pouvez fermer cette page en toute sécurité.
      </div>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button onClick={onRestart} className="btn-primary px-8 py-3.5 text-base">
          <RotateCcw className="h-5 w-5" /> Refaire une simulation
        </button>
        <button onClick={onGoHome} className="rounded-xl border-2 border-slate-200 px-8 py-3.5 text-base font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50">
          <Home className="h-5 w-5" /> Retour à l'accueil
        </button>
      </div>
    </div>
  );
}
