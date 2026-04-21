import { Link } from "react-router-dom";
import type { TrajetResponse } from "../../types/covoiturage";
import { MaterialIcon } from "../MaterialIcon";

type TripCardProps = {
  trip: TrajetResponse;
  showBookButton?: boolean;
};

export function TripCard({ trip, showBookButton = true }: TripCardProps) {
  const time = new Date(trip.dateDepart).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <article className="group rounded-xl bg-surface-container-lowest p-6 transition-all hover:translate-y-[-4px]">
      <div className="mb-6 flex items-start justify-between">
        <div className="relative flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="z-10 h-2.5 w-2.5 rounded-full border-2 border-primary bg-surface-container-lowest" />
            <span className="font-bold text-on-surface">
              {trip.villeDepart}
            </span>
          </div>
          <div className="absolute left-[4px] top-3 h-6 w-[2px] bg-surface-variant" />
          <div className="flex items-center gap-3">
            <MaterialIcon
              name="location_on"
              filled
              className="z-10 text-primary"
            />
            <span className="font-bold text-on-surface">
              {trip.villeArrivee}
            </span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-primary">
            €{trip.prix.toFixed(0)}
          </span>
          <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
            Per Seat
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between rounded-lg bg-surface-container-low p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-container font-bold text-on-primary-container">
            {trip.conducteurNom?.slice(0, 1) ?? "D"}
          </div>
          <div>
            <p className="text-sm font-bold text-on-surface">
              {trip.conducteurNom ?? "Driver"}
            </p>
            <div className="flex items-center gap-1">
              <MaterialIcon
                name="star"
                filled
                className="text-[12px] text-amber-500"
              />
              <span className="text-[11px] font-medium text-on-surface-variant">
                {trip.nbPlacesDisponibles} seats left
              </span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="mb-1 text-[10px] font-bold uppercase text-on-surface-variant">
            Leaves at
          </p>
          <p className="text-sm font-bold text-on-surface">{time}</p>
        </div>
      </div>
      {showBookButton ? (
        <Link
          to={`/ride-details/${trip.id}`}
          className="mt-4 block w-full rounded-lg border border-transparent py-3 text-center font-bold text-primary transition-colors hover:border-primary-container hover:bg-primary-container/30"
        >
          Book Trip
        </Link>
      ) : null}
    </article>
  );
}
