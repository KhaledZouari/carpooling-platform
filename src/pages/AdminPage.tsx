import { useEffect, useState } from "react";
import { adminApi } from "../api/covoiturage";
import { PageShell } from "../components/layout/PageShell";
import type {
  AdminStatsResponse,
  TrajetResponse,
  UserResponse,
} from "../types/covoiturage";

export function AdminPage() {
  const [stats, setStats] = useState<AdminStatsResponse | null>(null);
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [trajets, setTrajets] = useState<TrajetResponse[]>([]);

  useEffect(() => {
    adminApi
      .stats()
      .then(setStats)
      .catch(() => setStats({ nbUsers: 0, nbTrajets: 0, nbReservations: 0 }));
    adminApi
      .users()
      .then(setUsers)
      .catch(() => setUsers([]));
    adminApi
      .trajets()
      .then(setTrajets)
      .catch(() => setTrajets([]));
  }, []);

  return (
    <PageShell role="admin">
      <main className="mx-auto max-w-7xl space-y-8 px-6 pb-12 pt-24">
        <div>
          <div className="mb-3 inline-flex rounded-full bg-slate-200 px-3 py-1 text-xs font-bold uppercase tracking-widest text-slate-800">
            Admin control room
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight">
            Admin Panel
          </h1>
          <p className="text-on-surface-variant">
            User management and platform overview.
          </p>
        </div>
        <div id="stats" className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-100 bg-slate-900 p-6 text-white">
            <p className="text-xs uppercase tracking-widest text-on-surface-variant">
              Users
            </p>
            <p className="text-3xl font-bold text-white">
              {stats?.nbUsers ?? 0}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-white p-6">
            <p className="text-xs uppercase tracking-widest text-on-surface-variant">
              Trajets
            </p>
            <p className="text-3xl font-bold text-primary">
              {stats?.nbTrajets ?? 0}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-white p-6">
            <p className="text-xs uppercase tracking-widest text-on-surface-variant">
              Reservations
            </p>
            <p className="text-3xl font-bold text-primary">
              {stats?.nbReservations ?? 0}
            </p>
          </div>
        </div>
        <section
          id="users"
          className="space-y-4 rounded-2xl bg-white p-6 shadow-sm"
        >
          <h2 className="text-xl font-bold">Users</h2>
          {users.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between rounded-lg bg-surface-container-low p-4"
            >
              <div>
                <p className="font-semibold">
                  {user.prenom} {user.nom}
                </p>
                <p className="text-sm text-on-surface-variant">
                  {user.email} • {user.role}
                </p>
              </div>
              <div className="flex gap-2 text-sm">
                <button
                  type="button"
                  onClick={() => adminApi.block(user.id)}
                  className="rounded-lg bg-surface-variant px-4 py-2"
                >
                  Block
                </button>
                <button
                  type="button"
                  onClick={() => adminApi.unblock(user.id)}
                  className="rounded-lg bg-primary px-4 py-2 text-on-primary"
                >
                  Unblock
                </button>
              </div>
            </div>
          ))}
        </section>
        <section
          id="trajets"
          className="space-y-4 rounded-2xl bg-white p-6 shadow-sm"
        >
          <h2 className="text-xl font-bold">Trajets</h2>
          {trajets.map((trip) => (
            <div
              key={trip.id}
              className="flex items-center justify-between rounded-lg bg-surface-container-low p-4"
            >
              <div>
                <p className="font-semibold">
                  {trip.villeDepart} → {trip.villeArrivee}
                </p>
                <p className="text-sm text-on-surface-variant">
                  €{trip.prix.toFixed(2)} • {trip.nbPlacesDisponibles}/
                  {trip.nbPlacesTotal} seats
                </p>
              </div>
              <button
                type="button"
                onClick={() => adminApi.deleteTrajet(trip.id)}
                className="rounded-lg bg-red-100 px-4 py-2 text-red-700"
              >
                Delete
              </button>
            </div>
          ))}
        </section>
      </main>
    </PageShell>
  );
}
