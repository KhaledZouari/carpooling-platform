import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

type TripSearchBarProps = {
  initialDepart?: string;
  initialArrivee?: string;
  initialDate?: string;
  initialPlaces?: string;
  compact?: boolean;
};

export function TripSearchBar({
  initialDepart = "",
  initialArrivee = "",
  initialDate = "",
  initialPlaces = "1",
  compact = false,
}: TripSearchBarProps) {
  const navigate = useNavigate();
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const [depart, setDepart] = useState(initialDepart);
  const [arrivee, setArrivee] = useState(initialArrivee);
  const [date, setDate] = useState(initialDate);
  const [places, setPlaces] = useState(initialPlaces);
  const [attemptedSearch, setAttemptedSearch] = useState(false);
  const sameRoute =
    depart.trim().length > 0 &&
    arrivee.trim().length > 0 &&
    depart.trim().toLowerCase() === arrivee.trim().toLowerCase();
  const missingRequired = !depart.trim() || !arrivee.trim() || !date;
  const canSearch = !missingRequired && !sameRoute;

  const handleSearch = () => {
    setAttemptedSearch(true);
    if (!canSearch) return;
    const searchParams = new URLSearchParams();
    searchParams.set("depart", depart.trim());
    searchParams.set("arrivee", arrivee.trim());
    searchParams.set("date", date);
    if (places) searchParams.set("places", places);
    navigate(`/rides?${searchParams.toString()}`);
  };

  return (
    <div className={`transport-panel mx-auto w-full ${compact ? "max-w-5xl" : "max-w-6xl"}`}>
      <div className="grid gap-3 p-3 md:grid-cols-[1fr_1fr_168px_116px_auto]">
        <label className="grid gap-2">
          <span className="field-label">Départ</span>
          <input
            required
            placeholder="Paris"
            aria-invalid={attemptedSearch && !depart.trim()}
            value={depart}
            onChange={(event) => setDepart(event.target.value)}
          />
        </label>
        <label className="grid gap-2">
          <span className="field-label">Destination</span>
          <input
            required
            placeholder="Lyon"
            aria-invalid={sameRoute || (attemptedSearch && !arrivee.trim())}
            value={arrivee}
            onChange={(event) => setArrivee(event.target.value)}
          />
          {sameRoute ? (
            <span className="font-mono text-[11px] font-bold uppercase text-error">
              Choisissez deux villes différentes.
            </span>
          ) : null}
        </label>
        <label className="grid gap-2">
          <span className="field-label">Date</span>
          <input
            type="date"
            required
            min={today}
            aria-invalid={attemptedSearch && !date}
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </label>
        <label className="grid gap-2">
          <span className="field-label">Places</span>
          <input
            type="number"
            min="1"
            max="8"
            required
            placeholder="1"
            value={places}
            onChange={(event) => setPlaces(event.target.value)}
          />
        </label>
        <button
          type="button"
          onClick={handleSearch}
          aria-disabled={!canSearch}
          className={`app-button-primary self-end ${!canSearch ? "cursor-not-allowed opacity-70" : ""}`}
          aria-describedby="trip-search-feedback"
        >
          Rechercher
        </button>
      </div>
      {(attemptedSearch && missingRequired) || sameRoute ? (
        <p
          id="trip-search-feedback"
          className="border-t-2 border-outline px-3 py-2 font-mono text-[11px] font-bold uppercase text-error"
        >
          {sameRoute
            ? "Le départ et la destination doivent être différents."
            : "Complétez le départ, la destination et la date pour lancer la recherche."}
        </p>
      ) : null}
    </div>
  );
}
