import { BrowserRouter, Link, Navigate, Route, Routes } from "react-router-dom";

type NavTab = "find" | "offer" | "trips";

type MaterialIconProps = {
  name: string;
  className?: string;
  filled?: boolean;
};

function MaterialIcon({
  name,
  className = "",
  filled = false,
}: MaterialIconProps) {
  return (
    <span
      className={`material-symbols-outlined ${className}`.trim()}
      style={filled ? { fontVariationSettings: "'FILL' 1" } : undefined}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}

function TopNav({ active }: { active: NavTab }) {
  const navClass = (tab: NavTab) =>
    active === tab
      ? "font-semibold text-blue-600 border-b-2 border-blue-600"
      : "font-medium text-slate-500 hover:text-blue-500 transition-colors";

  return (
    <header className="fixed top-0 z-50 w-full bg-white/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          to="/"
          className="text-xl font-bold tracking-tight text-slate-800"
        >
          Covoiturage
        </Link>
        <div className="hidden items-center gap-8 md:flex">
          <Link to="/rides" className={navClass("find")}>
            Find a Ride
          </Link>
          <Link to="/driver" className={navClass("offer")}>
            Offer a Ride
          </Link>
          <Link to="/ride-details" className={navClass("trips")}>
            My Trips
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <button
            className="text-on-surface-variant hover:text-primary transition-colors"
            type="button"
            aria-label="Notifications"
          >
            <MaterialIcon name="notifications" />
          </button>
          <div className="h-8 w-8 overflow-hidden rounded-full bg-surface-container ring-2 ring-primary/10">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAn_AYg5Y_KS4YmT8l4BF4UK3F_OWNetR9inW6oN4Jid6UdX3d1ZuYebXhJQaAKqGIGkQQzMv9AJeA3CrV2y09IEEJntv540Gab5aqaNFS00SgrnQCcdCdebIyQiud1imGkzDeEo3VUBoIIEl-z1q_SscgUur4JJZomngGTpkN4e2paX1o-I416mbBrR2L63WhrwqOOJN3FIE0Nil3zRxpjatTyDX4FT2zZJNMMgVqzDq5n8BGgUNGbdb_L_sL-2YiNTiW6pOK-AAs"
              alt="User avatar"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </nav>
    </header>
  );
}

function Footer() {
  return (
    <footer className="w-full border-t border-slate-200/20 bg-slate-50 py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-8 md:flex-row">
        <div className="text-sm uppercase tracking-wide text-slate-500">
          © 2024 Covoiturage Logistics. All rights reserved.
        </div>
        <div className="flex gap-8">
          <a
            href="#"
            className="text-sm uppercase tracking-wide text-slate-500 transition-colors hover:text-slate-800"
          >
            Help Center
          </a>
          <a
            href="#"
            className="text-sm uppercase tracking-wide text-slate-500 transition-colors hover:text-slate-800"
          >
            Terms of Service
          </a>
          <a
            href="#"
            className="text-sm uppercase tracking-wide text-slate-500 transition-colors hover:text-slate-800"
          >
            Privacy Policy
          </a>
          <a
            href="#"
            className="text-sm uppercase tracking-wide text-slate-500 transition-colors hover:text-slate-800"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}

function HomePage() {
  const rides = [
    {
      from: "Paris",
      to: "Lyon",
      price: "$24",
      name: "Marc L.",
      rating: "4.9 (124)",
      time: "08:30 AM",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuC_Gjh19X9UO2XTggS8nip39SOL6XGE5FKbew7eaU1gbm_P1r2Q4wf80dSEAQMNN-XtYgravwd-KpApIvdG92dHOS8DyYyMGCf_o9SVFhUGezNsLfd84OOLowKtNfufeMZMhTZyHPt9FVlJf3gdz5MHnydo1iFmXo3RvdjKLfegVmjRPhSwYUMSRqK9XLl1tu8vfMuDfrRQxP-oOB_fG05_sf2a3mTmcFiH17fCOBuDMOHE0hpniJSguqSfohPSS2vPJDfidZpham8",
    },
    {
      from: "Bordeaux",
      to: "Toulouse",
      price: "$18",
      name: "Sophie R.",
      rating: "5.0 (82)",
      time: "10:15 AM",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuC_2TPYPBnmdNRydgEwqODWwFRKrvc-Y5C0nBoDHlaXFDKQizoyoKF7h-3S4NC2xB8U3kThYfWBfv7nz4DqhRG9QQAS3TT6S9MEIFMUVtHvnoT1_lldTiOkaiDp5aNe6S-R3vVopY7UgPrc8_EXUrcxXRYaARJ_emCOccGTMJ4F0nX9rIk90h0VZ0j2Mbvxqv_rjG3vRb4uY6LJky5CP6XLG5gKCvdgWAN6cdlzK07CEIdCHtQ2mILXrXPgcchyCFRAQXpV4UEUT-U",
    },
    {
      from: "Nantes",
      to: "Rennes",
      price: "$12",
      name: "David M.",
      rating: "4.8 (210)",
      time: "02:45 PM",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAk8fe__glqkSjkCqFBdHRkbx54_xY-uGRUjqCI0QdWWLIF-dAo9gXUaScQ3dT1jBc5vQtzAqUxSUigC-Mn-5aPqTHSURoUKtkLK21XIB_Uu2V6VtcKXkMJgc8YjJQbC0KGfByDeQj5-0DypdbTCvnirgCQ7C_htslLQ8SnU19SvTK-GiplO9CIOcnI8Ljj970seVFz8b9153xQ0i4yfh00TcIjeXc_ULANEYY9AkTMtPaO_4KsjnPrDOketoYg89nzyf_scJkzieI",
    },
  ];

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <TopNav active="find" />
      <main className="pt-16">
        <section className="relative flex min-h-[716px] items-center justify-center overflow-hidden px-6 py-20">
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
            <div className="mx-auto max-w-5xl rounded-xl bg-surface-container-lowest/90 p-2 shadow-[0px_8px_24px_rgba(42,52,57,0.06)] backdrop-blur-xl">
              <div className="flex flex-col items-center gap-2 md:flex-row">
                <div className="flex flex-1 items-center rounded-lg bg-surface-container-low px-4 py-3">
                  <MaterialIcon
                    name="my_location"
                    className="mr-3 text-outline-variant"
                  />
                  <input
                    className="w-full border-none bg-transparent font-medium placeholder:text-on-surface-variant focus:ring-0"
                    placeholder="Departure"
                  />
                </div>
                <div className="flex flex-1 items-center rounded-lg bg-surface-container-low px-4 py-3">
                  <MaterialIcon
                    name="location_on"
                    className="mr-3 text-outline-variant"
                  />
                  <input
                    className="w-full border-none bg-transparent font-medium placeholder:text-on-surface-variant focus:ring-0"
                    placeholder="Destination"
                  />
                </div>
                <div className="flex w-full items-center rounded-lg bg-surface-container-low px-4 py-3 md:w-40">
                  <MaterialIcon
                    name="calendar_month"
                    className="mr-3 text-outline-variant"
                  />
                  <input
                    className="w-full border-none bg-transparent font-medium placeholder:text-on-surface-variant focus:ring-0"
                    placeholder="Date"
                  />
                </div>
                <div className="flex w-full items-center rounded-lg bg-surface-container-low px-4 py-3 md:w-32">
                  <MaterialIcon
                    name="person"
                    className="mr-3 text-outline-variant"
                  />
                  <input
                    className="w-full border-none bg-transparent font-medium placeholder:text-on-surface-variant focus:ring-0"
                    placeholder="Seats"
                  />
                </div>
                <Link
                  to="/rides"
                  className="w-full whitespace-nowrap rounded-lg bg-primary px-8 py-3 font-semibold text-on-primary transition-all hover:bg-primary-dim active:scale-95 md:w-auto"
                >
                  Search
                </Link>
              </div>
            </div>
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
            {rides.map((ride) => (
              <article
                key={ride.name}
                className="group rounded-xl bg-surface-container-lowest p-6 transition-all hover:translate-y-[-4px]"
              >
                <div className="mb-6 flex items-start justify-between">
                  <div className="relative flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <div className="z-10 h-2.5 w-2.5 rounded-full border-2 border-primary bg-surface-container-lowest" />
                      <span className="font-bold text-on-surface">
                        {ride.from}
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
                        {ride.to}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-primary">
                      {ride.price}
                    </span>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                      Per Seat
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-surface-container-low p-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={ride.avatar}
                      alt={ride.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-sm font-bold text-on-surface">
                        {ride.name}
                      </p>
                      <div className="flex items-center gap-1">
                        <MaterialIcon
                          name="star"
                          filled
                          className="text-[12px] text-amber-500"
                        />
                        <span className="text-[11px] font-medium text-on-surface-variant">
                          {ride.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="mb-1 text-[10px] font-bold uppercase text-on-surface-variant">
                      Leaves at
                    </p>
                    <p className="text-sm font-bold text-on-surface">
                      {ride.time}
                    </p>
                  </div>
                </div>
                <Link
                  to="/ride-details"
                  className="mt-4 block w-full rounded-lg border border-transparent py-3 text-center font-bold text-primary transition-colors hover:border-primary-container hover:bg-primary-container/30"
                >
                  Book Trip
                </Link>
              </article>
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
                  Turn your empty seats into fuel savings and meet amazing
                  people along the way. Your next trip could pay for itself.
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
                We verify profiles, IDs, and car documents so you can travel
                with complete peace of mind.
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
                <MaterialIcon
                  name="eco"
                  className="mb-4 text-4xl text-primary"
                />
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
      </main>
      <Footer />
      <button
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-primary text-on-primary shadow-lg transition-all active:scale-90 md:hidden"
        type="button"
        aria-label="Publish ride"
      >
        <MaterialIcon name="add" filled />
      </button>
    </div>
  );
}

function RideListPage() {
  const rides = [
    [
      "08:30",
      "4h 15m",
      "12:45",
      "Paris",
      "Porte Maillot",
      "Lyon",
      "Lyon Part-Dieu",
      "$34",
      "2 seats left",
      "Marc D.",
      "4.8 • Tesla Model 3",
    ],
    [
      "09:15",
      "4h 30m",
      "13:45",
      "Paris",
      "Châtelet",
      "Lyon",
      "Perrache",
      "$28",
      "1 seat left",
      "Sarah L.",
      "4.9 • Peugeot 3008",
    ],
    [
      "11:00",
      "3h 50m",
      "14:50",
      "Paris",
      "Gare de Lyon",
      "Lyon",
      "Lyon-Saint Exupéry",
      "$42",
      "3 seats left",
      "Thomas B.",
      "5.0 • BMW i4",
    ],
    [
      "14:20",
      "4h 25m",
      "18:45",
      "Paris",
      "Bercy",
      "Lyon",
      "Lyon Part-Dieu",
      "$25",
      "2 seats left",
      "Julie M.",
      "4.7 • Renault Zoe",
    ],
    [
      "17:45",
      "4h 10m",
      "21:55",
      "Paris",
      "Porte de Versailles",
      "Lyon",
      "Villeurbanne",
      "$31",
      "4 seats left",
      "Antoine R.",
      "4.5 • VW Golf",
    ],
  ] as const;

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <TopNav active="find" />
      <main className="mx-auto flex max-w-7xl flex-col gap-8 px-6 pb-12 pt-24">
        <div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight">
            Available rides
          </h1>
          <p className="text-on-surface-variant">
            Paris → Lyon • Tomorrow, 24 Oct
          </p>
        </div>
        <div className="flex flex-col gap-8 lg:flex-row">
          <aside className="w-full space-y-8 lg:w-64">
            <div className="rounded-xl bg-surface-container-low p-6">
              <label className="mb-4 block text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                Sort by
              </label>
              <select className="w-full cursor-pointer border-none bg-transparent font-medium text-on-surface focus:ring-0">
                <option>Earliest departure</option>
                <option>Lowest price</option>
                <option>Shortest duration</option>
              </select>
            </div>
            <div className="rounded-xl bg-surface-container-low p-6">
              <label className="mb-6 block text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                Price range
              </label>
              <input
                type="range"
                min="10"
                max="150"
                defaultValue={80}
                className="h-1 w-full cursor-pointer appearance-none rounded-lg accent-primary"
              />
              <div className="mt-4 flex justify-between text-sm font-medium">
                <span>$10</span>
                <span>$150</span>
              </div>
            </div>
            <div className="rounded-xl bg-surface-container-low p-6">
              <label className="mb-4 block text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                Departure time
              </label>
              <div className="space-y-3 text-sm font-medium">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    className="rounded border-outline-variant text-primary"
                  />
                  Morning (06:00 - 12:00)
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    className="rounded border-outline-variant text-primary"
                  />
                  Afternoon (12:00 - 18:00)
                </label>
                <label className="flex items-center gap-3">
                  <input
                    defaultChecked
                    type="checkbox"
                    className="rounded border-outline-variant text-primary"
                  />
                  Evening (18:00 - 00:00)
                </label>
              </div>
            </div>
            <div className="rounded-xl bg-surface-container-low p-6">
              <label className="mb-4 block text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                Seats needed
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="flex-1 rounded-lg bg-primary py-2 font-medium text-on-primary"
                >
                  1
                </button>
                <button
                  type="button"
                  className="flex-1 rounded-lg bg-surface-variant py-2 font-medium"
                >
                  2
                </button>
                <button
                  type="button"
                  className="flex-1 rounded-lg bg-surface-variant py-2 font-medium"
                >
                  3+
                </button>
              </div>
            </div>
          </aside>
          <section className="flex-1 space-y-4">
            {rides.map((ride, index) => (
              <article
                key={ride[0]}
                className={`relative overflow-hidden rounded-xl ${index === 2 ? "border-2 border-primary/10 bg-primary-container/20" : "border border-transparent bg-surface-container-lowest"} flex flex-col transition-all hover:shadow-[0px_8px_24px_rgba(42,52,57,0.06)] md:flex-row`}
              >
                {index === 2 && (
                  <div className="absolute right-0 top-0 rounded-bl-lg bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-on-primary">
                    Fastest
                  </div>
                )}
                <div className="flex flex-1 flex-col gap-6 p-6 md:flex-row">
                  <div className="min-w-[120px]">
                    <div className="text-2xl font-bold">{ride[0]}</div>
                    <div
                      className={`text-sm ${index === 2 ? "font-bold text-primary" : "font-medium text-on-surface-variant"}`}
                    >
                      {ride[1]}
                    </div>
                    <div className="mt-1 text-2xl font-bold">{ride[2]}</div>
                  </div>
                  <div className="hidden flex-col items-center py-2 md:flex">
                    <div className="h-3 w-3 rounded-full border-2 border-primary bg-surface" />
                    <div
                      className={`w-px flex-1 ${index === 2 ? "bg-primary/30" : "bg-surface-variant"}`}
                    />
                    <div className="h-3 w-3 rounded-full bg-primary" />
                  </div>
                  <div className="flex-1 space-y-6">
                    <div className="space-y-4">
                      <div>
                        <div className="text-lg font-semibold">{ride[3]}</div>
                        <div className="text-sm text-on-surface-variant">
                          {ride[4]}
                        </div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold">{ride[5]}</div>
                        <div className="text-sm text-on-surface-variant">
                          {ride[6]}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-surface-container-high" />
                      <div>
                        <div className="text-sm font-bold">{ride[9]}</div>
                        <div className="flex items-center text-xs text-on-surface-variant">
                          <MaterialIcon
                            name="star"
                            filled
                            className="text-xs text-yellow-500"
                          />
                          <span className="ml-1">{ride[10]}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row items-end justify-between border-surface-variant/30 pt-6 md:flex-col md:justify-between md:border-l md:pl-8 md:pt-0">
                    <div className="text-right">
                      <div className="text-3xl font-extrabold tracking-tight text-primary">
                        {ride[7]}
                      </div>
                      <div className="mt-1 text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                        {ride[8]}
                      </div>
                    </div>
                    <Link
                      to="/ride-details"
                      className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-on-primary transition-all hover:bg-primary-dim active:scale-95"
                    >
                      Book Ride
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function RideDetailsPage() {
  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <TopNav active="trips" />
      <main className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 pb-12 pt-24 lg:grid-cols-12">
        <section className="space-y-8 lg:col-span-8">
          <button
            type="button"
            className="group mb-2 flex items-center gap-2 font-medium text-on-surface-variant transition-colors hover:text-primary"
          >
            <MaterialIcon name="arrow_back" className="text-lg" />
            Back to search results
          </button>
          <article className="rounded-xl bg-surface-container-lowest p-8 shadow-[0px_8px_24px_rgba(42,52,57,0.04)]">
            <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-primary">
                  Scheduled Trip
                </span>
                <h1 className="text-5xl font-extrabold tracking-tight">
                  Paris to Lyon
                </h1>
                <p className="mt-2 flex items-center gap-2 text-on-surface-variant">
                  <MaterialIcon name="calendar_today" className="text-sm" />{" "}
                  Friday, Oct 24 • 08:30 AM
                </p>
              </div>
              <div className="text-right">
                <div className="text-5xl font-extrabold text-primary">
                  €34.00
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
                      08:30 • Paris, Gare de Lyon
                    </div>
                    <p className="mt-1 text-sm text-on-surface-variant">
                      Main entrance under the clock tower.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-8">
                  <div className="z-10 flex h-8 w-8 items-center justify-center rounded-full bg-surface-variant">
                    <div className="h-2 w-2 rounded-full bg-on-surface-variant" />
                  </div>
                  <div>
                    <div className="text-lg font-semibold">
                      10:45 • Auxerre (Short break)
                    </div>
                    <p className="mt-1 text-sm text-on-surface-variant">
                      Total duration including stop: 4h 15m
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
                      12:45 • Lyon, Part-Dieu
                    </div>
                    <p className="mt-1 text-sm text-on-surface-variant">
                      Drop-off at the taxi rank station exit.
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
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAEFH_ohBpvT1yb8iYehdsSoQxtNBwNPAG7sewiL1fAdFYXGfHzT3qjFUzaR565cwL8f3ZoCSY7-wPdVG0GWtjf8BLjsNoc_JERCB66vdhjGk1-7XGBacYTe4zBRZdHc8EaII2oXYw-kEk_YzKO9JytuSju4WS1kBP4awkxDVSpgylViGvRLukRaJ5gITn2SmTfFW1_x2Z5LfASLqCUkI6_89QhCbwfxwH72ZrMLBiMVy1VyDghkUjrRrUO8CsYWzjrt5c3PPNafZs"
                  alt="Marc D."
                  className="h-24 w-24 rounded-full border-4 border-surface-container-lowest object-cover"
                />
                <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-4 border-surface-container-low bg-green-500 text-white">
                  <MaterialIcon name="check" filled className="text-[10px]" />
                </div>
              </div>
              <div className="flex-1 space-y-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h3 className="text-2xl font-bold">Marc D.</h3>
                    <div className="mt-1 flex items-center gap-2">
                      <div className="flex text-yellow-500">
                        <MaterialIcon name="star" filled className="text-sm" />
                        <MaterialIcon name="star" filled className="text-sm" />
                        <MaterialIcon name="star" filled className="text-sm" />
                        <MaterialIcon name="star" filled className="text-sm" />
                        <MaterialIcon
                          name="star_half"
                          filled
                          className="text-sm"
                        />
                      </div>
                      <span className="text-sm font-semibold">4.8</span>
                      <span className="text-sm text-on-surface-variant">
                        (124 reviews)
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
                  "Experienced driver, commuting for work twice a week. I value
                  punctuality and good conversation, but happy to travel in
                  silence if preferred. Non-smoker."
                </p>
                <div className="flex flex-wrap gap-4 pt-2 text-xs">
                  <div className="flex items-center gap-2 rounded-full border border-outline-variant/20 bg-surface-container-lowest px-3 py-1.5">
                    <MaterialIcon name="directions_car" className="text-sm" />
                    Tesla Model 3 • White
                  </div>
                  <div className="flex items-center gap-2 rounded-full border border-outline-variant/20 bg-surface-container-lowest px-3 py-1.5">
                    <MaterialIcon name="verified_user" className="text-sm" />
                    ID Verified
                  </div>
                  <div className="flex items-center gap-2 rounded-full border border-outline-variant/20 bg-surface-container-lowest px-3 py-1.5">
                    <MaterialIcon name="chat_bubble" className="text-sm" />
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
                  1 Seat
                </span>
                <span className="font-bold">€34.00</span>
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
                  €38.50
                </span>
              </div>
            </div>
            <button
              type="button"
              className="w-full rounded-lg bg-primary py-4 text-lg font-bold text-on-primary shadow-lg shadow-primary/20 transition-all hover:bg-primary-dim active:scale-[0.98]"
            >
              Reserve Seat
            </button>
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
                  <p className="text-sm font-bold">2 Seats Remaining</p>
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
                />
                No Smoking
              </div>
              <div className="flex items-center gap-3">
                <MaterialIcon name="pets" className="text-on-surface-variant" />
                Pets Allowed
              </div>
              <div className="flex items-center gap-3">
                <MaterialIcon
                  name="music_note"
                  className="text-on-surface-variant"
                />
                Music Okay
              </div>
              <div className="flex items-center gap-3">
                <MaterialIcon
                  name="ac_unit"
                  className="text-on-surface-variant"
                />
                Air Conditioning
              </div>
            </div>
          </div>
        </aside>
      </main>
      <Footer />
    </div>
  );
}

function DriverDashboardPage() {
  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <TopNav active="offer" />
      <main className="mx-auto max-w-7xl space-y-8 px-6 pb-12 pt-24">
        <section className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">
              Driver Dashboard
            </h1>
            <p className="text-on-surface-variant">
              Manage your active routes and passenger requests.
            </p>
          </div>
          <div className="flex gap-2 rounded-xl bg-surface-container-low p-1">
            <button
              type="button"
              className="rounded-lg bg-surface-container-lowest px-4 py-2 text-sm font-semibold text-primary shadow-sm"
            >
              Active Rides
            </button>
            <button
              type="button"
              className="rounded-lg px-4 py-2 text-sm font-medium text-on-surface-variant transition-all hover:bg-surface-variant/50"
            >
              Past History
            </button>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="space-y-8 lg:col-span-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-outline-variant/10 bg-surface-container-lowest p-6">
                <div className="mb-2 text-xs uppercase tracking-widest text-on-surface-variant">
                  Total Earned
                </div>
                <div className="text-3xl font-bold text-primary">€1,240</div>
              </div>
              <div className="rounded-xl border border-outline-variant/10 bg-surface-container-lowest p-6">
                <div className="mb-2 text-xs uppercase tracking-widest text-on-surface-variant">
                  Rating
                </div>
                <div className="flex items-center gap-1 text-3xl font-bold">
                  4.9
                  <MaterialIcon
                    name="star"
                    filled
                    className="text-base text-primary"
                  />
                </div>
              </div>
            </div>
            <section className="rounded-xl border border-outline-variant/10 bg-surface-container-lowest p-8">
              <h2 className="mb-6 text-2xl font-bold">Post a Ride</h2>
              <form className="space-y-6">
                <div className="space-y-4">
                  <div className="border-b border-outline-variant/20 pb-1 focus-within:border-primary">
                    <label className="block text-[10px] font-bold uppercase tracking-tight text-on-surface-variant">
                      Departure City
                    </label>
                    <input
                      className="w-full border-none bg-transparent py-2 font-medium placeholder:text-outline-variant/60 focus:ring-0"
                      placeholder="Where from?"
                    />
                  </div>
                  <div className="border-b border-outline-variant/20 pb-1 focus-within:border-primary">
                    <label className="block text-[10px] font-bold uppercase tracking-tight text-on-surface-variant">
                      Destination City
                    </label>
                    <input
                      className="w-full border-none bg-transparent py-2 font-medium placeholder:text-outline-variant/60 focus:ring-0"
                      placeholder="Where to?"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="border-b border-outline-variant/20 pb-1 focus-within:border-primary">
                    <label className="block text-[10px] font-bold uppercase tracking-tight text-on-surface-variant">
                      Date
                    </label>
                    <input
                      type="date"
                      className="w-full border-none bg-transparent py-2 font-medium focus:ring-0"
                    />
                  </div>
                  <div className="border-b border-outline-variant/20 pb-1 focus-within:border-primary">
                    <label className="block text-[10px] font-bold uppercase tracking-tight text-on-surface-variant">
                      Seats
                    </label>
                    <input
                      type="number"
                      defaultValue={3}
                      className="w-full border-none bg-transparent py-2 font-medium focus:ring-0"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  className="w-full rounded-lg bg-primary py-4 font-bold text-on-primary shadow-[0px_8px_24px_rgba(0,90,194,0.15)] transition-all hover:bg-primary-dim active:scale-95"
                >
                  Publish Route
                </button>
              </form>
            </section>
          </div>

          <section className="space-y-4 lg:col-span-8">
            <h3 className="mb-2 px-2 text-sm uppercase tracking-widest text-on-surface-variant">
              Manage Your Rides
            </h3>
            {[
              ["Paris to Lyon", "Published", "2/4 Seats Booked"],
              ["Berlin to Munich", "Full", "3/3 Seats Filled"],
              ["Madrid to Valencia", "Completed", "Arrived 02:00 PM"],
            ].map((item, index) => (
              <article
                key={item[0]}
                className={`flex flex-col items-center gap-6 rounded-xl p-6 md:flex-row ${index === 2 ? "bg-surface-container-low/50 opacity-70 grayscale" : "bg-surface-container-lowest hover:bg-surface-container-low/30"} transition-colors`}
              >
                <div className="relative h-24 w-full overflow-hidden rounded-xl bg-surface-container md:w-32">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <MaterialIcon
                      name={index === 2 ? "check_circle" : "route"}
                      className={`text-3xl ${index === 0 ? "text-primary" : "text-secondary"}`}
                    />
                  </div>
                </div>
                <div className="w-full flex-1 space-y-1">
                  <div className="flex items-start justify-between">
                    <h4 className="text-lg font-bold">{item[0]}</h4>
                    <span
                      className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase ${index === 0 ? "bg-primary-container text-on-primary-container" : index === 1 ? "bg-surface-variant text-on-surface-variant" : "bg-surface-container-high text-on-surface-variant"}`}
                    >
                      {item[1]}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-on-surface-variant">
                    {index === 2
                      ? "Sunday, Oct 23"
                      : index === 1
                        ? "Tuesday, Oct 25 • 06:15 PM"
                        : "Monday, Oct 24 • 08:30 AM"}{" "}
                    • {item[2]}
                  </p>
                </div>
                <div className="flex w-full gap-2 md:w-auto">
                  <button
                    type="button"
                    className="flex-1 rounded-lg border border-outline-variant/20 px-4 py-2 text-sm font-semibold transition-all hover:bg-surface-container md:flex-none"
                  >
                    Details
                  </button>
                  <button
                    type="button"
                    className="flex-1 rounded-lg bg-surface-container-high px-4 py-2 text-sm font-semibold transition-all hover:opacity-90 md:flex-none"
                  >
                    {index === 2 ? "Review" : "Message"}
                  </button>
                </div>
              </article>
            ))}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function AuthPage() {
  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <main className="flex min-h-screen flex-col items-center justify-center p-6 md:p-12">
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-[0px_8px_24px_rgba(0,90,194,0.15)]">
            <MaterialIcon
              name="directions_car"
              filled
              className="text-2xl text-on-primary"
            />
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight">
            Covoiturage
          </h1>
          <p className="mt-2 text-sm font-medium tracking-wide text-on-surface-variant">
            Shared journeys, smarter logistics.
          </p>
        </div>

        <section className="w-full max-w-[440px] overflow-hidden rounded-xl bg-surface-container-lowest shadow-[0px_8px_24px_rgba(42,52,57,0.06)]">
          <div className="m-6 flex rounded-lg bg-surface-container-low p-1.5">
            <button
              type="button"
              className="flex-1 rounded-lg bg-surface-container-lowest py-2.5 text-sm font-semibold text-primary shadow-sm"
            >
              Login
            </button>
            <button
              type="button"
              className="flex-1 rounded-lg py-2.5 text-sm font-medium text-on-surface-variant hover:text-on-surface"
            >
              Sign Up
            </button>
          </div>
          <div className="px-8 pb-10">
            <div className="space-y-6">
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant"
                >
                  Email Address
                </label>
                <div className="group relative">
                  <MaterialIcon
                    name="mail"
                    className="absolute left-0 top-1/2 -translate-y-1/2 text-xl text-outline-variant group-focus-within:text-primary"
                  />
                  <input
                    id="email"
                    type="email"
                    placeholder="name@company.com"
                    className="w-full border-0 border-b border-outline-variant/20 bg-transparent py-3 pl-8 pr-0 text-on-surface placeholder:text-outline-variant focus:border-b-2 focus:border-primary focus:ring-0"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant"
                  >
                    Password
                  </label>
                  <a
                    href="#"
                    className="text-[11px] font-bold uppercase tracking-wider text-primary hover:text-primary-dim"
                  >
                    Forgot?
                  </a>
                </div>
                <div className="group relative">
                  <MaterialIcon
                    name="lock"
                    className="absolute left-0 top-1/2 -translate-y-1/2 text-xl text-outline-variant group-focus-within:text-primary"
                  />
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="w-full border-0 border-b border-outline-variant/20 bg-transparent py-3 pl-8 pr-10 text-on-surface placeholder:text-outline-variant focus:border-b-2 focus:border-primary focus:ring-0"
                  />
                  <button
                    type="button"
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-outline-variant hover:text-on-surface"
                  >
                    <MaterialIcon name="visibility" className="text-xl" />
                  </button>
                </div>
              </div>
              <button
                type="button"
                className="w-full rounded-lg bg-primary py-4 text-sm font-bold tracking-wide text-on-primary shadow-[0px_4px_12px_rgba(0,90,194,0.1)] transition-all hover:bg-primary-dim active:scale-[0.98]"
              >
                SIGN IN TO YOUR ACCOUNT
              </button>
              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-outline-variant/20" />
                <span className="mx-4 text-[10px] font-bold uppercase tracking-[0.2em] text-outline-variant">
                  Or continue with
                </span>
                <div className="flex-grow border-t border-outline-variant/20" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  className="flex items-center justify-center gap-3 rounded-lg bg-surface-container-low px-4 py-3 text-sm font-semibold text-on-surface transition-colors hover:bg-surface-container-high"
                >
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuALIa_gLtSLxPElAqhHJoR7IdZXd3Y0ulx47zMbphmKaf88pPOgmTbhGs6QkufSpYd3WqBmqy-UwjvpuTxQYAbcYxiBVLDTMe8sO21c2-vLMcbKnNKXooP42OhTkeeVz9uqeiVTzzH17uhsCMszCM5PYpFeQ92HKryWv4VqOHFCu7H9GDl7mCEF7VkQ1xc2110IawtJ04PHfE5d-rYsvhCbWDKBekgeIHsB9kgh4R6KRCAyujELBBLl3Iwhz0RFlHvvq78RSFwNe5w"
                    alt="Google"
                    className="h-5 w-5"
                  />
                  Google
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center gap-3 rounded-lg bg-surface-container-low px-4 py-3 text-sm font-semibold text-on-surface transition-colors hover:bg-surface-container-high"
                >
                  <MaterialIcon name="ios" filled className="text-xl" />
                  Apple
                </button>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-12 grid max-w-[500px] grid-cols-3 gap-8 text-center">
          <div>
            <MaterialIcon name="verified_user" className="mb-2 text-primary" />
            <p className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
              Verified
            </p>
          </div>
          <div>
            <MaterialIcon name="eco" className="mb-2 text-primary" />
            <p className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
              Green
            </p>
          </div>
          <div>
            <MaterialIcon name="group" className="mb-2 text-primary" />
            <p className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
              Community
            </p>
          </div>
        </div>
      </main>
      <footer className="w-full border-t border-outline-variant/10 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-8 md:flex-row">
          <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-outline-variant">
            © 2024 Covoiturage Logistics. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a
              href="#"
              className="text-[10px] font-bold uppercase tracking-[0.1em] text-outline-variant transition-colors hover:text-primary"
            >
              Help Center
            </a>
            <a
              href="#"
              className="text-[10px] font-bold uppercase tracking-[0.1em] text-outline-variant transition-colors hover:text-primary"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-[10px] font-bold uppercase tracking-[0.1em] text-outline-variant transition-colors hover:text-primary"
            >
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/rides" element={<RideListPage />} />
        <Route path="/ride-details" element={<RideDetailsPage />} />
        <Route path="/driver" element={<DriverDashboardPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
