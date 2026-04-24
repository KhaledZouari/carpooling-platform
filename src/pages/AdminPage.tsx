import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { PageShell } from "../components/layout/PageShell";
import { MaterialIcon } from "../components/MaterialIcon";
import { adminApi, authApi } from "../api/covoiturage";
import { useAuth } from "../context/AuthContext";
import type { AdminStatsResponse, UserResponse, TrajetResponse } from "../types/covoiturage";
import { Toast, ConfirmModal } from "../components/IHM";

export function AdminPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const [stats, setStats] = useState<AdminStatsResponse | null>(null);
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [trajets, setTrajets] = useState<TrajetResponse[]>([]);

  // Tabs
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "trips">("overview");
  const contentRef = useRef<HTMLDivElement>(null);

  // IHM States
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [confirmState, setConfirmState] = useState<{ isOpen: boolean; title: string; message: string; action: () => void; danger?: boolean }>({ isOpen: false, title: "", message: "", action: () => {} });

  const fetchData = () => {
    adminApi.getStats().then(setStats).catch(() => {});
    adminApi.getUsers().then(setUsers).catch(() => {});
    adminApi.getTrajets().then(setTrajets).catch(() => {});
  };

  useEffect(() => {
    if (!isAdmin) return;
    fetchData();
  }, [isAdmin]);

  useEffect(() => {
    if (contentRef.current && isAdmin) {
      gsap.fromTo(
        contentRef.current.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.5, ease: "power2.out" }
      );
    }
  }, [activeTab, isAdmin]);

  const toggleUserStatus = (id: number, currentStatus: boolean) => {
    setConfirmState({
      isOpen: true,
      title: currentStatus ? "Deactivate User" : "Activate User",
      message: `Are you sure you want to ${currentStatus ? "deactivate" : "activate"} this user account?`,
      danger: currentStatus,
      action: async () => {
        try {
          if (currentStatus) await adminApi.deactivateUser(id);
          else await adminApi.activateUser(id);
          setToast({ message: `User successfully ${currentStatus ? "deactivated" : "activated"}.`, type: "success" });
          fetchData();
        } catch {
          setToast({ message: "Action failed.", type: "error" });
        } finally {
          setConfirmState(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  const cancelTrip = (id: number) => {
    setConfirmState({
      isOpen: true,
      title: "Force Cancel Trip",
      message: "Are you sure you want to force cancel this trip? All reservations will be lost.",
      danger: true,
      action: async () => {
        try {
          await adminApi.cancelTrajet(id);
          setToast({ message: "Trip cancelled.", type: "success" });
          fetchData();
        } catch {
          setToast({ message: "Failed to cancel trip.", type: "error" });
        } finally {
          setConfirmState(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  if (!isAdmin) {
    return (
      <PageShell>
        <main className="mx-auto flex w-full max-w-7xl items-center justify-center flex-1 px-6 pb-24 pt-32">
          <div className="text-center bg-surface-container-lowest p-12 rounded-3xl border border-white/5 shadow-2xl max-w-md">
            <MaterialIcon name="admin_panel_settings" className="text-error text-6xl mb-4" />
            <h2 className="text-3xl font-headline font-bold mb-2">Admin Access Required</h2>
            <p className="text-on-surface-variant font-medium mb-8">This area is restricted to system administrators.</p>
            <Link to="/" className="inline-flex rounded-xl bg-primary px-6 py-3 font-bold text-black shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
              Return Home
            </Link>
          </div>
        </main>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <main className="mx-auto flex w-full max-w-7xl flex-col flex-1 px-6 pb-24 pt-32">
        {/* Header & Tabs */}
        <div className="mb-12 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-5xl font-headline font-extrabold tracking-tighter text-on-surface">
              Control Center
            </h1>
            <p className="mt-2 text-lg text-on-surface-variant font-medium">
              System monitoring and user management.
            </p>
          </div>
          
          <div className="flex bg-surface-container-low p-1.5 rounded-2xl border border-white/5 shadow-inner self-start md:self-auto overflow-x-auto no-scrollbar">
            {[
              { id: "overview", label: "Overview", icon: "dashboard" },
              { id: "users", label: "Manage Users", icon: "group" },
              { id: "trips", label: "System Trips", icon: "route" }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 whitespace-nowrap ${
                  activeTab === tab.id 
                    ? "bg-secondary text-white shadow-lg shadow-secondary/20 scale-105" 
                    : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
                }`}
              >
                <MaterialIcon name={tab.icon} className="text-xl" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div ref={contentRef} className="flex-1 w-full">
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <div className="rounded-[2rem] bg-surface-container-lowest p-8 border border-white/5 shadow-2xl relative overflow-hidden group">
                  <MaterialIcon name="group" className="absolute -bottom-6 -right-6 text-9xl text-primary/5 group-hover:scale-110 transition-transform duration-500" />
                  <div className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-2">Total Users</div>
                  <div className="text-6xl font-headline font-extrabold text-on-surface">{stats?.nbUsers ?? 0}</div>
                  <div className="mt-4 text-sm font-semibold text-primary flex items-center gap-1"><MaterialIcon name="trending_up" className="text-[16px]" /> Active platform</div>
               </div>
               <div className="rounded-[2rem] bg-surface-container-lowest p-8 border border-white/5 shadow-2xl relative overflow-hidden group">
                  <MaterialIcon name="commute" className="absolute -bottom-6 -right-6 text-9xl text-secondary/5 group-hover:scale-110 transition-transform duration-500" />
                  <div className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-2">Total Trips</div>
                  <div className="text-6xl font-headline font-extrabold text-on-surface">{stats?.nbTrajets ?? 0}</div>
                  <div className="mt-4 text-sm font-semibold text-secondary flex items-center gap-1"><MaterialIcon name="show_chart" className="text-[16px]" /> Published overall</div>
               </div>
               <div className="rounded-[2rem] bg-surface-container-lowest p-8 border border-white/5 shadow-2xl relative overflow-hidden group">
                  <MaterialIcon name="confirmation_number" className="absolute -bottom-6 -right-6 text-9xl text-primary/5 group-hover:scale-110 transition-transform duration-500" />
                  <div className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-2">Reservations</div>
                  <div className="text-6xl font-headline font-extrabold text-on-surface">{stats?.nbReservations ?? 0}</div>
                  <div className="mt-4 text-sm font-semibold text-primary flex items-center gap-1"><MaterialIcon name="task_alt" className="text-[16px]" /> Seats booked</div>
               </div>
            </div>
          )}

          {activeTab === "users" && (
            <div className="rounded-[2rem] bg-surface-container-lowest p-8 border border-white/5 shadow-2xl overflow-x-auto">
               <table className="w-full text-left border-collapse">
                  <thead>
                     <tr className="border-b border-white/10 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                        <th className="pb-4 pr-4">ID</th>
                        <th className="pb-4 px-4">Name</th>
                        <th className="pb-4 px-4">Email</th>
                        <th className="pb-4 px-4">Role</th>
                        <th className="pb-4 px-4">Status</th>
                        <th className="pb-4 pl-4 text-right">Actions</th>
                     </tr>
                  </thead>
                  <tbody>
                     {users.map(u => (
                        <tr key={u.id} className="border-b border-white/5 hover:bg-surface-container-low transition-colors group">
                           <td className="py-4 pr-4 font-bold text-on-surface-variant">#{u.id}</td>
                           <td className="py-4 px-4 font-bold text-on-surface">{u.prenom} {u.nom}</td>
                           <td className="py-4 px-4 font-medium text-on-surface-variant">{u.email}</td>
                           <td className="py-4 px-4">
                              <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${
                                 u.role === "CONDUCTEUR" ? "bg-primary/20 text-primary" : 
                                 u.role === "ADMIN" ? "bg-secondary/20 text-secondary" : 
                                 "bg-surface-container-high text-on-surface"
                              }`}>{u.role}</span>
                           </td>
                           <td className="py-4 px-4">
                              <span className={`flex items-center gap-1 text-xs font-bold ${u.actif ? "text-green-500" : "text-error"}`}>
                                 <MaterialIcon name="circle" filled className="text-[10px]" /> {u.actif ? "Active" : "Inactive"}
                              </span>
                           </td>
                           <td className="py-4 pl-4 text-right">
                              <button onClick={() => toggleUserStatus(u.id, u.actif)} className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${u.actif ? "bg-surface-container hover:bg-error/20 hover:text-error" : "bg-primary text-black hover:bg-primary-dim"}`}>
                                 {u.actif ? "Deactivate" : "Activate"}
                              </button>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
          )}

          {activeTab === "trips" && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
               {trajets.map(trip => (
                  <article key={trip.id} className="rounded-[2rem] bg-surface-container-lowest p-6 border border-white/5 shadow-xl">
                     <div className="flex justify-between items-start mb-4">
                        <div>
                           <div className="text-lg font-headline font-bold text-on-surface">{trip.villeDepart} &rarr; {trip.villeArrivee}</div>
                           <div className="text-xs font-medium text-on-surface-variant mt-1">{new Date(trip.dateDepart).toLocaleDateString()}</div>
                        </div>
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${
                           trip.statut === "OUVERT" ? "bg-primary/20 text-primary" :
                           trip.statut === "ANNULE" ? "bg-error/20 text-error" :
                           "bg-surface-container text-on-surface-variant"
                        }`}>{trip.statut}</span>
                     </div>
                     <div className="text-sm font-semibold text-on-surface-variant mb-6">
                        Driver: {trip.conducteurNom ?? `ID #${trip.conducteurId}`}
                     </div>
                     <button 
                        onClick={() => cancelTrip(trip.id)} 
                        disabled={trip.statut === "ANNULE"}
                        className="w-full py-3 rounded-xl bg-surface-container hover:bg-error/20 hover:text-error text-on-surface font-bold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                     >
                        Force Cancel
                     </button>
                  </article>
               ))}
            </div>
          )}
        </div>
      </main>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <ConfirmModal 
        isOpen={confirmState.isOpen}
        title={confirmState.title}
        message={confirmState.message}
        danger={confirmState.danger}
        onConfirm={confirmState.action}
        onCancel={() => setConfirmState(prev => ({ ...prev, isOpen: false }))}
      />
    </PageShell>
  );
}
