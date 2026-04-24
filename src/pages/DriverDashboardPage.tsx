import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { PageShell } from "../components/layout/PageShell";
import { MaterialIcon } from "../components/MaterialIcon";
import { demoTrajets, demoUser, demoVehicules } from "../data/demo";
import { trajetApi, vehiculeApi } from "../api/covoiturage";
import { useAuth } from "../context/AuthContext";
import type { TrajetResponse, VehiculeResponse } from "../types/covoiturage";

export function DriverDashboardPage() {
  const { user } = useAuth();
  const isDriver = user?.role === "CONDUCTEUR";
  const [trajets, setTrajets] = useState<TrajetResponse[]>(demoTrajets);
  const [vehicules, setVehicules] = useState<VehiculeResponse[]>(demoVehicules);
  const [form, setForm] = useState({
    villeDepart: "",
    villeArrivee: "",
    dateDepart: "",
    nbPlacesTotal: 3,
    prix: 12,
    vehiculeId: demoVehicules[0]?.id ?? 0,
  });

  useEffect(() => {
    if (!isDriver) return;
    trajetApi
      .myTrajets()
      .then(setTrajets)
      .catch(() => setTrajets(demoTrajets));
    vehiculeApi
      .myVehicules()
      .then(setVehicules)
      .catch(() => setVehicules(demoVehicules));
  }, [isDriver]);

  const totalEarned = useMemo(
    () => trajets.reduce((sum, trip) => sum + trip.prix, 0),
    [trajets],
  );
  const rating = user?.note ?? demoUser.note ?? 4.9;

  const submitRide = async () => {
    if (!isDriver) return;
    await trajetApi.create({
      villeDepart: form.villeDepart,
      villeArrivee: form.villeArrivee,
      dateDepart: new Date(form.dateDepart).toISOString(),
      nbPlacesTotal: form.nbPlacesTotal,
      prix: form.prix,
      vehiculeId: form.vehiculeId || undefined,
    });
    const refreshed = await trajetApi.myTrajets().catch(() => demoTrajets);
    setTrajets(refreshed);
  };

  return (
    <PageShell role="conducteur">
      <main className="mx-auto max-w-7xl space-y-8 px-6 pb-12 pt-24">
        <section className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="mb-3 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-widest text-emerald-700">
              Conducteur workspace
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight">
              Conducteur Dashboard
            </h1>
            <p className="text-on-surface-variant">
              Manage your active routes, vehicle fleet, and passenger requests.
            </p>
          </div>
          <div className="flex gap-2 rounded-xl bg-surface-container-low p-1">
            <button
              type="button"
              className="rounded-lg bg-surface-container-lowest px-4 py-2 text-sm font-semibold text-primary shadow-sm"
            >
              Active Rides
            </button>
            <button
              type="button"
              className="rounded-lg px-4 py-2 text-sm font-medium text-on-surface-variant transition-all hover:bg-surface-variant/50"
            >
              Past History
            </button>
          </div>
        </section>

        {!isDriver ? (
          <section className="rounded-2xl border border-dashed border-emerald-200 bg-emerald-50 p-8 text-center">
            <h2 className="text-2xl font-bold">Driver access required</h2>
            <p className="mt-2 text-on-surface-variant">
              Sign in with a conductor account to publish and manage rides.
            </p>
            <Link
              to="/auth"
              className="mt-6 inline-flex rounded-lg bg-primary px-6 py-3 font-semibold text-on-primary"
            >
              Go to login
            </Link>
          </section>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="space-y-8 lg:col-span-4">
              <div id="stats" className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-outline-variant/10 bg-surface-container-lowest p-6">
                  <div className="mb-2 text-xs uppercase tracking-widest text-on-surface-variant">
                    Revenue
                  </div>
                  <div className="text-3xl font-bold text-primary">
                    €{totalEarned.toFixed(0)}
                  </div>
                </div>
                <div className="rounded-xl border border-outline-variant/10 bg-surface-container-lowest p-6">
                  <div className="mb-2 text-xs uppercase tracking-widest text-on-surface-variant">
                    Rating
                  </div>
                  <div className="flex items-center gap-1 text-3xl font-bold">
                    {rating.toFixed(1)}{" "}
                    <MaterialIcon
                      name="star"
                      filled
                      className="text-base text-primary"
                    />
                  </div>
                </div>
              </div>
              <section
                id="publish"
                className="rounded-xl border border-outline-variant/10 bg-surface-container-lowest p-8"
              >
                <h2 className="mb-6 text-2xl font-bold">Publish a Ride</h2>
                <form
                  className="space-y-6"
                  onSubmit={(event) => {
                    event.preventDefault();
                    submitRide();
                  }}
                >
                  <div className="space-y-4">
                    <div className="border-b border-outline-variant/20 pb-1 focus-within:border-primary">
                      <label className="block text-[10px] font-bold uppercase tracking-tight text-on-surface-variant">
                        Departure City
                      </label>
                      <input
                        className="w-full border-none bg-transparent py-2 font-medium placeholder:text-outline-variant/60 focus:ring-0"
                        placeholder="Where from?"
                        value={form.villeDepart}
                        onChange={(event) =>
                          setForm({ ...form, villeDepart: event.target.value })
                        }
                      />
                    </div>
                    <div className="border-b border-outline-variant/20 pb-1 focus-within:border-primary">
                      <label className="block text-[10px] font-bold uppercase tracking-tight text-on-surface-variant">
                        Destination City
                      </label>
                      <input
                        className="w-full border-none bg-transparent py-2 font-medium placeholder:text-outline-variant/60 focus:ring-0"
                        placeholder="Where to?"
                        value={form.villeArrivee}
                        onChange={(event) =>
                          setForm({ ...form, villeArrivee: event.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border-b border-outline-variant/20 pb-1 focus-within:border-primary">
                      <label className="block text-[10px] font-bold uppercase tracking-tight text-on-surface-variant">
                        Date
                      </label>
                      <input
                        type="datetime-local"
                        className="w-full border-none bg-transparent py-2 font-medium focus:ring-0"
                        value={form.dateDepart}
                        onChange={(event) =>
                          setForm({ ...form, dateDepart: event.target.value })
                        }
                      />
                    </div>
                    <div className="border-b border-outline-variant/20 pb-1 focus-within:border-primary">
                      <label className="block text-[10px] font-bold uppercase tracking-tight text-on-surface-variant">
                        Seats
                      </label>
                      <input
                        type="number"
                        min="1"
                        defaultValue={3}
                        className="w-full border-none bg-transparent py-2 font-medium focus:ring-0"
                        value={form.nbPlacesTotal}
                        onChange={(event) =>
                          setForm({
                            ...form,
                            nbPlacesTotal: Number(event.target.value),
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="border-b border-outline-variant/20 pb-1 focus-within:border-primary">
                    <label className="block text-[10px] font-bold uppercase tracking-tight text-on-surface-variant">
                      Vehicle
                    </label>
                    <select
                      className="w-full border-none bg-transparent py-2 font-medium focus:ring-0"
                      value={form.vehiculeId}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          vehiculeId: Number(event.target.value),
                        })
                      }
                    >
                      {vehicules.map((vehicle) => (
                        <option key={vehicle.id} value={vehicle.id}>
                          {vehicle.marque} {vehicle.modele}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="border-b border-outline-variant/20 pb-1 focus-within:border-primary">
                    <label className="block text-[10px] font-bold uppercase tracking-tight text-on-surface-variant">
                      Price
                    </label>
                    <input
                      type="number"
                      min="0"
                      className="w-full border-none bg-transparent py-2 font-medium focus:ring-0"
                      value={form.prix}
                      onChange={(event) =>
                        setForm({ ...form, prix: Number(event.target.value) })
                      }
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded-lg bg-primary py-4 font-bold text-on-primary shadow-[0px_8px_24px_rgba(0,90,194,0.15)] transition-all hover:bg-primary-dim active:scale-95"
                  >
                    Publish Route
                  </button>
                </form>
              </section>
            </div>
            <section id="trajets" className="space-y-4 lg:col-span-8">
              <h3 className="mb-2 px-2 text-sm uppercase tracking-widest text-on-surface-variant">
                Manage Your Rides
              </h3>
              {trajets.map((trip, index) => (
                <article
                  key={trip.id}
                  className={`flex flex-col items-center gap-6 rounded-xl p-6 md:flex-row ${index === 2 ? "bg-surface-container-low/50 opacity-70 grayscale" : "bg-surface-container-lowest hover:bg-surface-container-low/30"} transition-colors`}
                >
                  <div className="relative h-24 w-full overflow-hidden rounded-xl bg-surface-container md:w-32">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <MaterialIcon
                        name={index === 2 ? "check_circle" : "route"}
                        className={`text-3xl ${index === 0 ? "text-primary" : "text-secondary"}`}
                      />
                    </div>
                  </div>
                  <div className="w-full flex-1 space-y-1">
                    <div className="flex items-start justify-between">
                      <h4 className="text-lg font-bold">
                        {trip.villeDepart} to {trip.villeArrivee}
                      </h4>
                      <span
                        className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase ${index === 0 ? "bg-primary-container text-on-primary-container" : index === 1 ? "bg-surface-variant text-on-surface-variant" : "bg-surface-container-high text-on-surface-variant"}`}
                      >
                        {index === 0
                          ? "Published"
                          : index === 1
                            ? "Full"
                            : "Completed"}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-on-surface-variant">
                      {new Date(trip.dateDepart).toLocaleDateString()} •{" "}
                      {trip.nbPlacesTotal - trip.nbPlacesDisponibles}/
                      {trip.nbPlacesTotal} Seats Booked
                    </p>
                  </div>
                  <div className="flex w-full gap-2 md:w-auto">
                    <button
                      type="button"
                      className="flex-1 rounded-lg border border-outline-variant/20 px-4 py-2 text-sm font-semibold transition-all hover:bg-surface-container md:flex-none"
                    >
                      Details
                    </button>
                    <button
                      type="button"
                      className="flex-1 rounded-lg bg-surface-container-high px-4 py-2 text-sm font-semibold transition-all hover:opacity-90 md:flex-none"
                    >
                      {index === 2 ? "Review" : "Message"}
                    </button>
                  </div>
                </article>
              ))}
            </section>
          </div>
        )}
      </main>
    </PageShell>
  );
}
