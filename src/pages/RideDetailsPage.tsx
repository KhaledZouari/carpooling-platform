import { useEffect, useMemo, useState, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import gsap from "gsap";
import { PageShell } from "../components/layout/PageShell";
import { MaterialIcon } from "../components/MaterialIcon";
import { demoTrajets } from "../data/demo";
import { avisApi, reservationApi, trajetApi } from "../api/covoiturage";
import type { AvisResponse, TrajetResponse } from "../types/covoiturage";
import { Toast, ConfirmModal } from "../components/IHM";

export function RideDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState<TrajetResponse | null>(null);
  const [reviews, setReviews] = useState<AvisResponse[]>([]);
  const [seats, setSeats] = useState(1);
  const [isReserving, setIsReserving] = useState(false);

  // Animation Refs
  const pageRef = useRef<HTMLDivElement>(null);
  const asideRef = useRef<HTMLElement>(null);

  // IHM
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  useEffect(() => {
    const selectedId = id ? Number(id) : demoTrajets[0]?.id;
    if (!selectedId) return;

    trajetApi.getById(selectedId)
      .then((data) => {
        setTrip(data);
        if (data.conducteurId) {
          avisApi.byConducteur(data.conducteurId).then(setReviews).catch(() => setReviews([]));
        }
      })
      .catch(() => {
        const fallback = demoTrajets.find((item) => item.id === selectedId) ?? demoTrajets[0] ?? null;
        setTrip(fallback);
      });
  }, [id]);

  useEffect(() => {
    if (trip && pageRef.current && asideRef.current) {
      const tl = gsap.timeline();
      tl.fromTo(pageRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" })
        .fromTo(asideRef.current, { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" }, "-=0.3");
    }
  }, [trip]);

  const totalPrice = useMemo(() => {
    if (!trip) return 0;
    return trip.prix * seats + 4.5;
  }, [seats, trip]);

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 4.8;
    const sum = reviews.reduce((acc, r) => acc + r.note, 0);
    return (sum / reviews.length).toFixed(1);
  }, [reviews]);

  const handleReserve = async () => {
    if (!trip) return;
    setIsReserving(true);
    try {
      await reservationApi.create({ trajetId: trip.id, nbPlacesReservees: seats });
      setToast({ message: "Reservation request sent successfully!", type: "success" });
      setTimeout(() => navigate("/voyageur"), 2000);
    } catch {
      setToast({ message: "Failed to reserve. Make sure you are logged in as a passenger.", type: "error" });
      setIsReserving(false);
    }
  };

  if (!trip) {
    return (
      <PageShell>
        <div className="mx-auto flex h-screen items-center justify-center">
          <MaterialIcon name="refresh" className="animate-spin text-5xl text-primary" />
        </div>
      </PageShell>
    );
  }

  const departureTime = new Date(trip.dateDepart);
  const arrivalTime = new Date(departureTime.getTime() + 2.5 * 60 * 60 * 1000);

  return (
    <PageShell>
      <main className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-12 px-6 pb-24 pt-32 lg:grid-cols-12 overflow-hidden">
        <section ref={pageRef} className="space-y-8 lg:col-span-8">
          <Link to="/rides" className="group inline-flex items-center gap-2 rounded-full bg-surface-container px-5 py-2.5 text-sm font-bold text-on-surface hover:bg-surface-variant transition-colors">
            <MaterialIcon name="arrow_back" className="text-[18px] transition-transform group-hover:-translate-x-1" />
            Back to Search
          </Link>
          
          {/* Main Trip Card */}
          <article className="rounded-[2.5rem] bg-surface-container-lowest p-10 shadow-2xl border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
            <div className="relative z-10 mb-12 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
              <div>
                <span className="inline-block rounded-full bg-primary/10 px-3 py-1 mb-4 text-[10px] font-bold uppercase tracking-widest text-primary border border-primary/20">
                  Scheduled Ride
                </span>
                <h1 className="text-5xl md:text-6xl font-headline font-extrabold tracking-tighter text-on-surface leading-tight">
                  {trip.villeDepart} <br/><span className="text-outline-variant text-4xl">&rarr;</span> {trip.villeArrivee}
                </h1>
                <p className="mt-4 flex items-center gap-2 text-on-surface-variant font-medium text-lg">
                  <MaterialIcon name="calendar_month" className="text-primary" />{" "}
                  {departureTime.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
                </p>
              </div>
            </div>
            
            <div className="relative py-8 px-4 bg-surface-container-low rounded-3xl border border-white/5">
              <div className="absolute bottom-16 left-9 top-16 w-0.5 bg-gradient-to-b from-primary via-surface-variant to-secondary" />
              <div className="relative space-y-16">
                <div className="flex items-start gap-8">
                  <div className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary shadow-lg shadow-primary/30 border-4 border-surface-container-low">
                    <div className="h-2 w-2 rounded-full bg-black" />
                  </div>
                  <div>
                    <div className="text-3xl font-headline font-bold text-on-surface">
                      {departureTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                    <div className="text-xl font-bold mt-1">{trip.villeDepart}</div>
                    <p className="mt-1 text-sm text-on-surface-variant font-medium">Main departure point. Please arrive 10m early.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-8">
                  <div className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-container-high border-4 border-surface-container-low">
                    <div className="h-2 w-2 rounded-full bg-on-surface-variant" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-on-surface">Midway Rest Stop</div>
                    <p className="mt-1 text-sm text-on-surface-variant font-medium">Brief 15-minute break for snacks and restrooms.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-8">
                  <div className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary shadow-lg shadow-secondary/30 border-4 border-surface-container-low">
                     <MaterialIcon name="location_on" filled className="text-white text-[16px]" />
                  </div>
                  <div>
                    <div className="text-3xl font-headline font-bold text-on-surface">
                      {arrivalTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                    <div className="text-xl font-bold mt-1">{trip.villeArrivee}</div>
                    <p className="mt-1 text-sm text-on-surface-variant font-medium">Final destination drop-off.</p>
                  </div>
                </div>
              </div>
            </div>
          </article>
          
          {/* Driver Profile & Reviews */}
          <article className="rounded-[2.5rem] bg-surface-container-lowest p-10 border border-white/5 shadow-xl">
            <h2 className="mb-8 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Driver Information</h2>
            <div className="flex flex-col items-start gap-8 md:flex-row">
              <div className="relative shrink-0">
                <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-surface-container-lowest bg-surface-container-high text-5xl font-headline font-extrabold text-on-surface shadow-inner">
                  {trip.conducteurNom?.slice(0, 1) ?? "D"}
                </div>
                <div className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full border-4 border-surface-container-lowest bg-primary text-black shadow-lg">
                  <MaterialIcon name="verified" filled className="text-[16px]" />
                </div>
              </div>
              <div className="flex-1 space-y-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h3 className="text-3xl font-headline font-bold text-on-surface">{trip.conducteurNom ?? "Driver"}</h3>
                    <div className="mt-2 flex items-center gap-3">
                      <div className="flex items-center text-primary bg-primary/10 px-2 py-1 rounded-lg">
                        <MaterialIcon name="star" filled className="text-[16px] mr-1" />
                        <span className="text-sm font-bold">{averageRating}</span>
                      </div>
                      <span className="text-sm font-semibold text-on-surface-variant bg-surface-container px-3 py-1 rounded-lg">
                        {reviews.length} reviews
                      </span>
                    </div>
                  </div>
                  <button type="button" className="rounded-xl bg-surface-container-high px-5 py-3 text-sm font-bold text-on-surface hover:bg-surface-variant transition-colors flex items-center gap-2">
                     <MaterialIcon name="chat" className="text-[18px]" /> Message
                  </button>
                </div>
                <div className="flex flex-wrap gap-3 pt-2">
                  <div className="flex items-center gap-2 rounded-xl border border-white/5 bg-surface-container-low px-4 py-2 font-semibold text-sm text-on-surface-variant">
                    <MaterialIcon name="directions_car" className="text-[18px] text-primary" /> {trip.vehiculeDescription ?? "Standard Vehicle"}
                  </div>
                  <div className="flex items-center gap-2 rounded-xl border border-white/5 bg-surface-container-low px-4 py-2 font-semibold text-sm text-on-surface-variant">
                    <MaterialIcon name="how_to_reg" className="text-[18px] text-primary" /> ID Verified
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-white/5">
               <h4 className="text-xl font-headline font-bold text-on-surface mb-6">Passenger Reviews</h4>
               {reviews.length === 0 ? (
                  <div className="bg-surface-container-low rounded-2xl p-6 text-center text-on-surface-variant font-medium">No reviews yet for this driver.</div>
               ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                     {reviews.slice(0,4).map(review => (
                        <div key={review.id} className="bg-surface-container-low rounded-2xl p-6 border border-white/5 hover:border-primary/30 transition-colors">
                           <div className="flex items-center justify-between mb-3">
                              <span className="font-bold text-sm text-on-surface">{review.auteurNom ?? "Anonymous"}</span>
                              <div className="flex items-center text-primary text-xs bg-primary/10 px-2 py-0.5 rounded">
                                 {review.note} <MaterialIcon name="star" filled className="text-[12px] ml-0.5" />
                              </div>
                           </div>
                           <p className="text-sm text-on-surface-variant font-medium italic">"{review.commentaire}"</p>
                           <p className="text-[10px] text-on-surface-variant mt-3 font-bold uppercase tracking-widest">
                              {review.dateAvis ? new Date(review.dateAvis).toLocaleDateString() : "Recent"}
                           </p>
                        </div>
                     ))}
                  </div>
               )}
            </div>
          </article>
        </section>

        {/* Floating Sidebar Container */}
        <aside ref={asideRef} className="lg:col-span-4 h-fit sticky top-32 space-y-8">
          <div className="rounded-[2.5rem] bg-surface-container-low p-8 shadow-2xl border border-white/5">
            <h3 className="mb-8 text-2xl font-headline font-bold text-on-surface text-center">Booking Summary</h3>
            <div className="mb-8 space-y-4 font-medium text-lg">
              <div className="flex items-center justify-between py-2">
                <span className="text-on-surface-variant">{seats} Seat{seats > 1 ? "s" : ""}</span>
                <span className="font-bold text-on-surface">€{(trip.prix * seats).toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-on-surface-variant">Service Fee</span>
                <span className="font-bold text-on-surface">€4.50</span>
              </div>
              <div className="flex items-center justify-between pt-6 mt-4 border-t border-white/10">
                <span className="font-bold text-on-surface">Total</span>
                <span className="text-4xl font-headline font-extrabold text-primary">
                  €{totalPrice.toFixed(2)}
                </span>
              </div>
            </div>
            
            {trip.nbPlacesDisponibles === 0 ? (
               <div className="w-full rounded-2xl bg-error/10 text-error py-5 font-bold text-center border border-error/20 text-lg">
                  Fully Booked
               </div>
            ) : (
               <>
                  <div className="mb-6 bg-surface-container-lowest rounded-2xl p-2 border border-white/5 flex items-center justify-between">
                     <button disabled={seats <= 1} onClick={() => setSeats(s => s-1)} className="w-12 h-12 flex items-center justify-center rounded-xl bg-surface-container hover:bg-surface-variant disabled:opacity-50 text-xl font-bold">-</button>
                     <span className="text-xl font-bold">{seats}</span>
                     <button disabled={seats >= trip.nbPlacesDisponibles} onClick={() => setSeats(s => s+1)} className="w-12 h-12 flex items-center justify-center rounded-xl bg-surface-container hover:bg-surface-variant disabled:opacity-50 text-xl font-bold">+</button>
                  </div>
                  <button
                     onClick={handleReserve}
                     disabled={isReserving}
                     className="w-full rounded-2xl bg-primary py-5 text-xl font-headline font-extrabold text-black shadow-2xl shadow-primary/30 transition-all hover:bg-primary-dim hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                     {isReserving ? <MaterialIcon name="refresh" className="animate-spin" /> : "Confirm Booking"}
                  </button>
               </>
            )}

            <p className="mt-6 text-center text-xs text-on-surface-variant font-medium">
              You won't be charged until the driver confirms.
            </p>
          </div>
          
          <div className="rounded-[2.5rem] bg-surface-container-lowest p-8 border border-white/5 shadow-xl flex flex-col gap-6">
            {trip.vehiculeImageUrl && (
              <div className="overflow-hidden rounded-3xl border border-white/5 bg-surface-container h-48 relative">
                 <img src={`http://localhost:8080${trip.vehiculeImageUrl}`} alt="Vehicle" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                 <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-4">
                    <p className="text-white font-bold text-lg font-headline">{trip.vehiculeDescription ?? "Driver's Vehicle"}</p>
                 </div>
              </div>
            )}
            {!trip.vehiculeImageUrl && (
               <div className="text-center pb-4 border-b border-white/5">
                  <h4 className="mb-2 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Vehicle</h4>
                  <p className="font-bold text-on-surface">{trip.vehiculeDescription ?? "Standard Vehicle"}</p>
               </div>
            )}
            
            <h4 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant text-center">
              Amenities & Rules
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm font-semibold text-on-surface">
              {[
                 { icon: "smoke_free", text: "No Smoking" },
                 { icon: "pets", text: "Pets allowed" },
                 { icon: "music_note", text: "Music playing" },
                 { icon: "ac_unit", text: "AC equipped" }
              ].map((item, i) => (
                 <div key={i} className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-surface-container text-center border border-transparent hover:border-primary/20 transition-colors">
                    <MaterialIcon name={item.icon} className="text-2xl text-on-surface-variant" />
                    {item.text}
                 </div>
              ))}
            </div>
          </div>
        </aside>
      </main>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </PageShell>
  );
}
