import { useEffect, useMemo, useState, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import gsap from "gsap";
import { PageShell } from "../components/layout/PageShell";
import { MaterialIcon } from "../components/MaterialIcon";
import { demoTrajets } from "../data/demo";
import { trajetApi } from "../api/covoiturage";
import type { TrajetResponse } from "../types/covoiturage";

export function RideListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [rides, setRides] = useState<TrajetResponse[]>(demoTrajets);
  const [isLoading, setIsLoading] = useState(true);
  const listRef = useRef<HTMLDivElement>(null);

  // Search parameters
  const [depart, setDepart] = useState(searchParams.get("depart") ?? "");
  const [arrivee, setArrivee] = useState(searchParams.get("arrivee") ?? "");
  const [date, setDate] = useState(searchParams.get("date") ?? "");
  const [places, setPlaces] = useState(searchParams.get("places") ?? "");

  // Local filter states
  const [sortBy, setSortBy] = useState("Earliest departure");
  const [maxPrice, setMaxPrice] = useState(150);
  const [timeMorning, setTimeMorning] = useState(true);
  const [timeAfternoon, setTimeAfternoon] = useState(true);
  const [timeEvening, setTimeEvening] = useState(true);
  const [minSeats, setMinSeats] = useState<string>("1");

  useEffect(() => {
    setIsLoading(true);
    trajetApi
      .search({
        depart: searchParams.get("depart") ?? undefined,
        arrivee: searchParams.get("arrivee") ?? undefined,
        date: searchParams.get("date") ?? undefined,
        places: searchParams.get("places")
          ? Number(searchParams.get("places"))
          : undefined,
      })
      .then(setRides)
      .catch(() => setRides(demoTrajets))
      .finally(() => setIsLoading(false));
  }, [searchParams]);

  const filteredRides = useMemo(() => {
    let result = [...rides];
    result = result.filter(trip => trip.prix <= maxPrice);
    const requiredSeats = minSeats === "3+" ? 3 : Number(minSeats);
    result = result.filter(trip => trip.nbPlacesDisponibles >= requiredSeats);
    result = result.filter(trip => {
      const hour = new Date(trip.dateDepart).getHours();
      if (hour >= 6 && hour < 12 && timeMorning) return true;
      if (hour >= 12 && hour < 18 && timeAfternoon) return true;
      if ((hour >= 18 || hour < 6) && timeEvening) return true;
      return false;
    });
    result.sort((a, b) => {
      if (sortBy === "Lowest price") return a.prix - b.prix;
      if (sortBy === "Earliest departure") return new Date(a.dateDepart).getTime() - new Date(b.dateDepart).getTime();
      if (sortBy === "Shortest duration") return a.prix - b.prix; 
      return 0;
    });
    return result;
  }, [rides, maxPrice, timeMorning, timeAfternoon, timeEvening, minSeats, sortBy]);

  useEffect(() => {
    if (!isLoading && listRef.current && filteredRides.length > 0) {
      gsap.fromTo(
        listRef.current.children,
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, stagger: 0.1, duration: 0.5, ease: "power2.out" }
      );
    }
  }, [filteredRides, isLoading]);

  const updateSearch = () => {
    const nextParams = new URLSearchParams();
    if (depart) nextParams.set("depart", depart);
    if (arrivee) nextParams.set("arrivee", arrivee);
    if (date) nextParams.set("date", date);
    if (places) nextParams.set("places", places);
    setSearchParams(nextParams);
  };

  return (
    <PageShell>
      <main className="mx-auto flex max-w-7xl flex-col gap-8 px-6 pb-24 pt-32 w-full">
        <div>
          <h1 className="text-6xl font-headline font-extrabold tracking-tighter text-on-surface mb-2">
            Available Rides
          </h1>
          <p className="text-xl text-on-surface-variant font-medium">
            {depart || "Anywhere"} &rarr; {arrivee || "Anywhere"} 
            {date ? ` • ${new Date(date).toLocaleDateString()}` : ""}
          </p>
        </div>
        
        <div className="flex flex-col gap-8 lg:flex-row items-start">
          <aside className="w-full space-y-6 lg:w-80 shrink-0 sticky top-24">
             {/* Global Search Box */}
             <div className="rounded-3xl bg-surface-container-low p-6 shadow-2xl border border-white/5 space-y-4">
              <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant">Global Search</label>
              <div className="relative">
                 <MaterialIcon name="my_location" className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                 <input className="w-full rounded-xl border-none bg-surface-container py-3 pl-10 pr-3 text-sm focus:ring-2 focus:ring-primary font-medium" placeholder="Leaving from..." value={depart} onChange={(e) => setDepart(e.target.value)} />
              </div>
              <div className="relative">
                 <MaterialIcon name="location_on" className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                 <input className="w-full rounded-xl border-none bg-surface-container py-3 pl-10 pr-3 text-sm focus:ring-2 focus:ring-primary font-medium" placeholder="Going to..." value={arrivee} onChange={(e) => setArrivee(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                 <input type="date" className="w-full rounded-xl border-none bg-surface-container px-3 py-3 text-sm focus:ring-2 focus:ring-primary font-medium" value={date} onChange={(e) => setDate(e.target.value)} />
                 <input type="number" min="1" className="w-full rounded-xl border-none bg-surface-container px-3 py-3 text-sm focus:ring-2 focus:ring-primary font-medium" placeholder="Seats" value={places} onChange={(e) => setPlaces(e.target.value)} />
              </div>
              <button onClick={updateSearch} className="w-full rounded-xl bg-primary px-4 py-3 font-bold text-black hover:bg-primary-dim transition-colors shadow-lg shadow-primary/20">
                Update Search
              </button>
            </div>

            {/* Local Filters */}
            <div className="rounded-3xl bg-surface-container-low p-6 shadow-2xl border border-white/5 space-y-6">
              <div>
                <label className="mb-3 block text-xs font-bold uppercase tracking-widest text-on-surface-variant">Sort by</label>
                <select className="w-full cursor-pointer rounded-xl border-none bg-surface-container px-4 py-3 font-medium text-sm focus:ring-2 focus:ring-primary appearance-none" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                  <option>Earliest departure</option>
                  <option>Lowest price</option>
                  <option>Shortest duration</option>
                </select>
              </div>
              
              <div>
                <label className="mb-3 block text-xs font-bold uppercase tracking-widest text-on-surface-variant flex justify-between">
                  <span>Max Price</span>
                  <span className="text-primary">€{maxPrice}</span>
                </label>
                <input type="range" min="5" max="150" value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))} className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-surface-container accent-primary" />
              </div>
              
              <div>
                <label className="mb-3 block text-xs font-bold uppercase tracking-widest text-on-surface-variant">Departure time</label>
                <div className="space-y-2 text-sm font-medium">
                  {[
                     { state: timeMorning, set: setTimeMorning, label: "Morning (06:00 - 12:00)" },
                     { state: timeAfternoon, set: setTimeAfternoon, label: "Afternoon (12:00 - 18:00)" },
                     { state: timeEvening, set: setTimeEvening, label: "Evening (18:00 - 06:00)" }
                  ].map((time, i) => (
                     <label key={i} className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors border ${time.state ? "bg-primary/5 border-primary/30" : "bg-surface-container border-transparent"}`}>
                        <span>{time.label}</span>
                        <input type="checkbox" checked={time.state} onChange={e => time.set(e.target.checked)} className="rounded border-outline-variant bg-surface text-primary focus:ring-primary focus:ring-offset-surface" />
                     </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-3 block text-xs font-bold uppercase tracking-widest text-on-surface-variant">Seats needed</label>
                <div className="flex gap-2 text-sm">
                  {["1", "2", "3+"].map((value) => (
                    <button key={value} type="button" onClick={() => setMinSeats(value)} className={`flex-1 rounded-xl py-2 font-bold transition-colors border ${value === minSeats ? "bg-primary/10 border-primary text-primary" : "bg-surface-container border-transparent text-on-surface-variant hover:bg-surface-variant"}`}>
                      {value}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>
          
          <section className="flex-1 w-full">
            {isLoading ? (
               <div className="flex flex-col justify-center items-center h-64 text-on-surface-variant">
                  <MaterialIcon name="refresh" className="animate-spin text-5xl mb-4 text-primary" />
                  <span className="font-headline font-bold text-xl">Scanning routes...</span>
               </div>
            ) : filteredRides.length === 0 ? (
               <div className="flex flex-col items-center justify-center py-20 px-6 bg-surface-container-lowest rounded-3xl border border-dashed border-outline-variant/30 text-center shadow-xl">
                  <MaterialIcon name="search_off" className="text-7xl text-outline-variant mb-6" />
                  <h3 className="text-3xl font-headline font-bold mb-3">No rides found</h3>
                  <p className="text-on-surface-variant max-w-md mb-8 font-medium text-lg">We couldn't find any rides matching your current filters. Try adjusting the price range or departure time.</p>
                  <button onClick={() => { setMaxPrice(150); setTimeMorning(true); setTimeAfternoon(true); setTimeEvening(true); setMinSeats("1"); }} className="px-6 py-3 bg-surface-container-high hover:bg-surface-variant rounded-xl font-bold transition-colors">
                     Reset Filters
                  </button>
               </div>
            ) : (
               <div ref={listRef} className="space-y-6">
                 {filteredRides.map((trip, index) => (
                   <article key={trip.id} className="group relative overflow-hidden rounded-3xl border border-white/5 bg-surface-container-lowest flex flex-col transition-all duration-300 hover:shadow-2xl hover:border-primary/50 md:flex-row">
                     {index === 0 && sortBy === "Lowest price" && (
                       <div className="absolute top-0 right-0 rounded-bl-2xl bg-secondary px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white z-10">Best Value</div>
                     )}
                     <div className="flex flex-1 flex-col gap-6 p-8 md:flex-row">
                       <div className="min-w-[120px] flex flex-col justify-between">
                         <div>
                           <div className="text-3xl font-headline font-bold text-on-surface">{new Date(trip.dateDepart).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
                           <div className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mt-1">{Math.max(1, Math.round((trip.nbPlacesTotal * 2.5) / 2))}h 15m duration</div>
                         </div>
                         <div className="mt-4">
                           <div className="text-3xl font-headline font-bold text-on-surface">{new Date(new Date(trip.dateDepart).getTime() + 2 * 60 * 60 * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
                         </div>
                       </div>
                       
                       <div className="hidden flex-col items-center py-2 md:flex px-2">
                         <div className="h-4 w-4 rounded-full border-4 border-surface-container-lowest bg-primary z-10 shadow-sm" />
                         <div className="w-0.5 flex-1 bg-gradient-to-b from-primary via-surface-variant to-secondary" />
                         <div className="h-4 w-4 rounded-full border-4 border-surface-container-lowest bg-secondary z-10 shadow-sm" />
                       </div>
                       
                       <div className="flex-1 space-y-8 flex flex-col justify-between">
                         <div className="space-y-6">
                           <div>
                             <div className="text-xl font-bold text-on-surface">{trip.villeDepart}</div>
                           </div>
                           <div>
                             <div className="text-xl font-bold text-on-surface">{trip.villeArrivee}</div>
                           </div>
                         </div>
                         <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-high text-lg font-headline font-extrabold text-on-surface">
                             {trip.conducteurNom?.slice(0, 1) ?? "D"}
                           </div>
                           <div>
                             <div className="text-sm font-bold text-on-surface">{trip.conducteurNom ?? "Driver"}</div>
                             <div className="flex items-center text-xs text-on-surface-variant font-medium mt-0.5">
                               <MaterialIcon name="star" filled className="text-[14px] text-primary mr-0.5" /> 4.9 &bull; {trip.vehiculeDescription ?? "Standard Vehicle"}
                             </div>
                           </div>
                         </div>
                       </div>
                       
                       <div className="flex flex-row items-end justify-between border-t border-white/5 pt-6 md:flex-col md:justify-between md:border-l md:border-t-0 md:pl-8 md:pt-0">
                         <div className="text-right">
                           <div className="text-5xl font-headline font-extrabold tracking-tighter text-primary">€{trip.prix.toFixed(0)}</div>
                           <div className={`mt-2 text-xs font-bold uppercase tracking-wider ${trip.nbPlacesDisponibles <= 1 ? "text-error" : "text-on-surface-variant"}`}>
                             {trip.nbPlacesDisponibles} seat(s) left
                           </div>
                         </div>
                         <Link to={`/ride-details/${trip.id}`} className="rounded-xl bg-surface-container px-6 py-3 text-sm font-bold text-on-surface transition-all group-hover:bg-primary group-hover:text-black group-hover:shadow-lg group-hover:shadow-primary/20">
                           Book Ride
                         </Link>
                       </div>
                     </div>
                   </article>
                 ))}
               </div>
            )}
          </section>
        </div>
      </main>
    </PageShell>
  );
}
