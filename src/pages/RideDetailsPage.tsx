import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PageShell } from "../components/layout/PageShell";
import { demoTrajets } from "../data/demo";
import { avisApi, reservationApi, trajetApi } from "../api/covoiturage";
import type { AvisResponse, TrajetResponse } from "../types/covoiturage";
import { Toast } from "../components/IHM";

function seatTone(seats: number) {
  if (seats <= 1) return "bg-error text-white scarcity-flicker";
  if (seats === 2) return "bg-primary text-on-primary";
  return "bg-secondary text-white";
}

export function RideDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState<TrajetResponse | null>(null);
  const [reviews, setReviews] = useState<AvisResponse[]>([]);
  const [seats, setSeats] = useState(1);
  const [visualSeats, setVisualSeats] = useState(0);
  const [isLoadingTrip, setIsLoadingTrip] = useState(true);
  const [isReserving, setIsReserving] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  useEffect(() => {
    const selectedId = id ? Number(id) : demoTrajets[0]?.id;
    if (!selectedId) return;

    trajetApi
      .getById(selectedId)
      .then((data) => {
        setTrip(data);
        setVisualSeats(data.nbPlacesDisponibles);
        if (data.conducteurId) {
          avisApi.byConducteur(data.conducteurId).then(setReviews).catch(() => setReviews([]));
        }
      })
      .catch(() => {
        const fallback =
          demoTrajets.find((item) => item.id === selectedId) ?? demoTrajets[0] ?? null;
        setTrip(fallback);
        setVisualSeats(fallback?.nbPlacesDisponibles ?? 0);
      })
      .finally(() => setIsLoadingTrip(false));
  }, [id]);

  const totalPrice = useMemo(() => {
    if (!trip) return 0;
    const requestedSeats = Math.min(seats, Math.max(1, trip.nbPlacesDisponibles));
    return trip.prix * requestedSeats + 4.5;
  }, [seats, trip]);

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return "4.8";
    const sum = reviews.reduce((acc, review) => acc + review.note, 0);
    return (sum / reviews.length).toFixed(1);
  }, [reviews]);

  const handleReserve = async () => {
    if (!trip || isReserving || trip.nbPlacesDisponibles === 0) return;
    const requestedSeats = Math.min(seats, Math.max(1, trip.nbPlacesDisponibles));
    setIsReserving(true);
    setVisualSeats((current) => Math.max(0, current - requestedSeats));

    try {
      await reservationApi.create({ trajetId: trip.id, nbPlacesReservees: requestedSeats });
      setToast({ message: "Réservation envoyée.", type: "success" });
      window.setTimeout(() => navigate("/voyageur"), 900);
    } catch {
      setVisualSeats(trip.nbPlacesDisponibles);
      setToast({
        message: "Réservation impossible. Connectez-vous comme voyageur.",
        type: "error",
      });
      setIsReserving(false);
    }
  };

  if (isLoadingTrip || !trip) {
    return (
      <PageShell>
        <main className="mx-auto grid w-full max-w-7xl gap-4 px-4 pb-20 pt-28 sm:px-6 lg:grid-cols-[1fr_360px]">
          <div className="skeleton h-[560px] border-2 border-outline" />
          <div className="skeleton h-[420px] border-2 border-outline" />
        </main>
      </PageShell>
    );
  }

  const departureTime = new Date(trip.dateDepart);
  const arrivalTime = new Date(departureTime.getTime() + 2.5 * 60 * 60 * 1000);
  const maxSeats = Math.max(1, trip.nbPlacesDisponibles);
  const requestedSeats = Math.min(seats, maxSeats);

  return (
    <PageShell>
      <main className="mx-auto grid w-full max-w-7xl gap-6 px-4 pb-20 pt-28 sm:px-6 lg:grid-cols-[1fr_360px]">
        <section className="grid gap-6">
          <Link to="/rides" className="app-button-secondary w-fit">
            Retour résultats
          </Link>

          <article className="transport-panel overflow-hidden">
            <div className="route-map border-b-2 border-outline p-5">
              <p className="font-mono text-xs font-bold uppercase text-primary">
                Ligne confirmable
              </p>
              <h1 className="mt-4 grid gap-3 font-headline text-6xl font-extrabold uppercase leading-none md:grid-cols-[1fr_96px_1fr] md:items-center">
                <span>{trip.villeDepart}</span>
                <span className="route-arrow" aria-hidden="true" />
                <span className="md:text-right">{trip.villeArrivee}</span>
              </h1>
            </div>

            <div className="grid md:grid-cols-[180px_1fr]">
              <div className="border-b-2 border-outline p-5 md:border-b-0 md:border-r-2">
                <p className="font-mono text-[3.25rem] font-bold leading-none">
                  {departureTime.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <p className="mt-2 font-mono text-xs font-bold uppercase text-on-surface-variant">
                  {departureTime.toLocaleDateString(undefined, {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                </p>
              </div>

              <div className="grid gap-0">
                {[
                  {
                    time: departureTime.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    }),
                    city: trip.villeDepart,
                    note: "Point de rendez-vous principal. Arrivez 10 min avant.",
                  },
                  {
                    time: "Pause",
                    city: "Aire intermédiaire",
                    note: "Arrêt court prévu si le conducteur confirme.",
                  },
                  {
                    time: arrivalTime.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    }),
                    city: trip.villeArrivee,
                    note: "Dépose finale annoncée.",
                  },
                ].map((stop, index) => (
                  <div
                    key={`${stop.city}-${index}`}
                    className={`grid grid-cols-[88px_24px_1fr] gap-4 p-5 ${
                      index > 0 ? "border-t-2 border-outline" : ""
                    }`}
                  >
                    <p className="font-mono text-xl font-bold uppercase">{stop.time}</p>
                    <div className="flex flex-col items-center">
                      <span className="h-5 w-5 border-2 border-outline bg-primary" />
                      {index < 2 ? <span className="w-0.5 flex-1 bg-outline" /> : null}
                    </div>
                    <div>
                      <p className="font-headline text-3xl font-extrabold uppercase leading-none">
                        {stop.city}
                      </p>
                      <p className="mt-2 font-mono text-xs font-bold uppercase text-on-surface-variant">
                        {stop.note}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </article>

          <article className="transport-panel grid gap-0 md:grid-cols-[220px_1fr]">
            <div className="border-b-2 border-outline p-5 md:border-b-0 md:border-r-2">
              <div className="grid h-28 w-28 place-items-center rounded-full border-4 border-secondary bg-surface font-mono text-4xl font-bold">
                {trip.conducteurNom?.slice(0, 1) ?? "D"}
              </div>
              <p className="mt-4 font-mono text-xs font-bold uppercase text-on-surface-variant">
                Conducteur
              </p>
              <h2 className="font-headline text-4xl font-extrabold uppercase leading-none">
                {trip.conducteurNom ?? "Conducteur"}
              </h2>
            </div>
            <div className="grid gap-4 p-5">
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="border-2 border-outline p-4">
                  <p className="font-mono text-3xl font-bold">{averageRating}</p>
                  <p className="font-mono text-xs font-bold uppercase text-on-surface-variant">
                    Note
                  </p>
                </div>
                <div className="border-2 border-outline p-4">
                  <p className="font-mono text-3xl font-bold">{reviews.length}</p>
                  <p className="font-mono text-xs font-bold uppercase text-on-surface-variant">
                    Avis
                  </p>
                </div>
                <div className="border-2 border-outline p-4">
                  <p className="truncate font-mono text-xl font-bold">
                    {trip.vehiculeDescription ?? "Standard"}
                  </p>
                  <p className="font-mono text-xs font-bold uppercase text-on-surface-variant">
                    Véhicule
                  </p>
                </div>
              </div>
              <div className="route-map h-36 border-2 border-outline bg-surface" aria-label="Illustration abstraite du véhicule et de la ligne" />
            </div>
          </article>
        </section>

        <aside className="h-fit lg:sticky lg:top-24">
          <div className="transport-panel">
            <div className="border-b-2 border-outline bg-on-surface px-5 py-4 font-mono text-xs font-bold uppercase text-surface">
              Réservation
            </div>
            <div className="grid gap-5 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-xs font-bold uppercase text-on-surface-variant">
                    Prix par place
                  </p>
                  <p className="font-mono text-[3.5rem] font-bold leading-none text-primary">
                    {trip.prix.toFixed(0)}€
                  </p>
                </div>
                <span
                  key={visualSeats}
                  className={`seat-tick px-3 py-2 font-mono text-xs font-bold uppercase ${seatTone(visualSeats)}`}
                  aria-live="polite"
                >
                  {visualSeats} seat(s) left
                </span>
              </div>

              <div className="grid gap-2">
                <span className="field-label">Places demandées</span>
                <div className="grid grid-cols-[56px_1fr_56px] border-2 border-outline">
                  <button
                    type="button"
                    disabled={requestedSeats <= 1 || isReserving}
                    onClick={() => setSeats((value) => Math.max(1, value - 1))}
                    className="border-r-2 border-outline font-mono text-2xl font-bold hover:bg-surface-container disabled:cursor-not-allowed disabled:text-on-surface-variant"
                    aria-label="Retirer une place"
                  >
                    -
                  </button>
                  <span className="grid min-h-14 place-items-center font-mono text-2xl font-bold">
                    {requestedSeats}
                  </span>
                  <button
                    type="button"
                    disabled={requestedSeats >= maxSeats || isReserving}
                    onClick={() => setSeats((value) => Math.min(maxSeats, value + 1))}
                    className="border-l-2 border-outline font-mono text-2xl font-bold hover:bg-surface-container disabled:cursor-not-allowed disabled:text-on-surface-variant"
                    aria-label="Ajouter une place"
                  >
                    +
                  </button>
                </div>
                {trip.nbPlacesDisponibles === 1 ? (
                  <p className="font-mono text-[11px] font-bold uppercase text-error">
                    Maximum automatiquement limité à 1 place.
                  </p>
                ) : null}
              </div>

              <div className="border-t-2 border-outline pt-5">
                <div className="flex justify-between font-mono text-sm font-bold uppercase">
                  <span>{requestedSeats} place(s)</span>
                  <span>{(trip.prix * requestedSeats).toFixed(2)}€</span>
                </div>
                <div className="mt-2 flex justify-between font-mono text-sm font-bold uppercase text-on-surface-variant">
                  <span>Frais service</span>
                  <span>4.50€</span>
                </div>
                <div className="mt-5 flex items-end justify-between border-t-2 border-outline pt-5">
                  <span className="font-mono text-sm font-bold uppercase">Total</span>
                  <span className="font-mono text-4xl font-bold text-primary">
                    {totalPrice.toFixed(2)}€
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleReserve}
                disabled={isReserving || trip.nbPlacesDisponibles === 0}
                data-loading={isReserving ? "true" : "false"}
                className="book-ride-button"
                aria-live="polite"
              >
                {isReserving ? (
                  <span className="skeleton h-5 w-36 bg-on-primary/30" />
                ) : (
                  <>
                    <span className="book-label">Confirm Booking</span>
                    <span className="book-hover-label">Réserver</span>
                  </>
                )}
              </button>

              <p className="font-mono text-[11px] font-bold uppercase text-on-surface-variant">
                Le conducteur confirme avant paiement final.
              </p>
            </div>
          </div>
        </aside>
      </main>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </PageShell>
  );
}
