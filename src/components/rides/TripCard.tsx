import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { TrajetResponse } from "../../types/covoiturage";

type TripCardProps = {
  trip: TrajetResponse;
  showBookButton?: boolean;
  revealDelayMs?: number;
  loading?: boolean;
};

function durationLabel(trip: TrajetResponse) {
  const hours = Math.max(1, Math.round(trip.nbPlacesTotal * 0.7 + 1));
  return `${hours}h ${trip.nbPlacesDisponibles % 2 === 0 ? "10" : "35"}`;
}

function seatTone(seats: number) {
  if (seats <= 1) return "bg-error text-white scarcity-flicker";
  if (seats === 2) return "bg-primary text-on-primary";
  return "bg-secondary text-white";
}

function ratingTone(rating: number) {
  return rating >= 4.8 ? "border-secondary" : "border-warning";
}

export function TripCard({
  trip,
  showBookButton = true,
  revealDelayMs = 0,
  loading = false,
}: TripCardProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [visualSeats, setVisualSeats] = useState(trip.nbPlacesDisponibles);
  const departure = new Date(trip.dateDepart);
  const rating =
    trip.conducteurNote ?? (trip.nbPlacesDisponibles <= 1 ? 4.6 : 4.9);
  const isDisabled = trip.nbPlacesDisponibles <= 0 || isLoading;

  const handleBook = () => {
    if (isDisabled) return;
    setIsLoading(true);
    setVisualSeats((value) => Math.max(0, value - 1));
    window.setTimeout(() => navigate(`/ride-details/${trip.id}`), 360);
  };

  return (
    <article
      className={`card-reveal grid border-2 border-outline bg-surface transition-[background-color,transform] duration-200 ${loading ? "animate-pulse bg-gray-200" : "hover:-translate-y-1 hover:bg-primary-container/25"} md:grid-cols-[148px_1fr_188px]`}
      style={{ animationDelay: `${revealDelayMs}ms` }}
    >
      <div className="border-b-2 border-outline p-4 md:border-b-0 md:border-r-2">
        {loading ? (
          <>
            <div className="h-10 w-32 bg-gray-200" />
            <div className="mt-2 h-4 w-20 bg-gray-200" />
            <div className="mt-3 h-3 w-28 bg-gray-200" />
          </>
        ) : (
          <>
            <p className="font-mono text-[2.4rem] font-bold leading-none text-on-surface">
              {departure.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <p className="mt-1 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
              {departure.toLocaleDateString([], {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </p>
            <p className="mt-2 font-mono text-xs font-bold uppercase text-on-surface-variant">
              Durée {durationLabel(trip)}
            </p>
          </>
        )}
      </div>

      <div className="grid gap-4 p-4">
        <div className="route-map border-2 border-outline bg-surface p-4">
          <div className="grid grid-cols-[1fr_52px_1fr] items-center gap-3">
            {loading ? (
              <>
                <div className="h-6 w-36 bg-gray-200" />
                <div className="h-6 w-10 bg-gray-200 mx-auto" />
                <div className="h-6 w-36 bg-gray-200 ml-auto" />
              </>
            ) : (
              <>
                <p className="truncate font-headline text-3xl font-extrabold uppercase leading-none">
                  {trip.villeDepart}
                </p>
                <div className="route-arrow" aria-hidden="true" />
                <p className="truncate text-right font-headline text-3xl font-extrabold uppercase leading-none rtl:text-left">
                  {trip.villeArrivee}
                </p>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t-2 border-outline pt-4">
          <div className="flex min-w-0 items-center gap-3">
            {loading ? (
              <>
                <div className="h-11 w-11 bg-gray-200" />
                <div className="ml-2">
                  <div className="h-3 w-24 bg-gray-200 mb-2" />
                  <div className="h-3 w-28 bg-gray-200" />
                </div>
              </>
            ) : (
              <>
                <div
                  className={`grid h-11 w-11 shrink-0 place-items-center rounded-full border-4 bg-surface font-mono text-sm font-bold ${ratingTone(rating)}`}
                  aria-label={`Note conducteur ${rating}`}
                >
                  {trip.conducteurNom?.slice(0, 1) ?? "D"}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-mono text-xs font-bold uppercase text-on-surface">
                    {trip.conducteurNom ?? "Conducteur"}
                  </p>
                  <p className="truncate font-mono text-[11px] font-bold uppercase text-on-surface-variant">
                    {rating.toFixed(1)} /{" "}
                    {trip.vehiculeDescription ?? "Véhicule standard"}
                  </p>
                </div>
              </>
            )}
          </div>
          <span
            key={visualSeats}
            className={`seat-tick px-3 py-2 font-mono text-xs font-bold uppercase ${seatTone(visualSeats)}`}
            aria-live="polite"
          >
            {loading ? <span className="h-3 w-12 inline-block bg-gray-200" /> : `${visualSeats} place(s) restante(s)`}
          </span>
        </div>
      </div>

      <div className="grid border-t-2 border-outline md:border-l-2 md:border-t-0">
        <div className="p-4 text-right">
          {loading ? (
            <div className="h-10 w-20 bg-gray-200 ml-auto" />
          ) : (
            <>
              <p className="font-mono text-[2.75rem] font-bold leading-none text-primary">
                {trip.prix.toFixed(0)}€
              </p>
              <p className="mt-1 font-mono text-[11px] font-bold uppercase text-on-surface-variant">
                par place
              </p>
            </>
          )}
        </div>
        {showBookButton ? (
          <button
            type="button"
            onClick={handleBook}
            disabled={isDisabled}
            data-loading={isLoading ? "true" : "false"}
            className="book-ride-button self-end"
            aria-live="polite"
          >
            {isLoading ? (
              <span className="skeleton h-5 w-28 bg-on-primary/30" />
            ) : loading ? (
              <div className="h-8 w-full bg-gray-200" />
            ) : (
              <>
                <span className="book-label">Réserver</span>
                <span className="book-hover-label">Réserver</span>
              </>
            )}
          </button>
        ) : null}
      </div>
    </article>
  );
}
