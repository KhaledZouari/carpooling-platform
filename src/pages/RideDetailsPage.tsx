import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PageShell } from "../components/layout/PageShell";
import { MaterialIcon } from "../components/MaterialIcon";
import { demoTrajets } from "../data/demo";
import { avisApi, reservationApi, trajetApi } from "../api/covoiturage";
import type { AvisResponse, TrajetResponse } from "../types/covoiturage";

export function RideDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState<TrajetResponse | null>(null);
  const [reviews, setReviews] = useState<AvisResponse[]>([]);
  const [seats, setSeats] = useState(1);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const selectedId = id ? Number(id) : demoTrajets[0]?.id;
    if (!selectedId) {
      return;
    }

    trajetApi
      .getById(selectedId)
      .then((data) => {
        setTrip(data);
        if (data.conducteurId) {
          avisApi
            .byConducteur(data.conducteurId)
            .then(setReviews)
            .catch(() => setReviews([]));
        }
      })
      .catch(() => {
        const fallback =
          demoTrajets.find((item) => item.id === selectedId) ??
          demoTrajets[0] ??
          null;
        setTrip(fallback);
      });
  }, [id]);

  const totalPrice = useMemo(() => {
    if (!trip) return 0;
    return trip.prix * seats + 4.5;
  }, [seats, trip]);

  const handleReserve = async () => {
    if (!trip) return;
    try {
      await reservationApi.create({
        trajetId: trip.id,
        nbPlacesReservees: seats,
      });
      setMessage("Reservation created successfully.");
    } catch {
      navigate("/auth");
    }
  };

  if (!trip) {
    return (
      <PageShell>
        <div className="mx-auto max-w-7xl px-6 py-28">Loading trip...</div>
      </PageShell>
    );
  }

  const departureTime = new Date(trip.dateDepart);
  const arrivalTime = new Date(departureTime.getTime() + 2.5 * 60 * 60 * 1000);

  return (
    <PageShell>
      <main className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 pb-12 pt-24 lg:grid-cols-12">
        <section className="space-y-8 lg:col-span-8">
          <Link
            to="/rides"
            className="group mb-2 flex items-center gap-2 font-medium text-on-surface-variant transition-colors hover:text-primary"
          >
            <MaterialIcon name="arrow_back" className="text-lg" />
            Back to search results
          </Link>
          <article className="rounded-xl bg-surface-container-lowest p-8 shadow-[0px_8px_24px_rgba(42,52,57,0.04)]">
            <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-primary">
                  Scheduled Trip
                </span>
                <h1 className="text-5xl font-extrabold tracking-tight">
                  {trip.villeDepart} to {trip.villeArrivee}
                </h1>
                <p className="mt-2 flex items-center gap-2 text-on-surface-variant">
                  <MaterialIcon name="calendar_today" className="text-sm" />{" "}
                  {departureTime.toLocaleDateString(undefined, {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                  })}{" "}
                  •{" "}
                  {departureTime.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <div className="text-right">
                <div className="text-5xl font-extrabold text-primary">
                  €{trip.prix.toFixed(2)}
                </div>
                <div className="text-sm font-medium text-on-surface-variant">
                  per seat
                </div>
              </div>
            </div>
            <div className="relative py-4">
              <div className="absolute bottom-8 left-4 top-8 w-0.5 bg-surface-variant" />
              <div className="relative space-y-12">
                <div className="flex items-start gap-8">
                  <div className="z-10 flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                    <div className="h-3 w-3 rounded-full bg-white" />
                  </div>
                  <div>
                    <div className="text-lg font-bold">
                      {departureTime.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      • {trip.villeDepart}
                    </div>
                    <p className="mt-1 text-sm text-on-surface-variant">
                      Main departure point.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-8">
                  <div className="z-10 flex h-8 w-8 items-center justify-center rounded-full bg-surface-variant">
                    <div className="h-2 w-2 rounded-full bg-on-surface-variant" />
                  </div>
                  <div>
                    <div className="text-lg font-semibold">Midway break</div>
                    <p className="mt-1 text-sm text-on-surface-variant">
                      Estimated total duration around 2h 30m
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-8">
                  <div className="z-10 flex h-8 w-8 items-center justify-center rounded-full bg-on-surface text-white">
                    <MaterialIcon
                      name="location_on"
                      filled
                      className="text-lg"
                    />
                  </div>
                  <div>
                    <div className="text-lg font-bold">
                      {arrivalTime.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      • {trip.villeArrivee}
                    </div>
                    <p className="mt-1 text-sm text-on-surface-variant">
                      Drop-off at the selected arrival point.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </article>
          <div className="relative h-64 overflow-hidden rounded-xl border border-outline-variant/10 bg-surface-container">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDFfeZjBwlNZq2VYECPXdgej9Fs8e8DFXswHcM7NuS_xLSWBtc1aYYAWJYGVHIZ4TQCsU4d_zMEoCe-DU5La67_CPiXeUn0JroCTN4ExfirJ5mFVASoU_owB8GF8Wwk7zzsoEhUOXtgdBwElJuoMa9SRySFKWKmpEHEbrvLWI62O3Cv4knL4K6HD2i-RjJUdRtIBbLqZ_OTWlIUEms8Ujm-zJQemWChIjwJd45gSgXyB82TKnzgXgveWAiOnAmYjhA9x6IAUxU7xjI"
              alt="Route map"
              className="h-full w-full object-cover"
            />
            <div className="absolute bottom-4 left-4 rounded-lg bg-white/90 px-4 py-2 text-xs font-bold">
              VIEW FULL ROUTE
            </div>
          </div>
          <article className="rounded-xl bg-surface-container-low p-8">
            <h2 className="mb-6 text-sm font-bold uppercase tracking-widest text-on-surface-variant">
              Driver Profile
            </h2>
            <div className="flex flex-col items-start gap-8 md:flex-row">
              <div className="relative">
                <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-surface-container-lowest bg-primary-container text-3xl font-bold text-on-primary-container">
                  {trip.conducteurNom?.slice(0, 1) ?? "D"}
                </div>
                <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-4 border-surface-container-low bg-green-500 text-white">
                  <MaterialIcon name="check" filled className="text-[10px]" />
                </div>
              </div>
              <div className="flex-1 space-y-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h3 className="text-2xl font-bold">
                      {trip.conducteurNom ?? "Driver"}
                    </h3>
                    <div className="mt-1 flex items-center gap-2">
                      <div className="flex text-yellow-500">
                        {[1, 2, 3, 4].map((value) => (
                          <MaterialIcon
                            key={value}
                            name="star"
                            filled
                            className="text-sm"
                          />
                        ))}
                        <MaterialIcon
                          name="star_half"
                          filled
                          className="text-sm"
                        />
                      </div>
                      <span className="text-sm font-semibold">4.8</span>
                      <span className="text-sm text-on-surface-variant">
                        ({reviews.length} reviews)
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="rounded-lg bg-surface-container-high px-4 py-2 text-sm font-semibold text-on-surface transition-all hover:opacity-90"
                  >
                    Message Driver
                  </button>
                </div>
                <p className="italic text-on-surface-variant">
                  {
                    "Experienced driver, commuting for work twice a week. I value punctuality and good conversation, but happy to travel in silence if preferred. Non-smoker."
                  }
                </p>
                <div className="flex flex-wrap gap-4 pt-2 text-xs">
                  <div className="flex items-center gap-2 rounded-full border border-outline-variant/20 bg-surface-container-lowest px-3 py-1.5">
                    <MaterialIcon name="directions_car" className="text-sm" />
                    {trip.vehiculeDescription ?? "Vehicle"}
                  </div>
                  <div className="flex items-center gap-2 rounded-full border border-outline-variant/20 bg-surface-container-lowest px-3 py-1.5">
                    <MaterialIcon name="verified_user" className="text-sm" /> ID
                    Verified
                  </div>
                  <div className="flex items-center gap-2 rounded-full border border-outline-variant/20 bg-surface-container-lowest px-3 py-1.5">
                    <MaterialIcon name="chat_bubble" className="text-sm" />{" "}
                    Responds fast
                  </div>
                </div>
              </div>
            </div>
          </article>
        </section>
        <aside className="space-y-6 lg:sticky lg:top-24 lg:col-span-4 lg:self-start">
          <div className="rounded-xl bg-surface-container-high p-8 shadow-[0px_16px_48px_rgba(42,52,57,0.08)]">
            <h3 className="mb-6 text-xl font-bold">Reservation Summary</h3>
            <div className="mb-8 space-y-4">
              <div className="flex items-center justify-between border-b border-on-surface/5 py-3">
                <span className="font-medium text-on-surface-variant">
                  {seats} Seat
                </span>
                <span className="font-bold">€{trip.prix.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between border-b border-on-surface/5 py-3">
                <span className="font-medium text-on-surface-variant">
                  Service Fee
                </span>
                <span className="font-bold">€4.50</span>
              </div>
              <div className="flex items-center justify-between pt-4">
                <span className="text-lg font-bold">Total Price</span>
                <span className="text-2xl font-extrabold text-primary">
                  €{totalPrice.toFixed(2)}
                </span>
              </div>
            </div>
            <label className="mb-4 block text-xs font-bold uppercase tracking-widest text-on-surface-variant">
              Seats
            </label>
            <input
              type="number"
              min="1"
              max={trip.nbPlacesDisponibles || trip.nbPlacesTotal}
              value={seats}
              onChange={(event) =>
                setSeats(Math.max(1, Number(event.target.value)))
              }
              className="mb-6 w-full rounded-lg border border-outline-variant/20 px-4 py-3"
            />
            <button
              type="button"
              onClick={handleReserve}
              className="w-full rounded-lg bg-primary py-4 text-lg font-bold text-on-primary shadow-lg shadow-primary/20 transition-all hover:bg-primary-dim active:scale-[0.98]"
            >
              Reserve Seat
            </button>
            {message ? (
              <p className="mt-4 text-center text-sm font-medium text-green-600">
                {message}
              </p>
            ) : null}
            <p className="mt-4 px-4 text-center text-[10px] uppercase tracking-widest text-on-surface-variant">
              Secured payment processing. Cancellation free up to 24h before
              departure.
            </p>
            <div className="mt-8 space-y-4 border-t border-on-surface/5 pt-8">
              <div className="flex items-start gap-4">
                <MaterialIcon name="info" className="text-primary" />
                <div>
                  <p className="text-sm font-bold">Instant Confirmation</p>
                  <p className="text-xs text-on-surface-variant">
                    No need to wait for driver approval.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <MaterialIcon name="event_seat" className="text-primary" />
                <div>
                  <p className="text-sm font-bold">
                    {trip.nbPlacesDisponibles} Seats Remaining
                  </p>
                  <p className="text-xs text-on-surface-variant">
                    Limited availability for this trip.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-xl bg-surface-container-low p-6">
            <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
              Ride Amenities
            </h4>
            <div className="grid grid-cols-2 gap-y-4 text-xs">
              <div className="flex items-center gap-3">
                <MaterialIcon
                  name="smoke_free"
                  className="text-on-surface-variant"
                />{" "}
                No Smoking
              </div>
              <div className="flex items-center gap-3">
                <MaterialIcon name="pets" className="text-on-surface-variant" />{" "}
                Pets Allowed
              </div>
              <div className="flex items-center gap-3">
                <MaterialIcon
                  name="music_note"
                  className="text-on-surface-variant"
                />{" "}
                Music Okay
              </div>
              <div className="flex items-center gap-3">
                <MaterialIcon
                  name="ac_unit"
                  className="text-on-surface-variant"
                />{" "}
                Air Conditioning
              </div>
            </div>
          </div>
        </aside>
      </main>
    </PageShell>
  );
}
