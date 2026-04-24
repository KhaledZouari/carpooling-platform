import { useEffect, useMemo, useState, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { PageShell } from "../components/layout/PageShell";
import { MaterialIcon } from "../components/MaterialIcon";
import { demoTrajets, demoUser, demoVehicules } from "../data/demo";
import { trajetApi, vehiculeApi, reservationApi } from "../api/covoiturage";
import { useAuth } from "../context/AuthContext";
import type {
  TrajetResponse,
  VehiculeResponse,
  ReservationResponse,
} from "../types/covoiturage";
import { Toast, ConfirmModal } from "../components/IHM";

export function DriverDashboardPage() {
  const { user } = useAuth();
  const isDriver = user?.role === "CONDUCTEUR";
  const [trajets, setTrajets] = useState<TrajetResponse[]>(demoTrajets);
  const [vehicules, setVehicules] = useState<VehiculeResponse[]>(demoVehicules);
  const [reservations, setReservations] = useState<ReservationResponse[]>([]);

  // Tabs
  const [activeTab, setActiveTab] = useState<"fleet" | "requests" | "publish">(
    "requests",
  );
  const contentRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState({
    villeDepart: "",
    villeArrivee: "",
    dateDepart: "",
    nbPlacesTotal: 3,
    prix: 12,
    vehiculeId: 0,
  });

  const [newVehicle, setNewVehicle] = useState({
    marque: "",
    modele: "",
    immatriculation: "",
    nbPlaces: 4,
    annee: 2020,
    imageFile: null as File | null,
  });
  const [showVehicleForm, setShowVehicleForm] = useState(false);

  // IHM States
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    action: () => void;
    danger?: boolean;
  }>({ isOpen: false, title: "", message: "", action: () => {} });

  const fetchData = () => {
    trajetApi
      .myTrajets()
      .then(setTrajets)
      .catch(() => setTrajets(demoTrajets));
    vehiculeApi
      .myVehicules()
      .then((v) => {
        setVehicules(v);
        if (v.length > 0 && form.vehiculeId === 0)
          setForm((prev) => ({ ...prev, vehiculeId: v[0].id }));
      })
      .catch(() => setVehicules(demoVehicules));
    reservationApi
      .pourMesTrajets()
      .then(setReservations)
      .catch(() => {});
  };

  useEffect(() => {
    if (!isDriver) return;
    fetchData();
  }, [isDriver]);

  useEffect(() => {
    if (contentRef.current && isDriver) {
      gsap.fromTo(
        contentRef.current.children,
        { opacity: 0, scale: 0.98, y: 15 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          stagger: 0.05,
          duration: 0.5,
          ease: "power2.out",
        },
      );
    }
  }, [activeTab, isDriver]);

  const totalEarned = useMemo(
    () => trajets.reduce((sum, trip) => sum + trip.prix, 0),
    [trajets],
  );
  const rating = user?.note ?? demoUser.note ?? 4.9;

  const getApiErrorMessage = (error: unknown) => {
    if (typeof error !== "object" || error === null || !("response" in error)) {
      return "Failed to publish ride.";
    }

    const response = (
      error as {
        response?: {
          data?: { message?: string; errors?: Record<string, string> };
        };
      }
    ).response;
    const data = response?.data;
    if (data?.errors?.dateDepart) {
      return `Invalid departure date: ${data.errors.dateDepart}`;
    }
    if (data?.message) {
      return data.message;
    }
    return "Failed to publish ride.";
  };

  const submitRide = async () => {
    if (!isDriver) return;
    try {
      await trajetApi.create({
        villeDepart: form.villeDepart,
        villeArrivee: form.villeArrivee,
        dateDepart: form.dateDepart,
        nbPlacesTotal: form.nbPlacesTotal,
        prix: form.prix,
        vehiculeId: form.vehiculeId || undefined,
      });
      setToast({ message: "Ride published successfully!", type: "success" });
      setForm({ ...form, villeDepart: "", villeArrivee: "" });
      fetchData();
      setActiveTab("requests");
    } catch (error) {
      setToast({ message: getApiErrorMessage(error), type: "error" });
    }
  };

  const handleAddVehicle = async () => {
    try {
      const created = await vehiculeApi.create({
        marque: newVehicle.marque,
        modele: newVehicle.modele,
        immatriculation: newVehicle.immatriculation,
        nbPlaces: newVehicle.nbPlaces,
        annee: newVehicle.annee,
      });

      if (newVehicle.imageFile) {
        await vehiculeApi.uploadImage(created.id, newVehicle.imageFile);
      }

      setToast({ message: "Vehicle added successfully!", type: "success" });
      setShowVehicleForm(false);
      setNewVehicle({
        marque: "",
        modele: "",
        immatriculation: "",
        nbPlaces: 4,
        annee: 2020,
        imageFile: null,
      });
      fetchData();
    } catch {
      setToast({ message: "Failed to add vehicle.", type: "error" });
    }
  };

  const confirmDeleteVehicle = (id: number) => {
    setConfirmState({
      isOpen: true,
      title: "Delete Vehicle",
      message:
        "Are you sure you want to delete this vehicle? This cannot be undone.",
      danger: true,
      action: async () => {
        try {
          await vehiculeApi.remove(id);
          setToast({ message: "Vehicle deleted.", type: "success" });
          fetchData();
        } catch {
          setToast({ message: "Failed to delete vehicle.", type: "error" });
        } finally {
          setConfirmState((prev) => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  const confirmCancelRide = (id: number) => {
    setConfirmState({
      isOpen: true,
      title: "Cancel Ride",
      message:
        "Are you sure you want to cancel this ride? All passenger reservations will be cancelled automatically.",
      danger: true,
      action: async () => {
        try {
          await trajetApi.cancel(id);
          setToast({
            message: "Ride cancelled successfully.",
            type: "success",
          });
          fetchData();
        } catch {
          setToast({ message: "Failed to cancel ride.", type: "error" });
        } finally {
          setConfirmState((prev) => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  const handleReservation = async (
    id: number,
    action: "confirmer" | "refuser",
  ) => {
    try {
      if (action === "confirmer") {
        await reservationApi.confirmer(id);
        setToast({ message: "Reservation confirmed.", type: "success" });
      } else {
        await reservationApi.refuser(id);
        setToast({ message: "Reservation refused.", type: "info" });
      }
      fetchData();
    } catch {
      setToast({ message: "Failed to process reservation.", type: "error" });
    }
  };

  if (!isDriver) {
    return (
      <PageShell>
        <main className="mx-auto flex w-full max-w-7xl items-center justify-center flex-1 px-6 pb-24 pt-32">
          <div className="text-center bg-surface-container-lowest p-12 rounded-3xl border border-white/5 shadow-2xl max-w-md">
            <MaterialIcon name="block" className="text-error text-6xl mb-4" />
            <h2 className="text-3xl font-headline font-bold mb-2">
              Driver Access Required
            </h2>
            <p className="text-on-surface-variant font-medium mb-8">
              Sign in with a conductor account to publish and manage rides.
            </p>
            <Link
              to="/auth"
              className="inline-flex rounded-xl bg-primary px-6 py-3 font-bold text-black shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
            >
              Go to login
            </Link>
          </div>
        </main>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <main className="mx-auto flex w-full max-w-7xl flex-col flex-1 px-6 pb-24 pt-32">
        {/* Header & Tabs */}
        <div className="mb-12 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-5xl font-headline font-extrabold tracking-tighter text-on-surface">
              Driver Dashboard
            </h1>
            <p className="mt-2 text-lg text-on-surface-variant font-medium">
              Manage your fleet, upcoming rides, and passenger requests.
            </p>
          </div>

          <div className="flex bg-surface-container-low p-1.5 rounded-2xl border border-white/5 shadow-inner self-start md:self-auto overflow-x-auto no-scrollbar">
            {[
              { id: "requests", label: "Trips & Requests", icon: "forum" },
              { id: "fleet", label: "Fleet & Stats", icon: "directions_car" },
              { id: "publish", label: "Publish", icon: "add_circle" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition-all duration-300 whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-primary text-black shadow-lg shadow-primary/20 scale-105"
                    : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
                }`}
              >
                <MaterialIcon name={tab.icon} className="text-xl" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div ref={contentRef} className="flex-1">
          {activeTab === "requests" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-5 space-y-6">
                <h2 className="text-2xl font-headline font-bold flex items-center gap-2">
                  <MaterialIcon
                    name="mark_email_unread"
                    className="text-primary"
                  />{" "}
                  Incoming Requests
                </h2>
                {reservations.filter((r) => r.statut === "EN_ATTENTE")
                  .length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-outline-variant/30 bg-surface-container-lowest p-10 text-center">
                    <MaterialIcon
                      name="done_all"
                      className="text-4xl text-on-surface-variant/30 mb-2"
                    />
                    <p className="text-on-surface-variant font-medium">
                      No pending requests right now.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reservations
                      .filter((r) => r.statut === "EN_ATTENTE")
                      .map((res) => (
                        <article
                          key={res.id}
                          className="rounded-2xl border border-primary/20 bg-primary/5 p-5 shadow-lg shadow-primary/5"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <div className="font-headline font-bold text-lg text-primary">
                                {res.voyageurNom ?? `User #${res.voyageurId}`}
                              </div>
                              <div className="text-sm font-medium text-on-surface-variant mt-1">
                                Requested {res.nbPlacesReservees} seat(s)
                              </div>
                            </div>
                            <span className="bg-primary/20 text-primary px-2 py-1 rounded text-xs font-bold uppercase">
                              Pending
                            </span>
                          </div>
                          <div className="text-sm text-on-surface bg-surface-container-lowest p-3 rounded-xl mb-4 border border-white/5">
                            <MaterialIcon
                              name="route"
                              className="text-[14px] inline align-text-bottom mr-1"
                            />
                            {res.trajetDescription}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                handleReservation(res.id, "refuser")
                              }
                              className="flex-1 py-2 rounded-xl border border-error/50 text-error font-bold hover:bg-error/10 transition-colors"
                            >
                              Decline
                            </button>
                            <button
                              onClick={() =>
                                handleReservation(res.id, "confirmer")
                              }
                              className="flex-1 py-2 rounded-xl bg-primary text-black font-bold hover:bg-primary-dim transition-colors shadow-md shadow-primary/20"
                            >
                              Approve
                            </button>
                          </div>
                        </article>
                      ))}
                  </div>
                )}
              </div>
              <div className="lg:col-span-7 space-y-6">
                <h2 className="text-2xl font-headline font-bold flex items-center gap-2">
                  <MaterialIcon name="commute" className="text-primary" /> My
                  Published Rides
                </h2>
                {trajets.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-outline-variant/30 bg-surface-container-lowest p-16 text-center">
                    <p className="text-on-surface-variant font-medium">
                      You haven't published any rides yet.
                    </p>
                    <button
                      onClick={() => setActiveTab("publish")}
                      className="mt-4 px-6 py-2 bg-surface-container hover:bg-surface-variant rounded-xl font-bold transition-colors"
                    >
                      Create a ride
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {trajets.map((trip) => {
                      const isCancelled = trip.statut === "ANNULE";
                      const isCompleted = trip.statut === "TERMINE";
                      return (
                        <article
                          key={trip.id}
                          className={`flex flex-col gap-6 rounded-3xl p-6 md:flex-row shadow-xl border border-white/5 ${
                            isCancelled
                              ? "bg-error/5 opacity-75 grayscale"
                              : isCompleted
                                ? "bg-surface-container-low opacity-75"
                                : "bg-surface-container-lowest hover:border-primary/30 transition-colors"
                          }`}
                        >
                          <div
                            className={`relative h-24 w-full overflow-hidden rounded-2xl md:w-32 flex-shrink-0 ${isCancelled ? "bg-error/20" : "bg-surface-container"}`}
                          >
                            <div className="absolute inset-0 flex items-center justify-center">
                              <MaterialIcon
                                name={
                                  isCancelled
                                    ? "block"
                                    : isCompleted
                                      ? "flag"
                                      : "directions_car"
                                }
                                className={`text-4xl ${isCancelled ? "text-error" : "text-primary"}`}
                              />
                            </div>
                          </div>
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex justify-between items-start">
                                <h3
                                  className={`text-xl font-headline font-bold ${isCancelled ? "line-through text-on-surface-variant" : ""}`}
                                >
                                  {trip.villeDepart} &rarr; {trip.villeArrivee}
                                </h3>
                                <span
                                  className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${
                                    trip.statut === "OUVERT"
                                      ? "bg-primary/20 text-primary"
                                      : trip.statut === "COMPLET"
                                        ? "bg-secondary/20 text-secondary"
                                        : trip.statut === "ANNULE"
                                          ? "bg-error/20 text-error"
                                          : "bg-surface-variant text-on-surface-variant"
                                  }`}
                                >
                                  {trip.statut}
                                </span>
                              </div>
                              <div className="text-sm font-medium text-on-surface-variant mt-2 flex items-center gap-4">
                                <span className="flex items-center gap-1">
                                  <MaterialIcon
                                    name="event"
                                    className="text-[16px]"
                                  />{" "}
                                  {new Date(
                                    trip.dateDepart,
                                  ).toLocaleDateString()}
                                </span>
                                <span className="flex items-center gap-1">
                                  <MaterialIcon
                                    name="group"
                                    className="text-[16px]"
                                  />{" "}
                                  {trip.nbPlacesTotal -
                                    trip.nbPlacesDisponibles}
                                  /{trip.nbPlacesTotal} Booked
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/5">
                              <Link
                                to={`/ride-details/${trip.id}`}
                                className="text-sm font-bold text-on-surface bg-surface-container px-4 py-2 rounded-lg hover:bg-surface-variant transition-colors"
                              >
                                View Details
                              </Link>
                              {trip.statut === "OUVERT" && (
                                <button
                                  onClick={() => confirmCancelRide(trip.id)}
                                  className="text-sm font-bold text-error hover:bg-error/10 px-4 py-2 rounded-lg transition-colors ml-auto"
                                >
                                  Cancel Ride
                                </button>
                              )}
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "fleet" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-5 space-y-6">
                <h2 className="text-2xl font-headline font-bold flex items-center gap-2">
                  <MaterialIcon name="bar_chart" className="text-primary" />{" "}
                  Overview
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-3xl border border-white/5 bg-surface-container-lowest p-6 shadow-xl">
                    <div className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">
                      Total Revenue
                    </div>
                    <div className="text-4xl font-headline font-extrabold text-primary">
                      €{totalEarned.toFixed(0)}
                    </div>
                  </div>
                  <div className="rounded-3xl border border-white/5 bg-surface-container-lowest p-6 shadow-xl">
                    <div className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">
                      Driver Rating
                    </div>
                    <div className="text-4xl font-headline font-extrabold text-primary flex items-center gap-1">
                      {rating.toFixed(1)}{" "}
                      <MaterialIcon name="star" filled className="text-3xl" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-headline font-bold flex items-center gap-2">
                    <MaterialIcon name="local_taxi" className="text-primary" />{" "}
                    My Fleet
                  </h2>
                  <button
                    onClick={() => setShowVehicleForm(!showVehicleForm)}
                    className="flex items-center gap-2 bg-surface-container-high hover:bg-surface-variant px-4 py-2 rounded-full text-sm font-bold transition-colors"
                  >
                    <MaterialIcon name={showVehicleForm ? "close" : "add"} />{" "}
                    {showVehicleForm ? "Cancel" : "Add Vehicle"}
                  </button>
                </div>

                {showVehicleForm && (
                  <div className="rounded-3xl border border-primary/30 bg-primary/5 p-6 shadow-xl animate-in slide-in-from-top-4 duration-300">
                    <h3 className="font-headline font-bold mb-4">
                      Register New Vehicle
                    </h3>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <input
                        className="rounded-xl border border-outline-variant/20 bg-surface-container px-4 py-3 text-sm font-medium focus:border-primary focus:ring-1 focus:ring-primary"
                        placeholder="Make (e.g. Toyota)"
                        value={newVehicle.marque}
                        onChange={(e) =>
                          setNewVehicle({
                            ...newVehicle,
                            marque: e.target.value,
                          })
                        }
                      />
                      <input
                        className="rounded-xl border border-outline-variant/20 bg-surface-container px-4 py-3 text-sm font-medium focus:border-primary focus:ring-1 focus:ring-primary"
                        placeholder="Model (e.g. Corolla)"
                        value={newVehicle.modele}
                        onChange={(e) =>
                          setNewVehicle({
                            ...newVehicle,
                            modele: e.target.value,
                          })
                        }
                      />
                      <input
                        className="col-span-2 rounded-xl border border-outline-variant/20 bg-surface-container px-4 py-3 text-sm font-medium focus:border-primary focus:ring-1 focus:ring-primary"
                        placeholder="License Plate (e.g. AB-123-CD)"
                        value={newVehicle.immatriculation}
                        onChange={(e) =>
                          setNewVehicle({
                            ...newVehicle,
                            immatriculation: e.target.value,
                          })
                        }
                      />
                      <input
                        type="number"
                        className="rounded-xl border border-outline-variant/20 bg-surface-container px-4 py-3 text-sm font-medium focus:border-primary focus:ring-1 focus:ring-primary"
                        placeholder="Year"
                        value={newVehicle.annee}
                        onChange={(e) =>
                          setNewVehicle({
                            ...newVehicle,
                            annee: Number(e.target.value),
                          })
                        }
                      />
                      <input
                        type="number"
                        className="rounded-xl border border-outline-variant/20 bg-surface-container px-4 py-3 text-sm font-medium focus:border-primary focus:ring-1 focus:ring-primary"
                        placeholder="Seats"
                        value={newVehicle.nbPlaces}
                        onChange={(e) =>
                          setNewVehicle({
                            ...newVehicle,
                            nbPlaces: Number(e.target.value),
                          })
                        }
                      />
                      <label className="col-span-2 cursor-pointer flex items-center justify-center gap-2 rounded-xl border border-dashed border-outline-variant/50 bg-surface-container px-4 py-4 text-sm font-medium hover:bg-surface-variant transition-colors">
                        <MaterialIcon
                          name="add_a_photo"
                          className="text-primary"
                        />
                        {newVehicle.imageFile
                          ? newVehicle.imageFile.name
                          : "Optional: Upload Vehicle Photo"}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setNewVehicle({
                                ...newVehicle,
                                imageFile: e.target.files[0],
                              });
                            }
                          }}
                        />
                      </label>
                    </div>
                    <button
                      onClick={handleAddVehicle}
                      className="w-full rounded-xl bg-primary py-3 font-bold text-black hover:bg-primary-dim transition-colors shadow-lg shadow-primary/20"
                    >
                      Save Vehicle
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {vehicules.length === 0 ? (
                    <div className="col-span-full rounded-3xl border border-dashed border-outline-variant/30 bg-surface-container-lowest p-10 text-center">
                      <p className="text-on-surface-variant font-medium">
                        No vehicles registered. You need a vehicle to publish a
                        ride.
                      </p>
                    </div>
                  ) : (
                    vehicules.map((v) => (
                      <div
                        key={v.id}
                        className="relative rounded-3xl border border-white/5 bg-surface-container-lowest overflow-hidden shadow-xl group hover:border-primary/50 transition-colors"
                      >
                        {v.imageUrl ? (
                          <div className="h-40 w-full overflow-hidden bg-surface-container relative">
                            <img
                              src={`http://localhost:8080${v.imageUrl}`}
                              alt={v.marque}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest to-transparent" />
                          </div>
                        ) : (
                          <div className="h-40 w-full bg-surface-container flex items-center justify-center">
                            <MaterialIcon
                              name="directions_car"
                              className="text-6xl text-on-surface-variant/20"
                            />
                          </div>
                        )}
                        <div className="p-6 relative">
                          <button
                            onClick={() => confirmDeleteVehicle(v.id)}
                            className="absolute top-4 right-4 text-outline hover:text-error transition-colors bg-surface-container p-2 rounded-full opacity-0 group-hover:opacity-100"
                          >
                            <MaterialIcon
                              name="delete"
                              className="text-[16px]"
                            />
                          </button>
                          <h3 className="text-xl font-headline font-bold">
                            {v.marque} {v.modele}
                          </h3>
                          <p className="text-sm text-on-surface-variant mt-1 font-medium bg-surface-container inline-block px-2 py-1 rounded mt-2">
                            {v.immatriculation}
                          </p>
                          <div className="mt-4 flex gap-4 text-sm font-semibold text-on-surface-variant">
                            <span>
                              <MaterialIcon
                                name="airline_seat_recline_normal"
                                className="text-[14px] align-middle"
                              />{" "}
                              {v.nbPlaces} seats
                            </span>
                            <span>
                              <MaterialIcon
                                name="calendar_month"
                                className="text-[14px] align-middle"
                              />{" "}
                              {v.annee}
                            </span>
                          </div>
                          <div className="mt-6 pt-4 border-t border-white/5">
                            <label className="cursor-pointer flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-surface-container-high hover:bg-primary hover:text-black font-bold text-sm transition-colors text-on-surface">
                              <MaterialIcon
                                name="add_a_photo"
                                className="text-[16px]"
                              />
                              {v.imageUrl ? "Change Image" : "Upload Image"}
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  try {
                                    await vehiculeApi.uploadImage(v.id, file);
                                    setToast({
                                      message: "Image uploaded successfully!",
                                      type: "success",
                                    });
                                    fetchData();
                                  } catch {
                                    setToast({
                                      message: "Failed to upload image.",
                                      type: "error",
                                    });
                                  }
                                }}
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "publish" && (
            <div className="max-w-3xl mx-auto rounded-3xl border border-white/5 bg-surface-container-lowest p-8 shadow-2xl">
              <h2 className="text-3xl font-headline font-bold mb-8 text-center text-primary">
                Publish a new ride
              </h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  submitRide();
                }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">
                      Departure City
                    </label>
                    <div className="relative">
                      <MaterialIcon
                        name="my_location"
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-primary"
                      />
                      <input
                        required
                        className="w-full rounded-2xl border border-outline-variant/20 bg-surface-container py-4 pl-12 pr-4 font-medium focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-outline-variant"
                        placeholder="Where from?"
                        value={form.villeDepart}
                        onChange={(e) =>
                          setForm({ ...form, villeDepart: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">
                      Arrival City
                    </label>
                    <div className="relative">
                      <MaterialIcon
                        name="location_on"
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-primary"
                      />
                      <input
                        required
                        className="w-full rounded-2xl border border-outline-variant/20 bg-surface-container py-4 pl-12 pr-4 font-medium focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-outline-variant"
                        placeholder="Where to?"
                        value={form.villeArrivee}
                        onChange={(e) =>
                          setForm({ ...form, villeArrivee: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">
                      Date & Time
                    </label>
                    <div className="relative">
                      <MaterialIcon
                        name="event"
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-primary"
                      />
                      <input
                        required
                        type="datetime-local"
                        className="w-full rounded-2xl border border-outline-variant/20 bg-surface-container py-4 pl-12 pr-4 font-medium focus:border-primary focus:ring-1 focus:ring-primary"
                        value={form.dateDepart}
                        onChange={(e) =>
                          setForm({ ...form, dateDepart: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">
                      Seats offered
                    </label>
                    <div className="relative">
                      <MaterialIcon
                        name="airline_seat_recline_normal"
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-primary"
                      />
                      <input
                        required
                        type="number"
                        min="1"
                        className="w-full rounded-2xl border border-outline-variant/20 bg-surface-container py-4 pl-12 pr-4 font-medium focus:border-primary focus:ring-1 focus:ring-primary"
                        value={form.nbPlacesTotal}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            nbPlacesTotal: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">
                      Vehicle
                    </label>
                    <div className="relative">
                      <MaterialIcon
                        name="directions_car"
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-primary"
                      />
                      <select
                        required
                        className="w-full rounded-2xl border border-outline-variant/20 bg-surface-container py-4 pl-12 pr-4 font-medium focus:border-primary focus:ring-1 focus:ring-primary appearance-none cursor-pointer"
                        value={form.vehiculeId}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            vehiculeId: Number(e.target.value),
                          })
                        }
                      >
                        {vehicules.length === 0 ? (
                          <option value="0">Register a vehicle first</option>
                        ) : null}
                        {vehicules.map((v) => (
                          <option key={v.id} value={v.id}>
                            {v.marque} {v.modele}
                          </option>
                        ))}
                      </select>
                      <MaterialIcon
                        name="expand_more"
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">
                      Price per seat (€)
                    </label>
                    <div className="relative">
                      <MaterialIcon
                        name="payments"
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-primary"
                      />
                      <input
                        required
                        type="number"
                        min="1"
                        className="w-full rounded-2xl border border-outline-variant/20 bg-surface-container py-4 pl-12 pr-4 font-medium focus:border-primary focus:ring-1 focus:ring-primary"
                        value={form.prix}
                        onChange={(e) =>
                          setForm({ ...form, prix: Number(e.target.value) })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5 mt-8">
                  <button
                    type="submit"
                    disabled={vehicules.length === 0}
                    className="w-full rounded-2xl bg-primary py-5 text-lg font-headline font-extrabold text-black shadow-2xl shadow-primary/30 transition-all hover:bg-primary-dim hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Publish Ride
                  </button>
                  {vehicules.length === 0 && (
                    <p className="text-error text-sm text-center mt-3 font-semibold">
                      You must add a vehicle in the Fleet tab first.
                    </p>
                  )}
                </div>
              </form>
            </div>
          )}
        </div>
      </main>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <ConfirmModal
        isOpen={confirmState.isOpen}
        title={confirmState.title}
        message={confirmState.message}
        danger={confirmState.danger}
        onConfirm={confirmState.action}
        onCancel={() => setConfirmState((prev) => ({ ...prev, isOpen: false }))}
      />
    </PageShell>
  );
}
