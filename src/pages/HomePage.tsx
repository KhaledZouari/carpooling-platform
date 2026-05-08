import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PageShell } from "../components/layout/PageShell";
import { MaterialIcon } from "../components/MaterialIcon";
import { TripCard } from "../components/rides/TripCard";
import { TripSearchBar } from "../components/rides/TripSearchBar";
import { useAuth } from "../context/AuthContext";
import { demoTrajets } from "../data/demo";
import { trajetApi } from "../api/covoiturage";
import type { TrajetResponse } from "../types/covoiturage";

gsap.registerPlugin(ScrollTrigger);

const metrics = [
  { value: "08:30", label: "Premier départ affiché" },
  { value: "4.8+", label: "Conducteurs suivis" },
  { value: "44px", label: "Cibles tactiles min." },
];

const statsBar = [
  { value: "270", label: "TRAJETS DISPONIBLES" },
  { value: "1 240", label: "VOYAGEURS" },
  { value: "48", label: "VILLES" },
];

const howItWorks = [
  {
    step: "01",
    title: "RECHERCHEZ",
    description: "Entrez votre trajet et trouvez une place libre",
  },
  {
    step: "02",
    title: "RÉSERVEZ",
    description: "Confirmez en un clic, le conducteur accepte",
  },
  {
    step: "03",
    title: "VOYAGEZ",
    description: "Montez à bord, partagez le trajet",
  },
];

const popularRoutes = [
  { depart: "Tunis", arrivee: "Sfax" },
  { depart: "Sfax", arrivee: "Sousse" },
  { depart: "Tunis", arrivee: "Bizerte" },
  { depart: "Sousse", arrivee: "Monastir" },
  { depart: "Tunis", arrivee: "Nabeul" },
  { depart: "Sfax", arrivee: "Gabès" },
];

const trustSignals = [
  "PROFILS VÉRIFIÉS",
  "TRAJETS CONTRÔLÉS",
  "AVIS AUTHENTIQUES",
];

function buildRideSearchUrl(depart: string, arrivee: string) {
  const params = new URLSearchParams({ depart, arrivee });
  return `/rides?${params.toString()}`;
}

function HeroCarpoolSignal() {
  const figureRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = figureRef.current;
    if (!root) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) return;

    const ctx = gsap.context(() => {
      gsap.set(".hero-route-line", {
        strokeDasharray: 620,
        strokeDashoffset: 620,
      });

      gsap
        .timeline({
          defaults: { ease: "power2.out" },
          scrollTrigger: {
            trigger: root,
            start: "top 78%",
            once: true,
          },
        })
        .fromTo(
          root,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.42 },
        )
        .to(".hero-route-line", { strokeDashoffset: 0, duration: 0.9 }, "-=0.1")
        .fromTo(
          ".hero-carpool-scroll",
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 0.42 },
          "-=0.58",
        )
        .fromTo(
          ".hero-seat",
          { opacity: 0, scale: 0.72, transformOrigin: "center" },
          { opacity: 1, scale: 1, duration: 0.18, stagger: 0.05 },
          "-=0.2",
        )
        .fromTo(
          ".hero-badge",
          { opacity: 0, y: -8 },
          { opacity: 1, y: 0, duration: 0.2, stagger: 0.05 },
          "-=0.1",
        );

      gsap.to(".hero-carpool-motion", {
        x: 7,
        y: -2,
        duration: 0.9,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".hero-wheel-mark", {
        rotate: 360,
        transformOrigin: "center",
        duration: 0.7,
        repeat: -1,
        ease: "none",
      });

      gsap.to(".hero-carpool-scroll", {
        x: 18,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.45,
        },
      });

      gsap.to(".hero-route-line", {
        strokeWidth: 11,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.45,
        },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <figure ref={figureRef} className="transport-panel bg-surface p-3">
      <svg
        viewBox="0 0 420 260"
        role="img"
        aria-labelledby="hero-carpool-title hero-carpool-desc"
        className="h-auto w-full"
      >
        <title id="hero-carpool-title">Illustration de covoiturage</title>
        <desc id="hero-carpool-desc">
          Diagramme noir et blanc d'une voiture avec quatre places partagées
          reliées par une ligne de trajet orange.
        </desc>
        <rect
          x="1"
          y="1"
          width="418"
          height="258"
          fill="rgb(var(--color-surface))"
          stroke="rgb(var(--color-outline))"
          strokeWidth="2"
        />
        <path
          d="M26 52H394M26 104H394M26 156H394M26 208H394"
          stroke="rgb(var(--color-surface-container-high))"
          strokeWidth="2"
        />
        <path
          d="M76 24V236M154 24V236M232 24V236M310 24V236"
          stroke="rgb(var(--color-surface-container-high))"
          strokeWidth="2"
        />
        <path
          className="hero-route-line"
          d="M58 178C102 120 142 118 188 154S280 202 360 82"
          fill="none"
          stroke="rgb(var(--color-primary))"
          strokeWidth="8"
          strokeLinecap="square"
        />
        <g className="hero-carpool-scroll">
          <g className="hero-carpool-motion">
            <g className="hero-carpool-car">
              <path
                d="M98 122h202l34 42v40H64v-40l34-42Z"
                fill="rgb(var(--color-surface))"
                stroke="rgb(var(--color-outline))"
                strokeWidth="6"
                strokeLinejoin="miter"
              />
              <path d="M128 96h142l30 26H98l30-26Z" fill="rgb(var(--color-outline))" />
              <path d="M134 108h44M204 108h44" stroke="rgb(var(--color-surface))" strokeWidth="12" />
              <g className="hero-wheel-mark">
                <circle
                  cx="116"
                  cy="204"
                  r="24"
                  fill="rgb(var(--color-surface))"
                  stroke="rgb(var(--color-outline))"
                  strokeWidth="6"
                />
                <path
                  d="M116 180v48M92 204h48"
                  stroke="rgb(var(--color-outline))"
                  strokeWidth="4"
                />
                <circle cx="116" cy="204" r="7" fill="rgb(var(--color-outline))" />
              </g>
              <g className="hero-wheel-mark">
                <circle
                  cx="282"
                  cy="204"
                  r="24"
                  fill="rgb(var(--color-surface))"
                  stroke="rgb(var(--color-outline))"
                  strokeWidth="6"
                />
                <path
                  d="M282 180v48M258 204h48"
                  stroke="rgb(var(--color-outline))"
                  strokeWidth="4"
                />
                <circle cx="282" cy="204" r="7" fill="rgb(var(--color-outline))" />
              </g>
            </g>
            {[122, 174, 226, 278].map((x, index) => (
              <g key={x} className="hero-seat">
                <circle
                  cx={x}
                  cy="152"
                  r="15"
                  fill={index === 0 ? "rgb(var(--color-primary))" : "rgb(var(--color-surface))"}
                  stroke="rgb(var(--color-outline))"
                  strokeWidth="5"
                />
                <path
                  d={`M${x - 22} 184c5-18 39-18 44 0`}
                  fill="none"
                  stroke="rgb(var(--color-outline))"
                  strokeWidth="5"
                />
              </g>
            ))}
          </g>
        </g>
        <rect
          className="hero-badge"
          x="282"
          y="36"
          width="86"
          height="42"
          fill="rgb(var(--color-on-surface))"
        />
        <text
          className="hero-badge"
          x="325"
          y="63"
          textAnchor="middle"
          fill="rgb(var(--color-surface))"
          fontFamily="IBM Plex Mono, monospace"
          fontSize="18"
          fontWeight="700"
        >
          4 PLACES
        </text>
        <rect
          className="hero-badge"
          x="40"
          y="36"
          width="88"
          height="42"
          fill="rgb(var(--color-primary))"
          stroke="rgb(var(--color-outline))"
          strokeWidth="4"
        />
        <text
          className="hero-badge"
          x="84"
          y="64"
          textAnchor="middle"
          fill="rgb(var(--color-on-primary))"
          fontFamily="IBM Plex Mono, monospace"
          fontSize="20"
          fontWeight="700"
        >
          08:30
        </text>
      </svg>
      <figcaption className="border-x-2 border-b-2 border-outline bg-on-surface px-3 py-2 font-mono text-[11px] font-bold uppercase text-surface">
        Ligne partagée / sièges disponibles / départ lisible
      </figcaption>
    </figure>
  );
}

export function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recentTrips, setRecentTrips] = useState<TrajetResponse[]>([]);
  const [isLoadingRecent, setIsLoadingRecent] = useState(true);
  const homeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    trajetApi
      .search()
      .then((data) =>
        setRecentTrips(
          [...data]
            .sort(
              (a, b) =>
                new Date(a.dateDepart).getTime() -
                new Date(b.dateDepart).getTime(),
            )
            .slice(0, 3),
        ),
      )
      .catch(() => setRecentTrips(demoTrajets.slice(0, 3)))
      .finally(() => setIsLoadingRecent(false));
  }, []);

  useEffect(() => {
    const root = homeRef.current;
    if (!root) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-scroll-reveal",
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.38,
          stagger: 0.06,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".hero-scroll-reveal",
            start: "top 86%",
            once: true,
          },
        },
      );

      gsap.fromTo(
        ".departures-scroll-reveal",
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.42,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".departures-scroll-reveal",
            start: "top 82%",
            once: true,
          },
        },
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <PageShell>
      <button
        onClick={() => navigate(-1)}
        className="fixed top-24 left-6 flex items-center gap-2 px-4 py-2 font-bold text-primary hover:text-primary-dim transition-colors z-40"
        aria-label="Retour"
      >
        <MaterialIcon name="arrow_back" className="text-2xl" />
        Retour
      </button>
      <section
        ref={homeRef}
        className="route-map transport-rule relative min-h-[calc(100vh-76px)] border-b-2 border-outline pt-28"
      >
        <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-16 pt-10 sm:px-6 lg:pt-16">
          <div className="grid items-end gap-6 lg:grid-cols-[1fr_360px]">
            <div className="max-w-5xl">
              <p className="font-mono text-xs font-bold uppercase text-primary">
                Human in motion / timetable-first carpooling
              </p>
              <h1 className="mt-4 max-w-4xl font-headline text-[clamp(3.25rem,11vw,8.5rem)] font-extrabold uppercase leading-[0.86] tracking-normal text-on-surface">
                La place libre la plus lisible.
              </h1>
            </div>
            <div className="max-w-md justify-self-start lg:justify-self-end">
              <HeroCarpoolSignal />
            </div>
          </div>

          <div className="mx-auto w-full max-w-6xl">
            <TripSearchBar />
          </div>

          <div className="hero-scroll-reveal grid gap-0 border-2 border-outline bg-surface md:grid-cols-3">
            {metrics.map((item, index) => (
              <div
                key={item.label}
                className={`p-4 ${index > 0 ? "border-t-2 border-outline md:border-l-2 md:border-t-0" : ""}`}
              >
                <p className="font-mono text-4xl font-bold text-on-surface">
                  {item.value}
                </p>
                <p className="mt-2 font-mono text-xs font-bold uppercase text-on-surface-variant">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 border-2 border-outline bg-on-surface text-surface md:grid-cols-3">
          {statsBar.map((item, index) => (
            <div
              key={item.label}
              className={`flex items-center justify-between gap-4 px-5 py-5 font-mono ${index > 0 ? "border-t-2 border-surface md:border-l-2 md:border-t-0" : ""}`}
            >
              <span className="text-4xl font-bold leading-none md:text-5xl">
                {item.value}
              </span>
              <span className="text-right text-[11px] font-bold uppercase tracking-[0.22em] text-surface/90">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-8 border-b-2 border-outline pb-4">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-primary">
            SIMPLE. RAPIDE. PARTAGÉ.
          </p>
          <h2 className="mt-3 font-headline text-5xl font-extrabold uppercase leading-none text-on-surface md:text-6xl">
            COMMENT ÇA MARCHE
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {howItWorks.map((item) => (
            <article
              key={item.step}
              className="grid gap-5 border-2 border-outline bg-surface p-5 transition-colors hover:bg-primary-container/40"
            >
              <p className="font-mono text-6xl font-bold leading-none text-primary">
                {item.step}
              </p>
              <div className="grid gap-2">
                <h3 className="font-headline text-3xl font-extrabold uppercase leading-none text-on-surface">
                  {item.title}
                </h3>
                <p className="font-mono text-xs font-medium uppercase tracking-[0.12em] text-on-surface-variant">
                  {item.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-8 border-b-2 border-outline pb-4">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-primary">
            LIGNES FRÉQUENTES
          </p>
          <h2 className="mt-3 font-headline text-5xl font-extrabold uppercase leading-none text-on-surface md:text-6xl">
            TRAJETS POPULAIRES
          </h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {popularRoutes.map((route) => (
            <Link
              key={`${route.depart}-${route.arrivee}`}
              to={buildRideSearchUrl(route.depart, route.arrivee)}
              className="group flex items-center justify-between gap-4 border-2 border-outline bg-surface px-4 py-4 font-mono text-sm font-bold uppercase tracking-[0.16em] transition-colors hover:bg-on-surface hover:text-surface"
            >
              <span>{route.depart}</span>
              <span className="text-primary transition-colors group-hover:text-surface">
                →
              </span>
              <span>{route.arrivee}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y-2 border-outline bg-surface">
        <div className="mx-auto grid w-full max-w-7xl gap-4 px-4 py-5 sm:px-6 md:grid-cols-3">
          {trustSignals.map((signal) => (
            <div
              key={signal}
              className="flex items-center gap-3 font-mono text-xs font-bold uppercase tracking-[0.22em] text-on-surface"
            >
              <MaterialIcon
                name="check_circle"
                className="text-primary text-lg"
              />
              <span>{signal}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
        <div className="departures-scroll-reveal mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-xs font-bold uppercase text-primary">
              Départs récents
            </p>
            <h2 className="mt-2 font-headline text-5xl font-extrabold uppercase leading-none text-on-surface">
              Prochains créneaux
            </h2>
          </div>
          <Link to="/rides" className="app-button-secondary w-fit">
            Voir tous les trajets
          </Link>
        </div>

        <div className="grid gap-4" aria-live="polite">
          {isLoadingRecent
            ? [0, 1, 2].map((item) => (
                <TripCard
                  key={item}
                  trip={demoTrajets[0]}
                  loading
                  revealDelayMs={item * 50}
                />
              ))
            : recentTrips.map((trip, index) => (
                <TripCard
                  key={trip.id}
                  trip={trip}
                  showBookButton={trip.conducteurId !== user?.id}
                  revealDelayMs={index * 50}
                />
              ))}
        </div>
      </section>
    </PageShell>
  );
}
