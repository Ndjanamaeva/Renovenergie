import { useState } from 'react';
import { submitLead } from '@/shared/api';
import {
  initialFormState, STEP_KEYS, STEP_LABELS, STEP_ENCOURAGEMENT, TOTAL_STEPS,
  formatTravauxForDB, type FormState, type StepKey,
} from '@/shared/types';
import { ProgressBar } from '@/frontend/components/ProgressBar';
import { LegalBanner } from '@/frontend/components/LegalBanner';
import { Confetti } from '@/frontend/components/Confetti';
import { LandingPage } from '@/frontend/components/LandingPage';
import { WelcomePopup, useWelcomePopup } from '@/frontend/components/WelcomePopup';
import {
  LogementScreen, AgeLogementScreen, SuperficieScreen, ChauffageScreen,
  TravauxScreen, PostalScreen, OccupantScreen, NombrePersonnesScreen,
  RevenusScreen, CoordonneesScreen,
} from '@/frontend/components/StepScreens';
import { ReviewHub } from '@/frontend/components/ReviewHub';
import { SuccessScreen } from '@/frontend/components/SuccessScreen';

type Phase = 'landing' | 'questions' | 'review' | 'success';

export function FrontendApp() {
  const [phase, setPhase] = useState<Phase>('landing');
  const [stepIndex, setStepIndex] = useState(0);
  const [form, setForm] = useState<FormState>(initialFormState);
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');
  const [submitting, setSubmitting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [editingReturnTo, setEditingReturnTo] = useState<number | null>(null);
  const { showPopup, dismissPopup, startFromPopup } = useWelcomePopup();

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const startSimulator = () => {
    setDirection('forward');
    setPhase('questions');
    setStepIndex(0);
  };

  const goNext = () => {
    setDirection('forward');
    if (stepIndex < STEP_KEYS.length - 1) setStepIndex(stepIndex + 1);
    else setPhase('review');
  };

  const goBack = () => {
    setDirection('back');
    if (stepIndex > 0) setStepIndex(stepIndex - 1);
    else setPhase('landing');
  };

  const handleEdit = (step: StepKey) => {
    const idx = STEP_KEYS.indexOf(step);
    setEditingReturnTo(stepIndex);
    setDirection('back');
    setStepIndex(idx);
    setPhase('questions');
  };

  const handleEditNext = () => {
    if (editingReturnTo !== null) {
      setDirection('forward');
      setStepIndex(editingReturnTo);
      setEditingReturnTo(null);
      setPhase('review');
    } else goNext();
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const payload = {
      type_logement: form.type_logement ?? '',
      age_logement: parseInt(form.age_logement, 10) || 0,
      superficie: parseInt(form.superficie, 10) || 0,
      chauffage_actuel: form.chauffage_actuel === 'Autre' && form.chauffage_actuel_autre.trim() ? `Autre: ${form.chauffage_actuel_autre.trim()}` : (form.chauffage_actuel ?? ''),
      types_travaux: formatTravauxForDB(form.types_travaux, form.types_travaux_autre),
      code_postal: form.code_postal,
      ville: form.ville,
      type_occupant: form.type_occupant ?? '',
      nombre_personnes: parseInt(form.nombre_personnes, 10) || 0,
      tranche_revenus: form.tranche_revenus ?? '',
      prenom: form.prenom.trim(),
      nom: form.nom.trim(),
      telephone: form.telephone.replace(/\D/g, ''),
      email: form.email.trim(),
      consentement_rgpd: form.consentement_rgpd,
    };
    try {
      await submitLead(payload);
      setShowConfetti(true);
      setPhase('success');
      setTimeout(() => setShowConfetti(false), 6000);
    } catch {
      alert('Une erreur est survenue lors de l\'envoi. Veuillez réessayer.');
    } finally {
      setSubmitting(false);
    }
  };

  const restart = () => {
    setForm(initialFormState);
    setStepIndex(0);
    setDirection('forward');
    setPhase('questions');
    setShowConfetti(false);
  };

  const goHome = () => {
    setForm(initialFormState);
    setStepIndex(0);
    setDirection('forward');
    setPhase('landing');
    setShowConfetti(false);
  };

  const currentStepKey = STEP_KEYS[stepIndex];
  const stepNumber = stepIndex + 1;
  const progressLabel = `${STEP_LABELS[currentStepKey]} : ${STEP_ENCOURAGEMENT[currentStepKey]}`;
  const screenProps = { form, setField, onNext: editingReturnTo !== null && phase === 'questions' ? handleEditNext : goNext, onBack: goBack };
  const slideAnim = direction === 'forward' ? 'animate-slide-in' : 'animate-slide-back';

  // ─── Landing page ───
  if (phase === 'landing') {
    return (
      <>
        <LandingPage onStartSimulator={startSimulator} />
        <LegalBanner />
        {showPopup && <WelcomePopup onStart={() => { startFromPopup(); startSimulator(); }} onDismiss={dismissPopup} />}
        <a href="/admin" className="fixed bottom-2 left-2 z-50 text-[10px] text-slate-300 opacity-40 transition hover:opacity-100" aria-label="Admin" title="Admin">·</a>
      </>
    );
  }

  // ─── Simulator ───
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Confetti run={showConfetti} />
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70">
        <div className="mx-auto max-w-3xl px-4 py-4">
          {phase !== 'success' && (
            <ProgressBar current={stepNumber} total={TOTAL_STEPS} label={progressLabel} />
          )}
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center px-4 py-8">
        <div className="w-full max-w-3xl rounded-3xl bg-white p-6 shadow-card sm:p-10">
          {phase === 'questions' && (
            <div className="mb-6 border-b border-slate-100 pb-5 text-center">
              <h2 className="text-lg font-bold text-brand-900 sm:text-xl">
                Testez votre éligibilité aux aides à la rénovation énergétique
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Répondez à quelques questions pour découvrir votre éligibilité.
              </p>
            </div>
          )}
          {phase === 'questions' && (
            <div key={`${currentStepKey}-${stepIndex}`} className={slideAnim}>
              {currentStepKey === 'type_logement' && <LogementScreen {...screenProps} />}
              {currentStepKey === 'age_logement' && <AgeLogementScreen {...screenProps} />}
              {currentStepKey === 'superficie' && <SuperficieScreen {...screenProps} />}
              {currentStepKey === 'chauffage_actuel' && <ChauffageScreen {...screenProps} />}
              {currentStepKey === 'types_travaux' && <TravauxScreen {...screenProps} />}
              {currentStepKey === 'code_postal' && <PostalScreen {...screenProps} />}
              {currentStepKey === 'type_occupant' && <OccupantScreen {...screenProps} />}
              {currentStepKey === 'nombre_personnes' && <NombrePersonnesScreen {...screenProps} />}
              {currentStepKey === 'tranche_revenus' && <RevenusScreen {...screenProps} />}
              {currentStepKey === 'coordonnees' && <CoordonneesScreen {...screenProps} />}
            </div>
          )}
          {phase === 'review' && <ReviewHub form={form} onEdit={handleEdit} onSubmit={handleSubmit} submitting={submitting} />}
          {phase === 'success' && (
            <SuccessScreen onRestart={restart} onGoHome={goHome} />
          )}
        </div>
      </main>
      <LegalBanner />
      <a href="/admin" className="fixed bottom-2 left-2 z-50 text-[10px] text-slate-300 opacity-40 transition hover:opacity-100" aria-label="Admin" title="Admin">·</a>
    </div>
  );
}
