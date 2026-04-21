import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { PageShell } from "../components/layout/PageShell";
import { MaterialIcon } from "../components/MaterialIcon";
import { demoTrajets } from "../data/demo";
import { trajetApi } from "../api/covoiturage";
import type { TrajetResponse } from "../types/covoiturage";

export function RideListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [rides, setRides] = useState<TrajetResponse[]>(demoTrajets);
  const [depart, setDepart] = useState(searchParams.get("depart") ?? "");
  const [arrivee, setArrivee] = useState(searchParams.get("arrivee") ?? "");
  const [date, setDate] = useState(searchParams.get("date") ?? "");
  const [places, setPlaces] = useState(searchParams.get("places") ?? "");

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
      .catch(() => setRides(demoTrajets));
  }, [searchParams]);

  const updateSearch = () => {
    const nextParams = new URLSearchParams();
    if (depart) nextParams.set("depart", depart);
    if (arrivee) nextParams.set("arrivee", arrivee);
    if (date) nextParams.set("date", date);
    if (places) nextParams.set("places", places);
    setSearchParams(nextParams);
  };

  return (
    <PageShell>
      <main className="mx-auto flex max-w-7xl flex-col gap-8 px-6 pb-12 pt-24">
        <div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight">
            Available rides
          </h1>
          <p className="text-on-surface-variant">
            Paris → Lyon • Tomorrow, 24 Oct
          </p>
        </div>
        <div className="flex flex-col gap-8 lg:flex-row">
          <aside className="w-full space-y-8 lg:w-64">
            <div className="rounded-xl bg-surface-container-low p-6">
              <label className="mb-4 block text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                Sort by
              </label>
              <select className="w-full cursor-pointer border-none bg-transparent font-medium text-on-surface focus:ring-0">
                <option>Earliest departure</option>
                <option>Lowest price</option>
                <option>Shortest duration</option>
              </select>
            </div>
            <div className="rounded-xl bg-surface-container-low p-6">
              <label className="mb-6 block text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                Price range
              </label>
              <input
                type="range"
                min="10"
                max="150"
                defaultValue={80}
                className="h-1 w-full cursor-pointer appearance-none rounded-lg accent-primary"
              />
              <div className="mt-4 flex justify-between text-sm font-medium">
                <span>$10</span>
                <span>$150</span>
              </div>
            </div>
            <div className="rounded-xl bg-surface-container-low p-6">
              <label className="mb-4 block text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                Departure time
              </label>
              <div className="space-y-3 text-sm font-medium">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    className="rounded border-outline-variant text-primary"
                  />{" "}
                  Morning (06:00 - 12:00)
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    className="rounded border-outline-variant text-primary"
                  />{" "}
                  Afternoon (12:00 - 18:00)
                </label>
                <label className="flex items-center gap-3">
                  <input
                    defaultChecked
                    type="checkbox"
                    className="rounded border-outline-variant text-primary"
                  />{" "}
                  Evening (18:00 - 00:00)
                </label>
              </div>
            </div>
            <div className="rounded-xl bg-surface-container-low p-6">
              <label className="mb-4 block text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                Seats needed
              </label>
              <div className="flex gap-2">
                {["1", "2", "3+"].map((value) => (
                  <button
                    key={value}
                    type="button"
                    className={`flex-1 rounded-lg py-2 font-medium ${value === "1" ? "bg-primary text-on-primary" : "bg-surface-variant"}`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
            <div className="rounded-xl bg-surface-container-low p-6 space-y-4">
              <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                Search
              </label>
              <input
                className="w-full rounded-lg border border-outline-variant/20 bg-white px-3 py-2"
                placeholder="Departure"
                value={depart}
                onChange={(event) => setDepart(event.target.value)}
              />
              <input
                className="w-full rounded-lg border border-outline-variant/20 bg-white px-3 py-2"
                placeholder="Destination"
                value={arrivee}
                onChange={(event) => setArrivee(event.target.value)}
              />
              <input
                type="date"
                className="w-full rounded-lg border border-outline-variant/20 bg-white px-3 py-2"
                value={date}
                onChange={(event) => setDate(event.target.value)}
              />
              <input
                type="number"
                min="1"
                className="w-full rounded-lg border border-outline-variant/20 bg-white px-3 py-2"
                placeholder="Seats"
                value={places}
                onChange={(event) => setPlaces(event.target.value)}
              />
              <button
                type="button"
                onClick={updateSearch}
                className="w-full rounded-lg bg-primary px-4 py-3 font-semibold text-on-primary"
              >
                Search
              </button>
            </div>
          </aside>
          <section className="flex-1 space-y-4">
            {rides.map((trip, index) => (
              <article
                key={trip.id}
                className={`relative overflow-hidden rounded-xl ${index === 2 ? "border-2 border-primary/10 bg-primary-container/20" : "border border-transparent bg-surface-container-lowest"} flex flex-col transition-all hover:shadow-[0px_8px_24px_rgba(42,52,57,0.06)] md:flex-row`}
              >
                {index === 2 && (
                  <div className="absolute right-0 top-0 rounded-bl-lg bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-on-primary">
                    Fastest
                  </div>
                )}
                <div className="flex flex-1 flex-col gap-6 p-6 md:flex-row">
                  <div className="min-w-[120px]">
                    <div className="text-2xl font-bold">
                      {new Date(trip.dateDepart).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                    <div
                      className={`text-sm ${index === 2 ? "font-bold text-primary" : "font-medium text-on-surface-variant"}`}
                    >
                      {Math.max(1, Math.round((trip.nbPlacesTotal * 2.5) / 2))}h
                      15m
                    </div>
                    <div className="mt-1 text-2xl font-bold">
                      {new Date(
                        new Date(trip.dateDepart).getTime() +
                          2 * 60 * 60 * 1000,
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                  <div className="hidden flex-col items-center py-2 md:flex">
                    <div className="h-3 w-3 rounded-full border-2 border-primary bg-surface" />
                    <div
                      className={`w-px flex-1 ${index === 2 ? "bg-primary/30" : "bg-surface-variant"}`}
                    />
                    <div className="h-3 w-3 rounded-full bg-primary" />
                  </div>
                  <div className="flex-1 space-y-6">
                    <div className="space-y-4">
                      <div>
                        <div className="text-lg font-semibold">
                          {trip.villeDepart}
                        </div>
                        <div className="text-sm text-on-surface-variant">
                          Departure city
                        </div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold">
                          {trip.villeArrivee}
                        </div>
                        <div className="text-sm text-on-surface-variant">
                          Arrival city
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-surface-container-high" />
                      <div>
                        <div className="text-sm font-bold">
                          {trip.conducteurNom ?? "Driver"}
                        </div>
                        <div className="flex items-center text-xs text-on-surface-variant">
                          <MaterialIcon
                            name="star"
                            filled
                            className="text-xs text-yellow-500"
                          />
                          <span className="ml-1">
                            {trip.vehiculeDescription ?? "Vehicle"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row items-end justify-between border-surface-variant/30 pt-6 md:flex-col md:justify-between md:border-l md:pl-8 md:pt-0">
                    <div className="text-right">
                      <div className="text-3xl font-extrabold tracking-tight text-primary">
                        €{trip.prix.toFixed(0)}
                      </div>
                      <div className="mt-1 text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                        {trip.nbPlacesDisponibles} seats left
                      </div>
                    </div>
                    <Link
                      to={`/ride-details/${trip.id}`}
                      className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-on-primary transition-all hover:bg-primary-dim active:scale-95"
                    >
                      Book Ride
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </section>
        </div>
      </main>
    </PageShell>
  );
}
