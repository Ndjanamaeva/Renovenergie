import { useState } from 'react';
import { ArrowRight, X, Leaf } from 'lucide-react';
import { IMAGES } from '@/frontend/assets/images';

type Props = {
  onStart: () => void;
  onDismiss: () => void;
};

export function WelcomePopup({ onStart, onDismiss }: Props) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-fade-up">
      <div className="relative aspect-square w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-card animate-pop">
        <button
          onClick={onDismiss}
          className="absolute right-4 top-4 z-10 rounded-full bg-white/80 p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          aria-label="Fermer"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="relative h-1/2 overflow-hidden">
          <img
            src={IMAGES.popup.renovation}
            alt="Travaux de rénovation énergétique"
            className="h-full w-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-900/80 to-transparent" />
          <div className="absolute bottom-4 left-6 flex items-center gap-2 text-white">
            <Leaf className="h-5 w-5 text-eco-400" />
            <span className="text-sm font-medium">Rénovation énergétique</span>
          </div>
        </div>

        <div className="flex h-1/2 flex-col justify-center p-6 sm:p-8">
          <h2 className="mb-2 text-xl font-extrabold text-brand-900 sm:text-2xl">
            TESTEZ GRATUITEMENT VOTRE ÉLIGIBILITÉ
          </h2>
          <p className="mb-6 text-sm text-slate-500">
            Découvrez en 2 minutes les aides auxquelles vous avez droit.
          </p>

          <button
            onClick={onStart}
            className="btn-primary w-full px-6 py-4 text-base"
          >
            Commencer le test maintenant <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function useWelcomePopup() {
  const [showPopup, setShowPopup] = useState(true);

  const dismissPopup = () => {
    sessionStorage.setItem('welcome_popup_seen', '1');
    setShowPopup(false);
  };

  const startFromPopup = () => {
    sessionStorage.setItem('welcome_popup_seen', '1');
    setShowPopup(false);
  };

  return { showPopup, dismissPopup, startFromPopup };
}
