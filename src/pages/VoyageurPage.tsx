import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { authApi, reservationApi, trajetApi } from "../api/covoiturage";
import { MaterialIcon } from "../components/MaterialIcon";
import { PageShell } from "../components/layout/PageShell";
import { useAuth } from "../context/AuthContext";
import { demoTrajets } from "../data/demo";
import type {
  ReservationResponse,
  TrajetResponse,
  UserResponse,
} from "../types/covoiturage";

export function VoyageurPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserResponse | null>(user);
  const [trips, setTrips] = useState<TrajetResponse[]>(demoTrajets);
  const [reservations, setReservations] = useState<ReservationResponse[]>([]);

  useEffect(() => {
    authApi
      .me()
      .then(setProfile)
      .catch(() => setProfile(user));
    trajetApi
      .search()
      .then(setTrips)
      .catch(() => setTrips(demoTrajets));
    reservationApi
      .myReservations()
      .then(setReservations)
      .catch(() => setReservations([]));
  }, [user]);

  const stats = useMemo(
    () => ({
      nextTrips: trips.length,
      reservations: reservations.length,
      savedMoney: reservations.reduce(
        (sum, item) => sum + item.nbPlacesReservees * 8,
        0,
      ),
    }),
    [reservations, trips.length],
  );

  return (
    <PageShell role="voyageur">
      <main className="mx-auto max-w-7xl space-y-10 px-6 pb-12 pt-24">
        <section className="grid gap-6 lg:grid-cols-12">
          <div className="rounded-[28px] border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-cyan-50 p-8 lg:col-span-8">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-sky-100 px-3 py-1 text-xs font-bold uppercase tracking-widest text-sky-700">
              <span className="h-2 w-2 rounded-full bg-sky-500" />
              Voyageur cockpit
            </div>
            <h1 className="max-w-2xl text-5xl font-extrabold tracking-tight text-slate-900">
              Search, reserve, and track your rides from one calm space.
            </h1>
            <p className="mt-4 max-w-xl text-slate-600">
              This interface is tuned for passengers: fast discovery, active
              reservations, and simple access to driver information.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-white/80 p-5 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                  Upcoming rides
                </p>
                <p className="mt-2 text-3xl font-extrabold text-sky-700">
                  {stats.nextTrips}
                </p>
              </div>
              <div className="rounded-2xl bg-white/80 p-5 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                  Reservations
                </p>
                <p className="mt-2 text-3xl font-extrabold text-sky-700">
                  {stats.reservations}
                </p>
              </div>
              <div className="rounded-2xl bg-white/80 p-5 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                  Saved
                </p>
                <p className="mt-2 text-3xl font-extrabold text-sky-700">
                  €{stats.savedMoney}
                </p>
              </div>
            </div>
          </div>
          <aside
            id="profile"
            className="rounded-[28px] bg-slate-900 p-8 text-white lg:col-span-4"
          >
            <div className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-white/80">
              Profile
            </div>
            <div className="mt-6 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-500/20 text-xl font-bold text-sky-200">
                {profile?.prenom?.[0] ?? "U"}
                {profile?.nom?.[0] ?? ""}
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  {profile ? `${profile.prenom} ${profile.nom}` : "Voyageur"}
                </h2>
                <p className="text-sm text-white/70">
                  {profile?.email ?? "Passenger account"}
                </p>
              </div>
            </div>
            <div className="mt-8 space-y-4 text-sm text-white/80">
              <p className="rounded-2xl bg-white/5 p-4">
                Verified email and ride history are shown here for the passenger
                role.
              </p>
              <p className="rounded-2xl bg-white/5 p-4">
                This dashboard focuses on booking, not publication.
              </p>
            </div>
          </aside>
        </section>

        <section id="search" className="rounded-[28px] bg-white p-8 shadow-sm">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-sky-700">
                Search
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                Available rides
              </h2>
            </div>
            <Link
              to="/rides"
              className="text-sm font-semibold text-sky-700 hover:underline"
            >
              Open full search
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {trips.slice(0, 3).map((trip) => (
              <article
                key={trip.id}
                className="rounded-2xl border border-slate-100 bg-slate-50 p-5 transition hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900">
                      {trip.villeDepart} → {trip.villeArrivee}
                    </p>
                    <p className="text-sm text-slate-500">
                      {new Date(trip.dateDepart).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-bold uppercase tracking-widest text-sky-700">
                    €{trip.prix.toFixed(0)}
                  </span>
                </div>
                <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
                  <span>{trip.nbPlacesDisponibles} seats left</span>
                  <Link
                    to={`/ride-details/${trip.id}`}
                    className="font-semibold text-sky-700"
                  >
                    Book
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="reservations" className="grid gap-6 lg:grid-cols-12">
          <div className="rounded-[28px] bg-white p-8 lg:col-span-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-sky-700">
                  Reservations
                </p>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                  Active bookings
                </h2>
              </div>
              <MaterialIcon name="event_seat" className="text-sky-700" />
            </div>
            <div className="space-y-4">
              {reservations.length ? (
                reservations.map((reservation) => (
                  <div
                    key={reservation.id}
                    className="flex items-center justify-between rounded-2xl bg-slate-50 p-4"
                  >
                    <div>
                      <p className="font-semibold text-slate-900">
                        {reservation.trajetDescription ??
                          `Reservation ${reservation.id}`}
                      </p>
                      <p className="text-sm text-slate-500">
                        {reservation.statut} • {reservation.nbPlacesReservees}{" "}
                        seat(s)
                      </p>
                    </div>
                    <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-bold uppercase tracking-widest text-sky-700">
                      {reservation.statut}
                    </span>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-slate-500">
                  No reservations yet. Use the search above to book your next
                  ride.
                </div>
              )}
            </div>
          </div>
          <div className="rounded-[28px] bg-sky-700 p-8 text-white lg:col-span-4">
            <p className="text-xs font-bold uppercase tracking-widest text-sky-100">
              Experience
            </p>
            <h3 className="mt-2 text-2xl font-bold">Passenger-first layout</h3>
            <p className="mt-4 text-sm text-sky-50/90">
              This page is intentionally different from the conducteur and admin
              spaces: it centers search, booking, and reservation tracking.
            </p>
          </div>
        </section>
      </main>
    </PageShell>
  );
}
