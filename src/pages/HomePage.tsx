import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import gsap from "gsap";
import { PageShell } from "../components/layout/PageShell";
import { MaterialIcon } from "../components/MaterialIcon";
import { demoTrajets } from "../data/demo";
import { trajetApi } from "../api/covoiturage";
import type { TrajetResponse } from "../types/covoiturage";

export function HomePage() {
  const navigate = useNavigate();
  const [recentTrips, setRecentTrips] = useState<TrajetResponse[]>([]);
  const heroRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  // Search state
  const [depart, setDepart] = useState("");
  const [arrivee, setArrivee] = useState("");
  const [date, setDate] = useState("");
  const [places, setPlaces] = useState("1");

  useEffect(() => {
    trajetApi
      .search()
      .then((data) => setRecentTrips(data.slice(0, 3)))
      .catch(() => setRecentTrips(demoTrajets.slice(0, 3)));
  }, []);

  useEffect(() => {
    const tweens: gsap.core.Tween[] = [];

    if (heroRef.current) {
      const heroItems = Array.from(heroRef.current.children);
      if (heroItems.length > 0) {
        tweens.push(
          gsap.fromTo(
            heroItems,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              stagger: 0.1,
              duration: 0.8,
              ease: "power3.out",
            },
          ),
        );
      }
    }

    if (cardsRef.current) {
      const cardItems = Array.from(cardsRef.current.children);
      if (cardItems.length > 0) {
        tweens.push(
          gsap.fromTo(
            cardItems,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              stagger: 0.1,
              duration: 0.6,
              ease: "power2.out",
              delay: 0.4,
            },
          ),
        );
      }
    }

    return () => {
      tweens.forEach((tween) => tween.kill());
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (depart) params.set("depart", depart);
    if (arrivee) params.set("arrivee", arrivee);
    if (date) params.set("date", date);
    if (places) params.set("places", places);
    navigate(`/rides?${params.toString()}`);
  };

  return (
    <PageShell>
      <main className="flex-1 w-full overflow-hidden">
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex flex-col justify-center px-6 pt-32 pb-24">
          <div className="absolute top-0 right-0 w-[60vw] h-[60vw] bg-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4 -z-10" />
          <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-secondary/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4 -z-10" />

          <div
            ref={heroRef}
            className="mx-auto w-full max-w-7xl text-center flex flex-col items-center"
          >
            <span className="inline-block rounded-full bg-surface-container-low border border-white/5 px-4 py-2 text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-6 shadow-xl">
              <MaterialIcon
                name="electric_car"
                className="text-[14px] text-primary align-text-bottom mr-1"
              />{" "}
              The Future of Carpooling
            </span>

            <h1 className="max-w-4xl text-6xl md:text-8xl font-headline font-extrabold tracking-tighter text-on-surface leading-[0.9] mb-8">
              Share the journey. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                Split the cost.
              </span>
            </h1>

            <p className="max-w-2xl text-xl text-on-surface-variant font-medium mb-16">
              Connect with drivers heading your way. Experience a premium,
              eco-friendly ride-sharing platform designed for the modern
              traveler.
            </p>

            {/* Search Box inside Hero */}
            <form
              onSubmit={handleSearch}
              className="w-full max-w-5xl rounded-[2.5rem] bg-surface-container-lowest/80 backdrop-blur-2xl p-6 shadow-2xl border border-white/10 flex flex-col md:flex-row gap-4 items-center"
            >
              <div className="flex-1 w-full relative group">
                <MaterialIcon
                  name="my_location"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors"
                />
                <input
                  required
                  className="w-full rounded-2xl bg-surface-container-low border-none py-4 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-primary placeholder:text-on-surface-variant/50"
                  placeholder="Leaving from..."
                  value={depart}
                  onChange={(e) => setDepart(e.target.value)}
                />
              </div>
              <div className="flex-1 w-full relative group">
                <MaterialIcon
                  name="location_on"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors"
                />
                <input
                  required
                  className="w-full rounded-2xl bg-surface-container-low border-none py-4 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-primary placeholder:text-on-surface-variant/50"
                  placeholder="Going to..."
                  value={arrivee}
                  onChange={(e) => setArrivee(e.target.value)}
                />
              </div>
              <div className="w-full md:w-48 relative group">
                <input
                  type="date"
                  required
                  className="w-full rounded-2xl bg-surface-container-low border-none px-4 py-4 text-sm font-medium focus:ring-2 focus:ring-primary text-on-surface-variant"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div className="w-full md:w-32 relative group">
                <input
                  type="number"
                  min="1"
                  required
                  className="w-full rounded-2xl bg-surface-container-low border-none px-4 py-4 text-sm font-medium focus:ring-2 focus:ring-primary text-center"
                  placeholder="Seats"
                  value={places}
                  onChange={(e) => setPlaces(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="w-full md:w-auto h-full rounded-2xl bg-primary px-8 py-4 font-headline font-bold text-lg text-black shadow-lg shadow-primary/20 hover:bg-primary-dim hover:scale-105 transition-all active:scale-95 shrink-0"
              >
                Search
              </button>
            </form>
          </div>
        </section>

        {/* Recent Trips Section */}
        <section className="mx-auto w-full max-w-7xl px-6 pb-32">
          <div className="flex items-end justify-between mb-12">
            <h2 className="text-4xl font-headline font-extrabold text-on-surface">
              Upcoming Rides
            </h2>
            <Link
              to="/rides"
              className="text-primary font-bold hover:underline flex items-center gap-1"
            >
              View all <MaterialIcon name="arrow_forward" className="text-sm" />
            </Link>
          </div>

          <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recentTrips.map((trip) => (
              <Link
                key={trip.id}
                to={`/ride-details/${trip.id}`}
                className="group block rounded-[2.5rem] bg-surface-container-lowest border border-white/5 hover:border-primary/50 transition-all hover:-translate-y-2 shadow-2xl overflow-hidden relative"
              >
                <div className="absolute top-6 right-6 z-10">
                  <span className="bg-black/50 backdrop-blur-md text-primary font-bold px-4 py-1.5 rounded-full text-xs border border-white/10">
                    €{trip.prix.toFixed(0)}
                  </span>
                </div>
                <div className="h-48 bg-surface-container-high relative overflow-hidden flex items-center justify-center">
                  <MaterialIcon
                    name="route"
                    className="text-[120px] text-on-surface/5 transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-700"
                  />
                </div>
                <div className="p-8">
                  <h3 className="font-headline font-bold text-2xl mb-2 text-on-surface group-hover:text-primary transition-colors">
                    {trip.villeDepart} &rarr; {trip.villeArrivee}
                  </h3>
                  <p className="text-on-surface-variant font-medium flex items-center gap-2">
                    <MaterialIcon name="schedule" className="text-[16px]" />
                    {new Date(trip.dateDepart).toLocaleDateString()} at{" "}
                    {new Date(trip.dateDepart).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <div className="mt-8 flex items-center justify-between pt-6 border-t border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-surface-container-high flex items-center justify-center font-headline font-bold text-on-surface">
                        {trip.conducteurNom?.slice(0, 1) ?? "D"}
                      </div>
                      <div className="text-sm font-bold text-on-surface">
                        {trip.conducteurNom ?? "Driver"}
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-on-surface-variant bg-surface-container px-3 py-1 rounded-lg">
                      {trip.nbPlacesDisponibles} seats left
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </PageShell>
  );
}
