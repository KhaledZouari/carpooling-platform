import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { PageShell } from "../components/layout/PageShell";
import { TripCard } from "../components/rides/TripCard";
import { demoTrajets } from "../data/demo";
import { trajetApi } from "../api/covoiturage";
import type { TrajetResponse } from "../types/covoiturage";

type SortOption = "Départ le plus tôt" | "Prix le plus bas" | "Plus de places";

const timeFilters = [
  { id: "morning", label: "06:00-12:00" },
  { id: "afternoon", label: "12:00-18:00" },
  { id: "evening", label: "18:00-06:00" },
];

export function RideListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const [rides, setRides] = useState<TrajetResponse[]>(demoTrajets);
  const [isLoading, setIsLoading] = useState(true);

  const [depart, setDepart] = useState(searchParams.get("depart") ?? "");
  const [arrivee, setArrivee] = useState(searchParams.get("arrivee") ?? "");
  const [date, setDate] = useState(searchParams.get("date") ?? "");
  const [places, setPlaces] = useState(searchParams.get("places") ?? "1");
  const [sortBy, setSortBy] = useState<SortOption>("Départ le plus tôt");
  const [maxPrice, setMaxPrice] = useState(150);
  const [activeTimes, setActiveTimes] = useState<string[]>([
    "morning",
    "afternoon",
    "evening",
  ]);
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  const sameRoute =
    depart.trim().length > 0 &&
    arrivee.trim().length > 0 &&
    depart.trim().toLowerCase() === arrivee.trim().toLowerCase();

  useEffect(() => {
    trajetApi
      .search({
        depart: searchParams.get("depart") ?? undefined,
        arrivee: searchParams.get("arrivee") ?? undefined,
        date: searchParams.get("date") ?? undefined,
        places: searchParams.get("places")
          ? Number(searchParams.get("places"))
          : undefined,
      })
      .then(setRides)
      .catch(() => setRides(demoTrajets))
      .finally(() => setIsLoading(false));
  }, [searchParams]);

  const filteredRides = useMemo(() => {
    const requiredSeats = Number(places || 1);
    const result = rides
      .filter((trip) => trip.prix <= maxPrice)
      .filter((trip) => trip.nbPlacesDisponibles >= requiredSeats)
      .filter((trip) => {
        const hour = new Date(trip.dateDepart).getHours();
        if (hour >= 6 && hour < 12) return activeTimes.includes("morning");
        if (hour >= 12 && hour < 18) return activeTimes.includes("afternoon");
        return activeTimes.includes("evening");
      });

    result.sort((a, b) => {
      if (sortBy === "Prix le plus bas") return a.prix - b.prix;
      if (sortBy === "Plus de places") {
        return b.nbPlacesDisponibles - a.nbPlacesDisponibles;
      }
      return new Date(a.dateDepart).getTime() - new Date(b.dateDepart).getTime();
    });

    return result;
  }, [activeTimes, maxPrice, places, rides, sortBy]);

  const updateSearch = () => {
    if (sameRoute) return;
    setIsLoading(true);
    const nextParams = new URLSearchParams();
    if (depart.trim()) nextParams.set("depart", depart.trim());
    if (arrivee.trim()) nextParams.set("arrivee", arrivee.trim());
    if (date) nextParams.set("date", date);
    if (places) nextParams.set("places", places);
    setSearchParams(nextParams);
  };

  const resetFilters = () => {
    setMaxPrice(150);
    setActiveTimes(["morning", "afternoon", "evening"]);
    setPlaces("1");
    setSortBy("Départ le plus tôt");
  };

  return (
    <PageShell>
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 pb-20 pt-28 sm:px-6">
        <div className="grid gap-4 border-b-2 border-outline pb-6 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="font-mono text-xs font-bold uppercase text-primary">
              Résultats triés par départ le plus tôt
            </p>
            <h1 className="mt-2 font-headline text-6xl font-extrabold uppercase leading-none text-on-surface">
              Tableau des trajets
            </h1>
            <p className="mt-3 font-mono text-sm font-bold uppercase text-on-surface-variant">
              {depart || "Toutes villes"} → {arrivee || "Toutes villes"}
              {date ? ` / ${new Date(date).toLocaleDateString()}` : ""}
            </p>
          </div>
          <div className="border-2 border-outline bg-primary-container px-4 py-3 font-mono text-sm font-bold uppercase">
            {filteredRides.length} départ(s)
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <aside className="transport-panel h-fit lg:sticky lg:top-24">
            <div className="border-b-2 border-outline bg-on-surface px-4 py-3 font-mono text-xs font-bold uppercase text-surface">
              Recherche
            </div>
            <div className="grid gap-4 p-4">
              <label className="grid gap-2">
                <span className="field-label">Départ</span>
                <input
                  required
                  placeholder="Paris"
                  value={depart}
                  onChange={(e) => setDepart(e.target.value)}
                />
              </label>
              <label className="grid gap-2">
                <span className="field-label">Destination</span>
                <input
                  required
                  placeholder="Lyon"
                  aria-invalid={sameRoute}
                  value={arrivee}
                  onChange={(e) => setArrivee(e.target.value)}
                />
                {sameRoute ? (
                  <span className="font-mono text-[11px] font-bold uppercase text-error">
                    Départ et destination identiques.
                  </span>
                ) : null}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="grid gap-2">
                  <span className="field-label">Date</span>
                  <input
                    type="date"
                    min={today}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </label>
                <label className="grid gap-2">
                  <span className="field-label">Places</span>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    value={places}
                    onChange={(e) => setPlaces(e.target.value)}
                  />
                </label>
              </div>
              <button
                type="button"
                onClick={updateSearch}
                disabled={sameRoute}
                className="app-button-primary"
              >
                Mettre à jour
              </button>
            </div>

            <div className="border-y-2 border-outline bg-surface-container px-4 py-3 font-mono text-xs font-bold uppercase">
              Filtres visibles
            </div>
            <div className="grid gap-4 p-4">
              <label className="grid gap-2">
                <span className="field-label">Tri</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                >
                  <option>Départ le plus tôt</option>
                  <option>Prix le plus bas</option>
                  <option>Plus de places</option>
                </select>
              </label>

              <label className="grid gap-2">
                <span className="field-label">Prix max / {maxPrice}€</span>
                <input
                  type="range"
                  min="5"
                  max="150"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="accent-primary"
                />
              </label>

              <fieldset className="grid gap-2">
                <legend className="field-label">Départ</legend>
                <div className="grid gap-2">
                  {timeFilters.map((filter) => (
                    <label
                      key={filter.id}
                      className="flex min-h-11 items-center justify-between border-2 border-outline px-3 font-mono text-xs font-bold uppercase transition-colors hover:bg-surface-container"
                    >
                      {filter.label}
                      <input
                        type="checkbox"
                        checked={activeTimes.includes(filter.id)}
                        onChange={(e) =>
                          setActiveTimes((current) =>
                            e.target.checked
                              ? [...current, filter.id]
                              : current.filter((item) => item !== filter.id),
                          )
                        }
                        className="h-5 min-h-0 w-5 accent-primary"
                      />
                    </label>
                  ))}
                </div>
              </fieldset>

              {showMoreFilters ? (
                <button type="button" onClick={resetFilters} className="app-button-secondary">
                  Réinitialiser
                </button>
              ) : null}

              <button
                type="button"
                onClick={() => setShowMoreFilters((value) => !value)}
                className="border-t-2 border-outline pt-3 text-left font-mono text-xs font-bold uppercase text-on-surface hover:text-primary"
              >
                {showMoreFilters ? "Masquer options" : "Afficher options"}
              </button>
            </div>
          </aside>

          <section aria-live="polite" aria-busy={isLoading}>
            {isLoading ? (
              <div className="grid gap-4">
                {[0, 1, 2, 3].map((item) => (
                  <div key={item} className="skeleton h-48 border-2 border-outline" />
                ))}
              </div>
            ) : filteredRides.length === 0 ? (
              <div className="transport-panel route-map grid min-h-[420px] place-items-center p-6 text-center">
                <div className="max-w-lg">
                  <div className="mx-auto mb-6 grid h-28 w-28 place-items-center border-2 border-outline bg-surface">
                    <div className="h-12 w-12 border-2 border-outline border-r-primary" />
                  </div>
                  <h2 className="font-headline text-4xl font-extrabold uppercase leading-none">
                    Aucun départ sur cette ligne
                  </h2>
                  <p className="mt-4 font-mono text-sm font-bold uppercase text-on-surface-variant">
                    Élargissez l’heure de départ ou remettez le prix maximum à 150€.
                  </p>
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="app-button-primary mt-6"
                  >
                    Relancer avec filtres larges
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredRides.map((trip, index) => (
                  <TripCard key={trip.id} trip={trip} revealDelayMs={index * 50} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </PageShell>
  );
}
