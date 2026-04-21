import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MaterialIcon } from "../MaterialIcon";

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
  initialPlaces = "",
  compact = false,
}: TripSearchBarProps) {
  const navigate = useNavigate();
  const [depart, setDepart] = useState(initialDepart);
  const [arrivee, setArrivee] = useState(initialArrivee);
  const [date, setDate] = useState(initialDate);
  const [places, setPlaces] = useState(initialPlaces);

  const handleSearch = () => {
    const searchParams = new URLSearchParams();
    if (depart) searchParams.set("depart", depart);
    if (arrivee) searchParams.set("arrivee", arrivee);
    if (date) searchParams.set("date", date);
    if (places) searchParams.set("places", places);
    navigate(
      `/rides${searchParams.toString() ? `?${searchParams.toString()}` : ""}`,
    );
  };

  return (
    <div
      className={`mx-auto w-full rounded-xl bg-surface-container-lowest/90 p-2 shadow-[0px_8px_24px_rgba(42,52,57,0.06)] backdrop-blur-xl ${compact ? "max-w-5xl" : "max-w-5xl"}`}
    >
      <div className="flex flex-col items-stretch gap-2 md:flex-row">
        <label className="flex flex-1 items-center rounded-lg bg-surface-container-low px-4 py-3">
          <MaterialIcon
            name="my_location"
            className="mr-3 text-outline-variant"
          />
          <input
            className="w-full border-none bg-transparent font-medium placeholder:text-on-surface-variant focus:ring-0"
            placeholder="Departure"
            value={depart}
            onChange={(event) => setDepart(event.target.value)}
          />
        </label>
        <label className="flex flex-1 items-center rounded-lg bg-surface-container-low px-4 py-3">
          <MaterialIcon
            name="location_on"
            className="mr-3 text-outline-variant"
          />
          <input
            className="w-full border-none bg-transparent font-medium placeholder:text-on-surface-variant focus:ring-0"
            placeholder="Destination"
            value={arrivee}
            onChange={(event) => setArrivee(event.target.value)}
          />
        </label>
        <label className="flex w-full items-center rounded-lg bg-surface-container-low px-4 py-3 md:w-40">
          <MaterialIcon
            name="calendar_month"
            className="mr-3 text-outline-variant"
          />
          <input
            type="date"
            className="w-full border-none bg-transparent font-medium placeholder:text-on-surface-variant focus:ring-0"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </label>
        <label className="flex w-full items-center rounded-lg bg-surface-container-low px-4 py-3 md:w-32">
          <MaterialIcon name="person" className="mr-3 text-outline-variant" />
          <input
            type="number"
            min="1"
            className="w-full border-none bg-transparent font-medium placeholder:text-on-surface-variant focus:ring-0"
            placeholder="Seats"
            value={places}
            onChange={(event) => setPlaces(event.target.value)}
          />
        </label>
        <button
          type="button"
          onClick={handleSearch}
          className="w-full whitespace-nowrap rounded-lg bg-primary px-8 py-3 font-semibold text-on-primary transition-all hover:bg-primary-dim active:scale-95 md:w-auto"
        >
          Search
        </button>
      </div>
    </div>
  );
}
