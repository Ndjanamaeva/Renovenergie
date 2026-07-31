import { useState, useEffect } from 'react';
import {
  ArrowRight, Phone, Leaf, ShieldCheck, Clock, CheckCircle2, Zap, Flame, Home,
  Sun, Wind, Thermometer, FileText, Wrench, Building2, Snowflake, Droplets,
  Mail, MapPin,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Navbar } from '@/frontend/components/Navbar';
import { Brand } from '@/frontend/components/Brand';
import { useInView } from '@/frontend/hooks/useInView';
import { IMAGES } from '@/frontend/assets/images';

type Props = {
  onStartSimulator: () => void;
};

// ─────────────────────────────────────────────────────────────
// Reveal wrapper — supports multiple animation directions
// ─────────────────────────────────────────────────────────────
type RevealVariant = 'up' | 'left' | 'right' | 'top' | 'scale' | 'tl' | 'tc' | 'tr' | 'bl' | 'br';

const REVEAL_CLASS: Record<RevealVariant, string> = {
  up: 'reveal',
  left: 'reveal-left',
  right: 'reveal-right',
  top: 'reveal-top',
  scale: 'reveal-scale',
  tl: 'reveal-tl',
  tc: 'reveal-tc',
  tr: 'reveal-tr',
  bl: 'reveal-bl',
  br: 'reveal-br',
};

function Reveal({
  children,
  delay = 0,
  variant = 'up',
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  variant?: RevealVariant;
  className?: string;
}) {
  const [ref, inView] = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`${REVEAL_CLASS[variant]} ${inView ? 'is-visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// HERO SECTION
// ─────────────────────────────────────────────────────────────
function Hero({ onStartSimulator }: { onStartSimulator: () => void }) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Shift text toward the extreme left as the hero scrolls under the navbar.
  const heroShift = Math.min(scrollY, 400);
  const textTranslateX = -heroShift * 0.35 - 24;

  return (
    <section id="hero" className="relative flex min-h-[100svh] items-center overflow-hidden pt-20 pb-16 sm:pt-28 sm:pb-24 lg:pt-32 lg:pb-32">
      {/* Full-screen background image */}
      <div className="absolute inset-0">
        <img
          src={IMAGES.hero.background}
          alt="Technicien installant une pompe à chaleur"
          className="h-full w-full object-cover"
          loading="eager"
        />
        {/* Light gradient for readability — image stays clearly visible */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/45 via-slate-900/15 to-transparent backdrop-blur-[1px]" />
      </div>

      {/* Floating decorative blobs */}
      <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-eco-500/10 blur-3xl animate-float" />
      <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-brand-400/10 blur-3xl animate-float-slow" />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl items-center px-4 sm:px-8 lg:px-14">
        <div
          className="max-w-2xl animate-fade-up text-left transition-transform duration-300 ease-out"
          style={{ transform: `translateX(${textTranslateX}px)` }}
        >
          <h1 className="mb-5 text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
            Votre confort, <span className="text-eco-400">notre priorité</span>
          </h1>
          <p className="mb-8 max-w-xl text-lg text-white drop-shadow-lg">
            Votre partenaire pour la rénovation énergétique de votre logement
          </p>
          <button onClick={onStartSimulator} className="btn-primary px-8 py-4 text-base animate-pulse-soft">
            Tester mon éligibilité <ArrowRight className="h-5 w-5" />
          </button>
          <div className="mt-8 flex flex-wrap gap-6 text-sm text-brand-100">
            <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-eco-400" /> Simulation en 2 min</span>
            <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-eco-400" /> 100% sécurisé</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-eco-400" /> Sans engagement</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// SERVICES SECTION
// ─────────────────────────────────────────────────────────────
type Service = { title: string; icon: LucideIcon; image: string; description: string; hideFinancing?: boolean };

const SERVICES: Service[] = [
  { title: 'Pompe à chaleur Air / Air', icon: Wind, image: IMAGES.services.pacAirAir, description: 'Chauffage et climatisation réversible pour un confort toute l\'année.', hideFinancing: true },
  { title: 'Pompe à chaleur Air / Eau', icon: Droplets, image: IMAGES.services.pacAirEau, description: 'Système haute performance pour chauffage central et eau chaude.' },
  { title: 'Ballon solaire', icon: Sun, image: IMAGES.services.ballonSolaire, description: 'Production d\'eau chaude sanitaire grâce à l\'énergie solaire.' },
  { title: 'Système solaire combiné', icon: Sun, image: IMAGES.services.ssc, description: 'Chauffage et eau chaude alimentés par des panneaux solaires thermiques.' },
  { title: 'Poêle à granulés', icon: Flame, image: IMAGES.services.poeleGranules, description: 'Chauffage écologique et économique aux granulés de bois.' },
  { title: 'Isolation des combles', icon: Thermometer, image: IMAGES.services.isolationCombles, description: 'Réduisez vos déperditions thermiques jusqu\'à 30%.' },
];

function Services() {
  return (
    <section id="solutions" className="bg-slate-50 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4">
        <Reveal>
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-extrabold text-brand-900 sm:text-4xl">Ce que nous proposons</h2>
            <p className="mt-3 text-lg text-slate-500">Des solutions complètes pour la rénovation énergétique de votre logement.</p>
          </div>
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => {
            const Icon = s.icon;
            const variant = i % 3 === 0 ? 'left' : i % 3 === 1 ? 'up' : 'right';
            return (
              <Reveal key={s.title} delay={i * 100} variant={variant}>
                <div className="group relative h-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft transition hover:-translate-y-1.5 hover:shadow-card">
                  {/* Base card content — blurs subtly when the image covers it */}
                  <div className="transition-all duration-150 ease-out group-hover:blur-sm group-hover:scale-[1.02]">
                    <div className="relative h-44 overflow-hidden">
                      <img src={s.image} alt={s.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" />
                      <div className="absolute left-3 top-3 rounded-xl bg-white/90 p-2 backdrop-blur transition group-hover:scale-110">
                        <Icon className="h-5 w-5 text-brand-700" />
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="mb-2 text-lg font-bold text-slate-800">{s.title}</h3>
                      <p className="text-sm text-slate-500">{s.description}</p>
                      {!s.hideFinancing && (
                        <div className="mt-4 flex items-center gap-2 rounded-lg bg-eco-50 p-3">
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-eco-600" />
                          <p className="text-xs font-semibold text-eco-700">Possibilité de bénéficier d'un financement jusqu'à 100%.</p>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Full-card image reveal on hover — slides up rapidly from bottom */}
                  <div className="pointer-events-none absolute inset-0 translate-y-full transform-gpu transition-transform duration-150 ease-out group-hover:translate-y-0">
                    <img src={s.image} alt={s.title} className="h-full w-full object-cover" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/20 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="inline-flex rounded-xl bg-white/90 p-2 backdrop-blur">
                        <Icon className="h-5 w-5 text-brand-700" />
                      </div>
                      <h3 className="mt-2 text-lg font-bold text-white drop-shadow-lg">{s.title}</h3>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// ABOUT / QUI SOMMES-NOUS
// ─────────────────────────────────────────────────────────────
function About() {
  return (
    <section id="about" className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4">
        <Reveal>
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-extrabold text-brand-900 sm:text-4xl">Qui sommes-nous ?</h2>
          </div>
        </Reveal>
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <Reveal variant="left">
            <div className="max-w-xl">
              <Brand className="mb-6 text-brand-900" iconClass="text-eco-500" />
              <p className="text-lg text-slate-600">
                RénovÉnergie accompagne les particuliers dans la rénovation énergétique de leur logement. De l'audit à la pose, nous coordonnons chaque étape pour vous faire bénéficier des aides disponibles.
              </p>
            </div>
          </Reveal>
          <Reveal variant="right">
            <div className="relative overflow-hidden rounded-3xl shadow-card">
              <img
                src={IMAGES.about.technician}
                alt="Technicien installant une pompe à chaleur"
                className="h-72 w-full object-cover sm:h-96 lg:h-[460px]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-900/30 to-transparent" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// OUR COMMITMENTS
// ─────────────────────────────────────────────────────────────
const COMMITMENTS = [
  'Audit énergétique gratuit et personnalisé',
  'Devis transparent sans frais cachés',
  'Pose par des techniciens certifiés RGE',
  'Accompagnement administratif pour vos aides',
  'Service après installation réactif et durable',
  'Respect total des délais annoncés',
];

const COMMITMENT_VARIANTS: RevealVariant[] = ['tl', 'tc', 'tr', 'bl', 'up', 'br'];

function Commitments() {
  return (
    <section id="engagements" className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-4">
        <Reveal>
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-extrabold text-brand-900 sm:text-4xl">Nos engagements</h2>
            <p className="mt-3 text-lg text-slate-500">Votre satisfaction est notre priorité absolue.</p>
          </div>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {COMMITMENTS.map((c, i) => {
            const variant = COMMITMENT_VARIANTS[i % COMMITMENT_VARIANTS.length];
            return (
            <Reveal key={i} delay={i * 140} variant={variant}>
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:-translate-y-1 hover:border-eco-200 hover:bg-eco-50/30 hover:shadow-soft">
                <div className="shrink-0 rounded-full bg-eco-100 p-2"><CheckCircle2 className="h-5 w-5 text-eco-600" /></div>
                <p className="font-medium text-slate-700">{c}</p>
              </div>
            </Reveal>
          );
          })}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// AVAILABLE AID
// ─────────────────────────────────────────────────────────────
const AIDS: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: Zap, title: 'MaPrimeRénov\'', text: 'Aide de l\'État pour les propriétaires, versée directement après les travaux.' },
  { icon: Leaf, title: 'Certificats d\'Économies d\'Énergie (CEE)', text: 'Primes énergie versées par les fournisseurs d\'énergie pour vos travaux.' },
  { icon: Building2, title: 'Aides locales', text: 'Subventions des collectivités locales et régionales selon votre commune.' },
  { icon: Snowflake, title: 'Éco-PTZ', text: 'Prêt à taux zéro pour financer le reste à charge de vos travaux.' },
];

function Aids() {
  return (
    <section id="aides" className="bg-gradient-to-br from-brand-50 to-eco-50 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4">
        <Reveal>
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-extrabold text-brand-900 sm:text-4xl">Les aides disponibles</h2>
            <p className="mt-3 text-lg text-slate-500">Profitez des dispositifs publics et privés pour financer vos travaux.</p>
          </div>
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {AIDS.map((a, i) => {
            const Icon = a.icon;
            return (
              <Reveal key={a.title} delay={i * 100} variant="scale">
                <div className="h-full rounded-2xl bg-white p-6 shadow-soft transition hover:-translate-y-1.5 hover:shadow-card">
                  <div className="mb-4 inline-flex rounded-2xl bg-eco-100 p-3 transition hover:scale-110"><Icon className="h-7 w-7 text-eco-600" /></div>
                  <h3 className="mb-2 text-lg font-bold text-slate-800">{a.title}</h3>
                  <p className="text-sm text-slate-500">{a.text}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// PROCESS / STEPS
// ─────────────────────────────────────────────────────────────
const STEPS: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: FileText, title: '1. Simulation', text: 'Testez votre éligibilité en ligne en moins de 2 minutes.' },
  { icon: Phone, title: '2. Contact', text: 'Un conseiller vous rappelle pour valider votre dossier.' },
  { icon: Home, title: '3. Audit', text: 'Visite technique gratuite à votre domicile par un expert.' },
  { icon: Wrench, title: '4. Travaux', text: 'Installation par nos techniciens certifiés RGE.' },
  { icon: CheckCircle2, title: '5. Suivi', text: 'Nous avons un service après installation pour vérifier la qualité des travaux effectués.' },
];

function Process() {
  return (
    <section id="process" className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4">
        <Reveal>
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-extrabold text-brand-900 sm:text-4xl">Comment ça marche ? </h2>
            <p className="mt-3 text-lg text-slate-500">Un parcours simple et accompagné de bout en bout.</p>
          </div>
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            return (
              <Reveal key={i} delay={i * 500} variant="left">
                <div className="relative h-full rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center transition hover:-translate-y-1.5 hover:border-brand-200 hover:bg-white hover:shadow-card">
                  <div className="mx-auto mb-4 inline-flex rounded-2xl bg-brand-50 p-4 transition hover:scale-110"><Icon className="h-7 w-7 text-brand-700" /></div>
                  <h3 className="mb-2 text-base font-bold text-slate-800">{s.title}</h3>
                  <p className="text-sm text-slate-500">{s.text}</p>
                  {i < STEPS.length - 1 && (
                    <div className="absolute -right-3 top-1/2 hidden -translate-y-1/2 lg:block"><ArrowRight className="h-5 w-5 text-slate-300" /></div>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// CTA + FOOTER
// ─────────────────────────────────────────────────────────────
function CTA({ onStartSimulator }: { onStartSimulator: () => void }) {
  return (
    <section className="bg-gradient-to-br from-brand-800 to-brand-900 py-16 sm:py-24">
      <Reveal>
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="mb-4 text-3xl font-extrabold text-white sm:text-4xl">Prêt pour la rénovation énergétique de votre logement ?</h2>
          <p className="mb-8 text-lg text-brand-100">Testez votre éligibilité gratuitement. Un conseiller vous rappelle sous 48h.</p>
          <button onClick={onStartSimulator} className="btn-primary mx-auto px-10 py-5 text-lg animate-pulse-soft">
            Tester mon éligibilité <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </Reveal>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-slate-900 py-12 text-slate-400">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Brand className="mb-4 text-white" iconClass="text-eco-400" />
            <p className="text-sm">Votre partenaire pour la rénovation énergétique. Des solutions durables pour votre confort.</p>
          </div>
          <div>
            <h4 className="mb-3 font-semibold text-white">Nos services</h4>
            <ul className="space-y-2 text-sm">
              <li>Pompe à chaleur Air / Air</li>
              <li>Pompe à chaleur Air / Eau</li>
              <li>Système solaire combiné</li>
              <li>Poêle à granulés</li>
              <li>Ballon solaire</li>
              <li>Isolation des combles</li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 font-semibold text-white">Aides</h4>
            <ul className="space-y-2 text-sm">
              <li>MaPrimeRénov</li>
              <li>Certificats d'Économies d'Énergie</li>
              <li>Éco-PTZ</li>
              <li>Aides locales</li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 font-semibold text-white">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> renovenergie@gmail.com</li>
              <li className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Paris, France</li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-slate-800 pt-6 text-center text-xs text-slate-500">
          <p>Site indépendant non-affilié aux organismes gouvernementaux officiels. Mentions légales · Politique de confidentialité · RGPD</p>
        </div>
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN LANDING PAGE
// ─────────────────────────────────────────────────────────────
export function LandingPage({ onStartSimulator }: Props) {
  return (
    <div className="min-h-screen bg-white">
      <Navbar onStartSimulator={onStartSimulator} />
      <Hero onStartSimulator={onStartSimulator} />
      <About />
      <Services />
      <Commitments />
      <Aids />
      <Process />
      <CTA onStartSimulator={onStartSimulator} />
      <Footer />
    </div>
  );
}
