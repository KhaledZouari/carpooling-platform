import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PageShell } from "../components/layout/PageShell";
import { MaterialIcon } from "../components/MaterialIcon";
import { TripSearchBar } from "../components/rides/TripSearchBar";
import { TripCard } from "../components/rides/TripCard";
import { demoTrajets } from "../data/demo";
import { trajetApi } from "../api/covoiturage";
import type { TrajetResponse } from "../types/covoiturage";

export function HomePage() {
  const [trajets, setTrajets] = useState<TrajetResponse[]>(demoTrajets);

  useEffect(() => {
    trajetApi
      .search()
      .then(setTrajets)
      .catch(() => setTrajets(demoTrajets));
  }, []);

  return (
    <PageShell>
      <section className="relative flex min-h-[716px] items-center justify-center overflow-hidden px-6 py-20 pt-28">
        <div className="absolute inset-0 z-0">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDusdTUc_p1AaqjdTeWlow16E7GwruA9aKFhqbCR3XKbUswaBOiz6HvBNvO2AQQ47l4GwRcChBW1HvTE1Ynlj2isIMuH6RsGhdBuva1PzB6WXu6_XAg9dnLbPnL0YLyNQ7xUTPdHEiRvVqHEYlFxTSuS31izPtNl0uPzOo6LBWMzWliCZiID8V1k436p1Xqg5P1Zz2nCoqst6RaUt7TyZNbQjxq8RyHrFlk_MZBwGyTnA3zejlEueaxTbxAo-klgOLNYk52QK0NRmY"
            alt="Scenic road"
            className="h-full w-full object-cover brightness-[0.96] contrast-[1.02]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-surface/20 via-surface/60 to-surface" />
        </div>
        <div className="relative z-10 w-full max-w-4xl text-center">
          <h1 className="mb-8 text-4xl font-extrabold tracking-tighter text-on-surface md:text-6xl">
            Share the journey,{" "}
            <span className="text-primary">save the planet.</span>
          </h1>
          <TripSearchBar />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-primary">
              Available Now
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-on-surface">
              Popular Upcoming Rides
            </h2>
          </div>
          <Link
            to="/rides"
            className="group flex items-center gap-1 font-semibold text-primary hover:underline"
          >
            View all
            <MaterialIcon
              name="arrow_forward"
              className="text-sm transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {trajets.slice(0, 3).map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:h-[500px]">
          <div className="relative overflow-hidden rounded-xl bg-primary p-10 text-on-primary md:col-span-8">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJVOelvBhSXitgSqjna-zqE0iRUT-NEPHF_NCRNqQGumiH854llSblpJfM6KpwHdcPRW6XhP4uO1ddQlaoethIsjAmNqEmASrfPRiMfNMqcEZmZlqJv1NviVeh107w1LBd3kwLHwZ1R75LA2hRAw8oPC-hKL8fyasXJnbhfMgU9KKGitZblCJ01TVUZKci58ShxHCEwogL0nZre3HAv0SmlcZU0RzYoUtxFv-vUlzUcTTW-8E00AY9-kPCV_juT6YPxHm_w2L5R5o"
              alt="Electric car"
              className="absolute inset-0 h-full w-full object-cover opacity-30 mix-blend-overlay"
            />
            <div className="relative z-10 flex h-full flex-col justify-end">
              <h3 className="mb-4 text-4xl font-extrabold tracking-tight">
                Ready to host?
              </h3>
              <p className="mb-8 max-w-md text-lg opacity-90">
                Turn your empty seats into fuel savings and meet amazing people
                along the way. Your next trip could pay for itself.
              </p>
              <Link
                to="/driver"
                className="w-fit rounded-lg bg-surface-container-lowest px-8 py-4 font-bold text-primary transition-all hover:bg-on-primary active:scale-95"
              >
                Offer a Ride
              </Link>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center rounded-xl bg-surface-container-high p-8 text-center md:col-span-4">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary-container">
              <MaterialIcon
                name="verified_user"
                className="text-3xl text-on-primary-container"
              />
            </div>
            <h4 className="mb-2 text-xl font-bold text-on-surface">
              Verified Community
            </h4>
            <p className="text-sm text-on-surface-variant">
              We verify profiles, IDs, and car documents so you can travel with
              complete peace of mind.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-surface-container-low px-6 py-20">
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="mb-16 text-3xl font-bold">
            Why thousands choose Covoiturage
          </h2>
          <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
            <div>
              <MaterialIcon
                name="savings"
                className="mb-4 text-4xl text-primary"
              />
              <h5 className="mb-2 font-bold">Cost Effective</h5>
              <p className="text-sm text-on-surface-variant">
                The most affordable way to travel inter-city across Europe.
              </p>
            </div>
            <div>
              <MaterialIcon name="eco" className="mb-4 text-4xl text-primary" />
              <h5 className="mb-2 font-bold">Carbon Reduction</h5>
              <p className="text-sm text-on-surface-variant">
                Every shared ride reduces CO2 emissions significantly.
              </p>
            </div>
            <div>
              <MaterialIcon
                name="group_add"
                className="mb-4 text-4xl text-primary"
              />
              <h5 className="mb-2 font-bold">Meet New People</h5>
              <p className="text-sm text-on-surface-variant">
                Expand your network and share stories on the road.
              </p>
            </div>
            <div>
              <MaterialIcon
                name="support_agent"
                className="mb-4 text-4xl text-primary"
              />
              <h5 className="mb-2 font-bold">24/7 Support</h5>
              <p className="text-sm text-on-surface-variant">
                We are here for you every mile of your journey.
              </p>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
