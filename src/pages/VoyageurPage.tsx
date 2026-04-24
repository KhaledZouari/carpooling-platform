import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { authApi, reservationApi, trajetApi, avisApi } from "../api/covoiturage";
import { MaterialIcon } from "../components/MaterialIcon";
import { PageShell } from "../components/layout/PageShell";
import { useAuth } from "../context/AuthContext";
import { demoTrajets } from "../data/demo";
import type { ReservationResponse, TrajetResponse, UserResponse } from "../types/covoiturage";
import { Toast, ConfirmModal } from "../components/IHM";

export function VoyageurPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserResponse | null>(user);
  const [trips, setTrips] = useState<TrajetResponse[]>(demoTrajets);
  const [reservations, setReservations] = useState<ReservationResponse[]>([]);

  // Tabs
  const [activeTab, setActiveTab] = useState<"bookings" | "discover" | "profile">("bookings");
  const contentRef = useRef<HTMLDivElement>(null);

  // IHM States
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [confirmState, setConfirmState] = useState<{ isOpen: boolean; title: string; message: string; action: () => void; danger?: boolean }>({ isOpen: false, title: "", message: "", action: () => {} });
  const [reviewModal, setReviewModal] = useState<{ isOpen: boolean; trajetId: number | null }>({ isOpen: false, trajetId: null });
  const [reviewForm, setReviewForm] = useState({ note: 5, commentaire: "" });

  const fetchData = () => {
    authApi.me().then(setProfile).catch(() => setProfile(user));
    trajetApi.search().then(setTrips).catch(() => setTrips(demoTrajets));
    reservationApi.myReservations().then(setReservations).catch(() => setReservations([]));
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  useEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.6, ease: "power3.out" }
      );
    }
  }, [activeTab]);

  const confirmCancelReservation = (id: number) => {
    setConfirmState({
      isOpen: true,
      title: "Cancel Booking",
      message: "Are you sure you want to cancel this booking? The driver will be notified.",
      danger: true,
      action: async () => {
        try {
          await reservationApi.annuler(id);
          setToast({ message: "Booking cancelled successfully.", type: "success" });
          fetchData();
        } catch {
          setToast({ message: "Failed to cancel booking.", type: "error" });
        } finally {
          setConfirmState(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  const submitReview = async () => {
    if (!reviewModal.trajetId) return;
    try {
      await avisApi.create({ trajetId: reviewModal.trajetId, note: reviewForm.note, commentaire: reviewForm.commentaire });
      setToast({ message: "Review submitted successfully! Thank you.", type: "success" });
      setReviewModal({ isOpen: false, trajetId: null });
      setReviewForm({ note: 5, commentaire: "" });
    } catch {
      setToast({ message: "Failed to submit review.", type: "error" });
    }
  };

  return (
    <PageShell>
      <main className="mx-auto flex w-full max-w-7xl flex-col flex-1 px-6 pb-24 pt-32">
        {/* Header & Tabs */}
        <div className="mb-12 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-5xl font-headline font-extrabold tracking-tighter text-on-surface">
              Passenger Space
            </h1>
            <p className="mt-2 text-lg text-on-surface-variant font-medium">
              Manage your bookings and discover new rides.
            </p>
          </div>
          
          <div className="flex bg-surface-container-low p-1.5 rounded-2xl border border-outline-variant/60 shadow-inner self-start md:self-auto">
            {[
              { id: "bookings", label: "My Bookings", icon: "book_online" },
              { id: "discover", label: "Discover", icon: "explore" },
              { id: "profile", label: "Profile", icon: "person" }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() =>
                  setActiveTab(tab.id as "bookings" | "discover" | "profile")
                }
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
                  activeTab === tab.id 
                    ? "bg-primary text-on-primary shadow-lg shadow-primary/20 scale-105" 
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
        <div ref={contentRef} className="flex-1">
          {activeTab === "bookings" && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {reservations.length === 0 ? (
                <div className="col-span-full rounded-3xl border border-dashed border-outline-variant/30 bg-surface-container-lowest p-16 text-center">
                   <MaterialIcon name="directions_car" className="text-6xl text-on-surface-variant/30 mb-4" />
                   <h3 className="text-2xl font-headline font-bold mb-2">No active bookings</h3>
                   <p className="text-on-surface-variant">You haven't booked any rides yet.</p>
                   <button onClick={() => setActiveTab("discover")} className="mt-6 px-6 py-3 bg-surface-container-high hover:bg-surface-variant rounded-xl font-bold transition-colors">
                      Discover Rides
                   </button>
                </div>
              ) : (
                reservations.map(res => {
                  const isActive = res.statut === "EN_ATTENTE" || res.statut === "CONFIRMEE";
                  const isDone = res.statut === "CONFIRMEE"; // Mocking completion

                  return (
                    <article key={res.id} className="group relative overflow-hidden rounded-2xl bg-surface-container-lowest p-6 border border-outline-variant/60 hover:border-primary/50 transition-colors shadow-[0_12px_32px_rgba(31,41,51,0.08)]">
                      <div className="absolute top-0 right-0 p-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                          res.statut === "CONFIRMEE" ? "bg-primary/20 text-primary" :
                          res.statut === "EN_ATTENTE" ? "bg-amber-500/20 text-amber-500" :
                          res.statut === "REFUSEE" ? "bg-red-500/20 text-red-500" :
                          "bg-surface-variant text-on-surface-variant"
                        }`}>
                          {res.statut}
                        </span>
                      </div>
                      
                      <div className="mt-8 mb-6">
                        <h3 className="text-xl font-headline font-bold text-on-surface line-clamp-2">
                          {res.trajetDescription ?? `Ride #${res.trajetId}`}
                        </h3>
                        <p className="mt-2 text-on-surface-variant text-sm font-medium">
                          {res.nbPlacesReservees} seat(s) reserved
                        </p>
                      </div>

                      <div className="flex gap-2 mt-auto pt-4 border-t border-outline-variant/10">
                        {isActive && (
                          <button onClick={() => confirmCancelReservation(res.id)} className="flex-1 py-2.5 rounded-xl bg-surface-container hover:bg-red-500/20 hover:text-red-400 font-semibold text-sm transition-colors text-on-surface">
                            Cancel
                          </button>
                        )}
                        {isDone && (
                          <button onClick={() => setReviewModal({ isOpen: true, trajetId: res.trajetId ?? null })} className="flex-1 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-sm hover:bg-primary-dim transition-colors shadow-lg shadow-primary/20">
                            Leave Review
                          </button>
                        )}
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          )}

          {activeTab === "discover" && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                 <h2 className="text-3xl font-headline font-bold">Recommended for you</h2>
                 <Link to="/rides" className="text-primary font-bold hover:underline flex items-center gap-1">
                    See all <MaterialIcon name="arrow_forward" className="text-sm" />
                 </Link>
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {trips.slice(0, 3).map((trip) => (
                  <Link key={trip.id} to={`/ride-details/${trip.id}`} className="group block rounded-2xl bg-surface-container-lowest border border-outline-variant/60 hover:border-primary/50 transition-all hover:-translate-y-1 shadow-[0_12px_32px_rgba(31,41,51,0.08)] overflow-hidden">
                    <div className="h-32 bg-surface-container-high relative overflow-hidden">
                       <div className="absolute inset-0 bg-gradient-to-tr from-surface-container-lowest to-transparent opacity-50 z-10" />
                       <MaterialIcon name="map" className="absolute -bottom-4 -right-4 text-8xl text-on-surface/5 transform group-hover:rotate-12 transition-transform" />
                       <div className="absolute top-4 left-4 z-20">
                          <span className="bg-black/50 backdrop-blur-md text-primary font-bold px-3 py-1 rounded-full text-xs">
                             €{trip.prix.toFixed(0)}
                          </span>
                       </div>
                    </div>
                    <div className="p-6">
                      <h3 className="font-headline font-bold text-xl mb-1 group-hover:text-primary transition-colors">
                        {trip.villeDepart} <MaterialIcon name="arrow_right_alt" className="inline align-middle" /> {trip.villeArrivee}
                      </h3>
                      <p className="text-sm text-on-surface-variant font-medium">
                        {new Date(trip.dateDepart).toLocaleDateString()}
                      </p>
                      <div className="mt-4 flex items-center justify-between text-sm text-on-surface-variant font-semibold">
                        <span className="flex items-center gap-1"><MaterialIcon name="airline_seat_recline_normal" className="text-lg" /> {trip.nbPlacesDisponibles} left</span>
                        <span className="text-primary group-hover:translate-x-1 transition-transform">Book now &rarr;</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {activeTab === "profile" && (
            <div className="max-w-2xl mx-auto rounded-2xl bg-surface-container-lowest p-8 border border-outline-variant/60 shadow-[0_12px_32px_rgba(31,41,51,0.08)] flex flex-col md:flex-row gap-8 items-center md:items-start">
               <div className="h-32 w-32 rounded-full bg-primary flex items-center justify-center text-5xl font-headline font-extrabold text-on-primary shrink-0">
                  {profile?.prenom?.[0] ?? "U"}{profile?.nom?.[0] ?? ""}
               </div>
               <div className="flex-1 text-center md:text-left">
                  <div className="inline-block px-3 py-1 bg-surface-container text-xs font-bold uppercase tracking-widest rounded-full mb-4 text-on-surface-variant">Passenger Account</div>
                  <h2 className="text-4xl font-headline font-bold text-on-surface mb-2">
                    {profile ? `${profile.prenom} ${profile.nom}` : "Voyageur"}
                  </h2>
                  <p className="text-lg text-on-surface-variant font-medium mb-6">
                    {profile?.email ?? "No email provided"}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4">
                     <div className="bg-surface-container-low p-4 rounded-2xl">
                        <div className="text-on-surface-variant text-xs uppercase font-bold tracking-widest mb-1">Rides Taken</div>
                        <div className="text-2xl font-bold text-primary">{reservations.length}</div>
                     </div>
                     <div className="bg-surface-container-low p-4 rounded-2xl">
                        <div className="text-on-surface-variant text-xs uppercase font-bold tracking-widest mb-1">Saved Approx</div>
                        <div className="text-2xl font-bold text-primary">€{reservations.length * 15}</div>
                     </div>
                  </div>
               </div>
            </div>
          )}
        </div>
      </main>

      {/* Review Modal powered by GSAP in IHM components isn't built for full custom forms, so we inline a GSAP modal here or just use CSS. We will use a simple CSS one for now, or build a custom one if needed. */}
      {reviewModal.isOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <div className="w-full max-w-md rounded-2xl bg-surface-container-lowest p-8 shadow-[0_12px_32px_rgba(31,41,51,0.08)] border border-outline-variant/30 animate-in zoom-in-95 duration-300">
               <h3 className="text-2xl font-headline font-bold text-on-surface mb-2">Leave a Review</h3>
               <p className="text-sm text-on-surface-variant mb-8 font-medium">How was your trip? Leave a rating and a comment for the driver.</p>
               
               <div className="space-y-6">
                  <div>
                     <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-3">Rating</label>
                     <div className="flex gap-2">
                        {[1,2,3,4,5].map(star => (
                           <button 
                              key={star} 
                              onClick={() => setReviewForm({...reviewForm, note: star})}
                              className={`p-2 rounded-full ${reviewForm.note >= star ? "text-primary bg-primary/10" : "text-outline-variant bg-surface-container"} hover:scale-110 transition-transform`}
                           >
                              <MaterialIcon name="star" filled={reviewForm.note >= star} className="text-3xl" />
                           </button>
                        ))}
                     </div>
                  </div>
                  <div>
                     <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-3">Comment</label>
                     <textarea 
                        className="w-full rounded-xl border border-outline-variant/20 bg-surface-container-low p-4 text-sm focus:border-primary focus:ring-1 focus:ring-primary font-medium resize-none placeholder:text-on-surface-variant/50"
                        rows={4}
                        placeholder="Great driver, very punctual!"
                        value={reviewForm.commentaire}
                        onChange={e => setReviewForm({...reviewForm, commentaire: e.target.value})}
                     />
                  </div>
               </div>
               
               <div className="mt-8 flex justify-end gap-3">
                  <button
                     onClick={() => setReviewModal({ isOpen: false, trajetId: null })}
                     className="rounded-xl px-5 py-3 font-semibold text-on-surface hover:bg-surface-container transition-colors"
                  >
                     Cancel
                  </button>
                  <button
                     onClick={submitReview}
                     disabled={!reviewForm.commentaire}
                     className="rounded-xl bg-primary px-6 py-3 font-bold text-on-primary hover:bg-primary-dim transition-colors shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                     Submit Review
                  </button>
               </div>
            </div>
         </div>
      )}

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
