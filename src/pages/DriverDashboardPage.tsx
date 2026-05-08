import { useEffect, useMemo, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MaterialIcon } from "../components/MaterialIcon";
import gsap from "gsap";
import { PageShell } from "../components/layout/PageShell";
import { RequiredFieldLabel } from "../components/RequiredFieldLabel";
import { demoTrajets, demoUser, demoVehicules } from "../data/demo";
import {
  authApi,
  trajetApi,
  vehiculeApi,
  reservationApi,
} from "../api/covoiturage";
import { useAuth } from "../context/AuthContext";
import type {
  TrajetResponse,
  VehiculeResponse,
  ReservationResponse,
} from "../types/covoiturage";
import { Toast, ConfirmModal } from "../components/IHM";

export function DriverDashboardPage() {
  const { user, setSession } = useAuth();
  const navigate = useNavigate();
  const isDriver = user?.role === "CONDUCTEUR";
  const [trajets, setTrajets] = useState<TrajetResponse[]>(demoTrajets);
  const [vehicules, setVehicules] = useState<VehiculeResponse[]>(demoVehicules);
  const [reservations, setReservations] = useState<ReservationResponse[]>([]);
  const [isLoadingTrajets, setIsLoadingTrajets] = useState(true);
  const [isLoadingReservations, setIsLoadingReservations] = useState(true);

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
    distanceKm: 100,
    typeTrajet: "LEGER" as "LEGER" | "LONG",
    fumeurAutorise: false,
    animauxAutorises: false,
    nbBagagesMax: 0,
    typeBagage: "",
    vehiculeId: 0,
  });

  const [newVehicle, setNewVehicle] = useState({
    marque: "",
    modele: "",
    typeVehicule: "",
    immatriculation: "",
    nbPlaces: 4,
    annee: 2020,
    imageFile: null as File | null,
  });
  const [showVehicleForm, setShowVehicleForm] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);

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
    setIsLoadingTrajets(true);
    trajetApi
      .myTrajets()
      .then(setTrajets)
      .catch(() => setTrajets(demoTrajets))
      .finally(() => setIsLoadingTrajets(false));
    vehiculeApi
      .myVehicules()
      .then((v) => {
        setVehicules(v);
        if (v.length > 0 && form.vehiculeId === 0)
          setForm((prev) => ({ ...prev, vehiculeId: v[0].id }));
      })
      .catch(() => setVehicules(demoVehicules));
    setIsLoadingReservations(true);
    reservationApi
      .pourMesTrajets()
      .then(setReservations)
      .catch(() => {})
      .finally(() => setIsLoadingReservations(false));
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
  const minDepartureDateTime = useMemo(() => {
    const date = new Date();
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset() + 15);
    return date.toISOString().slice(0, 16);
  }, []);
  const selectedVehicle = vehicules.find((item) => item.id === form.vehiculeId);
  const publishSameRoute =
    form.villeDepart.trim().length > 0 &&
    form.villeArrivee.trim().length > 0 &&
    form.villeDepart.trim().toLowerCase() ===
      form.villeArrivee.trim().toLowerCase();
  const seatsExceedVehicle =
    Boolean(selectedVehicle) &&
    form.nbPlacesTotal > (selectedVehicle?.nbPlaces ?? 0);
  const hasPublishBlocker =
    !selectedVehicle || publishSameRoute || seatsExceedVehicle;
  const canPublishRide =
    Boolean(selectedVehicle) &&
    !publishSameRoute &&
    !seatsExceedVehicle &&
    Boolean(form.villeDepart.trim()) &&
    Boolean(form.villeArrivee.trim()) &&
    Boolean(form.dateDepart);

  const getApiErrorMessage = (error: unknown) => {
    if (typeof error !== "object" || error === null || !("response" in error)) {
      return "Publication impossible.";
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
    return "Publication impossible.";
  };

  const submitRide = async () => {
    if (!isDriver) return;
    if (!canPublishRide) {
      setToast({
        message: "Corrigez les champs du trajet avant publication.",
        type: "error",
      });
      return;
    }
    try {
      await trajetApi.create({
        villeDepart: form.villeDepart,
        villeArrivee: form.villeArrivee,
        dateDepart: form.dateDepart,
        nbPlacesTotal: form.nbPlacesTotal,
        prix: form.prix,
        distanceKm: form.distanceKm,
        typeTrajet: form.typeTrajet,
        fumeurAutorise: form.fumeurAutorise,
        animauxAutorises: form.animauxAutorises,
        nbBagagesMax: form.nbBagagesMax,
        typeBagage: form.typeBagage.trim() || undefined,
        vehiculeId: form.vehiculeId || undefined,
      });
      setToast({ message: "Trajet publié.", type: "success" });
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
        typeVehicule: newVehicle.typeVehicule || undefined,
        immatriculation: newVehicle.immatriculation,
        nbPlaces: newVehicle.nbPlaces,
        annee: newVehicle.annee,
      });

      if (newVehicle.imageFile) {
        await vehiculeApi.uploadImage(created.id, newVehicle.imageFile);
      }

      setToast({ message: "Véhicule ajouté.", type: "success" });
      setShowVehicleForm(false);
      setNewVehicle({
        marque: "",
        modele: "",
        typeVehicule: "",
        immatriculation: "",
        nbPlaces: 4,
        annee: 2020,
        imageFile: null,
      });
      fetchData();
    } catch {
      setToast({ message: "Ajout du véhicule impossible.", type: "error" });
    }
  };

  const confirmDeleteVehicle = (id: number) => {
    setConfirmState({
      isOpen: true,
      title: "Supprimer le véhicule",
      message:
        "Confirmez-vous la suppression de ce véhicule ? Cette action est définitive.",
      danger: true,
      action: async () => {
        try {
          await vehiculeApi.remove(id);
          setToast({ message: "Véhicule supprimé.", type: "success" });
          fetchData();
        } catch {
          setToast({
            message: "Suppression du véhicule impossible.",
            type: "error",
          });
        } finally {
          setConfirmState((prev) => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  const confirmCancelRide = (id: number) => {
    setConfirmState({
      isOpen: true,
      title: "Annuler le trajet",
      message:
        "Confirmez-vous l'annulation ? Les réservations des voyageurs seront annulées.",
      danger: true,
      action: async () => {
        try {
          await trajetApi.cancel(id);
          setToast({
            message: "Trajet annulé.",
            type: "success",
          });
          fetchData();
        } catch {
          setToast({
            message: "Annulation du trajet impossible.",
            type: "error",
          });
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
        setToast({ message: "Réservation confirmée.", type: "success" });
      } else {
        await reservationApi.refuser(id);
        setToast({ message: "Réservation refusée.", type: "info" });
      }
      fetchData();
    } catch {
      setToast({
        message: "Traitement de la réservation impossible.",
        type: "error",
      });
    }
  };

  const activateDriverSpace = async () => {
    if (!user || isUpgrading) return;
    setIsUpgrading(true);
    try {
      const session = await authApi.becomeConducteur({});
      setSession(session);
      setToast({ message: "Espace publication activé.", type: "success" });
    } catch {
      setToast({ message: "Activation impossible.", type: "error" });
    } finally {
      setIsUpgrading(false);
    }
  };

  if (!isDriver) {
    return (
      <PageShell>
        <main className="mx-auto flex w-full max-w-7xl items-center justify-center flex-1 px-6 pb-24 pt-32">
          <div className="text-center bg-surface-container-lowest p-12 rounded-3xl border border-outline-variant/60 shadow-[0_12px_32px_rgba(31,41,51,0.08)] max-w-md">
            <MaterialIcon
              name={user ? "commute" : "block"}
              className="text-primary text-6xl mb-4"
            />
            <h2 className="text-3xl font-headline font-bold mb-2">
              {user ? "Activer la publication" : "Connexion requise"}
            </h2>
            <p className="text-on-surface-variant font-medium mb-8">
              {user
                ? "Votre compte permet déjà de voyager. Activez l'espace publication pour proposer vos trajets et prendre des voyageurs."
                : "Connectez-vous pour réserver ou publier un trajet."}
            </p>
            {user ? (
              <button
                type="button"
                onClick={activateDriverSpace}
                disabled={isUpgrading}
                className="inline-flex rounded-xl bg-primary px-6 py-3 font-bold text-on-primary shadow-lg shadow-primary/20 transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isUpgrading ? "Activation..." : "Activer et publier"}
              </button>
            ) : (
              <Link
                to="/auth"
                className="inline-flex rounded-xl bg-primary px-6 py-3 font-bold text-on-primary shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
              >
                Se connecter
              </Link>
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
      </PageShell>
    );
  }

  return (
    <PageShell>
      <main className="mx-auto flex w-full max-w-7xl flex-col flex-1 px-6 pb-24 pt-32">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 px-4 py-2 font-bold text-primary hover:text-primary-dim transition-colors"
          aria-label="Retour"
        >
          <MaterialIcon name="arrow_back" className="text-2xl" />
          Retour
        </button>

        {/* Header & Tabs */}
        <div className="mb-12 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-5xl font-headline font-extrabold tracking-tighter text-on-surface">
              Espace conducteur
            </h1>
            <p className="mt-2 text-lg text-on-surface-variant font-medium">
              Gérez vos véhicules, trajets et demandes de réservation.
            </p>
          </div>

          <div className="flex bg-surface-container-low p-1.5 rounded-2xl border border-outline-variant/60 shadow-inner self-start md:self-auto overflow-x-auto no-scrollbar">
            {[
              { id: "requests", label: "Trajets & demandes", icon: "forum" },
              { id: "fleet", label: "Flotte & stats", icon: "directions_car" },
              { id: "publish", label: "Publier", icon: "add_circle" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() =>
                  setActiveTab(tab.id as "fleet" | "requests" | "publish")
                }
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition-all duration-300 whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-primary text-on-primary shadow-lg shadow-primary/20 scale-105"
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
                  Demandes entrantes
                </h2>
                {isLoadingReservations ? (
                  <div className="space-y-4">
                    {[0, 1].map((i) => (
                      <div
                        key={i}
                        className="rounded-2xl border border-primary/20 bg-primary/5 p-5 shadow-lg shadow-primary/5 animate-pulse"
                      >
                        <div className="h-6 w-48 bg-surface-container-high mb-3" />
                        <div className="h-4 w-32 bg-surface-container-high mb-3" />
                        <div className="h-10 w-full bg-surface-container-high rounded-lg" />
                      </div>
                    ))}
                  </div>
                ) : reservations.filter((r) => r.statut === "EN_ATTENTE")
                    .length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-outline-variant/30 bg-surface-container-lowest p-16 text-center">
                    <MaterialIcon
                      name="done_all"
                      className="text-8xl text-primary/30 mb-6 inline-block"
                    />
                    <h3 className="text-2xl font-headline font-bold uppercase mb-3 text-on-surface">
                      Aucune demande en attente
                    </h3>
                    <p className="text-on-surface-variant font-medium">
                      Les demandes de réservation apparaîtront ici.
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
                                {res.nbPlacesReservees} place(s) demandée(s)
                              </div>
                            </div>
                            <span className="bg-primary/20 text-primary px-2 py-1 rounded text-xs font-bold uppercase">
                              Pending
                            </span>
                          </div>
                          <div className="text-sm text-on-surface bg-surface-container-lowest p-3 rounded-xl mb-4 border border-outline-variant/60">
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
                              Refuser
                            </button>
                            <button
                              onClick={() =>
                                handleReservation(res.id, "confirmer")
                              }
                              className="flex-1 py-2 rounded-xl bg-primary text-on-primary font-bold hover:bg-primary-dim transition-colors shadow-md shadow-primary/20"
                            >
                              Confirmer
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
                  Trajets publiés
                </h2>
                {isLoadingTrajets ? (
                  <div className="space-y-4">
                    {[0, 1].map((i) => (
                      <div
                        key={i}
                        className="flex flex-col gap-6 rounded-3xl p-6 md:flex-row shadow-[0_8px_24px_rgba(31,41,51,0.06)] border border-outline-variant/60 animate-pulse"
                      >
                        <div className="h-24 w-full md:w-32 bg-surface-container-high rounded-2xl" />
                        <div className="flex-1 space-y-4">
                          <div className="h-6 w-64 bg-surface-container-high" />
                          <div className="h-4 w-40 bg-surface-container-high" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : trajets.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-outline-variant/30 bg-surface-container-lowest p-16 text-center">
                    <MaterialIcon
                      name="commute"
                      className="text-8xl text-primary/30 mb-6 inline-block"
                    />
                    <h3 className="text-2xl font-headline font-bold uppercase mb-3 text-on-surface">
                      Vous n'avez pas encore de trajet publié
                    </h3>
                    <p className="text-on-surface-variant font-medium mb-6">
                      Commencez à gagner en publiant votre premier trajet.
                    </p>
                    <button
                      onClick={() => setActiveTab("publish")}
                      className="px-8 py-3 bg-primary text-on-primary rounded-xl font-bold hover:bg-primary-dim transition-colors"
                    >
                      Publier un trajet
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
                          className={`flex flex-col gap-6 rounded-3xl p-6 md:flex-row shadow-[0_8px_24px_rgba(31,41,51,0.06)] border border-outline-variant/60 ${
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
                                  /{trip.nbPlacesTotal} réservées
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-outline-variant/60">
                              <Link
                                to={`/ride-details/${trip.id}`}
                                className="text-sm font-bold text-on-surface bg-surface-container px-4 py-2 rounded-lg hover:bg-surface-variant transition-colors"
                              >
                                Détails
                              </Link>
                              {trip.statut === "OUVERT" && (
                                <button
                                  onClick={() => confirmCancelRide(trip.id)}
                                  className="text-sm font-bold text-error hover:bg-error/10 px-4 py-2 rounded-lg transition-colors ml-auto"
                                >
                                  Annuler
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
                  <div className="rounded-3xl border border-outline-variant/60 bg-surface-container-lowest p-6 shadow-[0_8px_24px_rgba(31,41,51,0.06)]">
                    <div className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">
                      Total Revenue
                    </div>
                    <div className="text-4xl font-headline font-extrabold text-primary">
                      €{totalEarned.toFixed(0)}
                    </div>
                  </div>
                  <div className="rounded-3xl border border-outline-variant/60 bg-surface-container-lowest p-6 shadow-[0_8px_24px_rgba(31,41,51,0.06)]">
                    <div className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">
                      Note conducteur
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
                    {showVehicleForm ? "Annuler" : "Ajouter un véhicule"}
                  </button>
                </div>

                {showVehicleForm && (
                  <div className="rounded-3xl border border-primary/30 bg-primary/5 p-6 shadow-[0_8px_24px_rgba(31,41,51,0.06)] animate-in slide-in-from-top-4 duration-300">
                    <h3 className="font-headline font-bold mb-4">
                      Ajouter un véhicule
                    </h3>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <input
                        className="rounded-xl border border-outline-variant/20 bg-surface-container px-4 py-3 text-sm font-medium focus:border-primary focus:ring-1 focus:ring-primary"
                        placeholder="Marque (ex. Toyota)"
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
                        placeholder="Modèle (ex. Corolla)"
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
                        placeholder="Type de véhicule (ex. BERLINE, SUV)"
                        value={newVehicle.typeVehicule}
                        onChange={(e) =>
                          setNewVehicle({
                            ...newVehicle,
                            typeVehicule: e.target.value,
                          })
                        }
                      />
                      <input
                        className="col-span-2 rounded-xl border border-outline-variant/20 bg-surface-container px-4 py-3 text-sm font-medium focus:border-primary focus:ring-1 focus:ring-primary"
                        placeholder="Immatriculation (ex. AB-123-CD)"
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
                        placeholder="Places"
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
                          : "Optionnel : photo du véhicule"}
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
                      className="w-full rounded-xl bg-primary py-3 font-bold text-on-primary hover:bg-primary-dim transition-colors shadow-lg shadow-primary/20"
                    >
                      Enregistrer le véhicule
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {vehicules.length === 0 ? (
                    <div className="col-span-full rounded-3xl border border-dashed border-outline-variant/30 bg-surface-container-lowest p-10 text-center">
                      <p className="text-on-surface-variant font-medium">
                        Aucun véhicule enregistré. Ajoutez un véhicule pour
                        publier un trajet.
                      </p>
                    </div>
                  ) : (
                    vehicules.map((v) => (
                      <div
                        key={v.id}
                        className="relative rounded-3xl border border-outline-variant/60 bg-surface-container-lowest overflow-hidden shadow-[0_8px_24px_rgba(31,41,51,0.06)] group hover:border-primary/50 transition-colors"
                      >
                        {v.imageUrl ? (
                          <div className="h-40 w-full overflow-hidden bg-surface-container relative">
                            <img
                              src={`http://localhost:8089${v.imageUrl}`}
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
                          {v.typeVehicule ? (
                            <p className="text-xs text-on-surface-variant mt-1 font-semibold uppercase tracking-wider">
                              {v.typeVehicule}
                            </p>
                          ) : null}
                          <p className="text-sm text-on-surface-variant mt-2 font-medium bg-surface-container inline-block px-2 py-1 rounded">
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
                          <div className="mt-6 pt-4 border-t border-outline-variant/60">
                            <label className="cursor-pointer flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-surface-container-high hover:bg-primary hover:text-on-primary font-bold text-sm transition-colors text-on-surface">
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
                                      message: "Image ajoutée.",
                                      type: "success",
                                    });
                                    fetchData();
                                  } catch {
                                    setToast({
                                      message: "Ajout de l'image impossible.",
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
            <div className="max-w-3xl mx-auto rounded-3xl border border-outline-variant/60 bg-surface-container-lowest p-8 shadow-[0_12px_32px_rgba(31,41,51,0.08)]">
              <h2 className="text-3xl font-headline font-bold mb-8 text-center text-primary">
                Publier un trajet
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
                      <RequiredFieldLabel required>
                        Ville de départ
                      </RequiredFieldLabel>
                    </label>
                    <div className="relative">
                      <MaterialIcon
                        name="my_location"
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-primary"
                      />
                      <input
                        required
                        aria-invalid={publishSameRoute}
                        className="w-full rounded-2xl border border-outline-variant/20 bg-surface-container py-4 pl-12 pr-4 font-medium focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-outline-variant"
                        placeholder="Ex. Paris"
                        value={form.villeDepart}
                        onChange={(e) =>
                          setForm({ ...form, villeDepart: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">
                      <RequiredFieldLabel required>
                        Ville d'arrivée
                      </RequiredFieldLabel>
                    </label>
                    <div className="relative">
                      <MaterialIcon
                        name="location_on"
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-primary"
                      />
                      <input
                        required
                        aria-invalid={publishSameRoute}
                        className="w-full rounded-2xl border border-outline-variant/20 bg-surface-container py-4 pl-12 pr-4 font-medium focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-outline-variant"
                        placeholder="Ex. Lyon"
                        value={form.villeArrivee}
                        onChange={(e) =>
                          setForm({ ...form, villeArrivee: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>
                {publishSameRoute ? (
                  <p className="font-mono text-[11px] font-bold uppercase text-error">
                    La ville de départ et la destination doivent être
                    différentes.
                  </p>
                ) : null}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">
                      <RequiredFieldLabel required>
                        Date et heure
                      </RequiredFieldLabel>
                    </label>
                    <div className="relative">
                      <MaterialIcon
                        name="event"
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-primary"
                      />
                      <input
                        required
                        type="datetime-local"
                        min={minDepartureDateTime}
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
                      <RequiredFieldLabel required>
                        Places proposées
                      </RequiredFieldLabel>
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
                        max={selectedVehicle?.nbPlaces ?? 8}
                        aria-invalid={seatsExceedVehicle}
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
                {seatsExceedVehicle ? (
                  <p className="font-mono text-[11px] font-bold uppercase text-error">
                    Le nombre de places dépasse la capacité du véhicule
                    sélectionné.
                  </p>
                ) : null}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">
                      <RequiredFieldLabel required>Véhicule</RequiredFieldLabel>
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
                          <option value="0">Ajoutez d'abord un véhicule</option>
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
                      <RequiredFieldLabel required>
                        Prix par place (€)
                      </RequiredFieldLabel>
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">
                      <RequiredFieldLabel required>
                        Distance (km)
                      </RequiredFieldLabel>
                    </label>
                    <input
                      required
                      type="number"
                      min="1"
                      className="w-full rounded-2xl border border-outline-variant/20 bg-surface-container py-4 px-4 font-medium focus:border-primary focus:ring-1 focus:ring-primary"
                      value={form.distanceKm}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          distanceKm: Math.max(1, Number(e.target.value || 1)),
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">
                      Type de trajet
                    </label>
                    <select
                      className="w-full rounded-2xl border border-outline-variant/20 bg-surface-container py-4 px-4 font-medium focus:border-primary focus:ring-1 focus:ring-primary appearance-none cursor-pointer"
                      value={form.typeTrajet}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          typeTrajet: e.target.value as "LEGER" | "LONG",
                        })
                      }
                    >
                      <option value="LEGER">Léger</option>
                      <option value="LONG">Long</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">
                      Nb bagages max
                    </label>
                    <input
                      type="number"
                      min="0"
                      className="w-full rounded-2xl border border-outline-variant/20 bg-surface-container py-4 px-4 font-medium focus:border-primary focus:ring-1 focus:ring-primary"
                      value={form.nbBagagesMax}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          nbBagagesMax: Math.max(
                            0,
                            Number(e.target.value || 0),
                          ),
                        })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">
                      Type de bagage
                    </label>
                    <input
                      className="w-full rounded-2xl border border-outline-variant/20 bg-surface-container py-4 px-4 font-medium focus:border-primary focus:ring-1 focus:ring-primary"
                      placeholder="Ex. Valise cabine"
                      value={form.typeBagage}
                      onChange={(e) =>
                        setForm({ ...form, typeBagage: e.target.value })
                      }
                    />
                  </div>
                  <div className="rounded-2xl border border-outline-variant/20 bg-surface-container p-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-3">
                      Tolérances
                    </p>
                    <div className="grid gap-3">
                      <label className="flex items-center justify-between text-sm font-semibold">
                        Fumeur autorisé
                        <input
                          type="checkbox"
                          checked={form.fumeurAutorise}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              fumeurAutorise: e.target.checked,
                            })
                          }
                          className="h-5 w-5 accent-primary"
                        />
                      </label>
                      <label className="flex items-center justify-between text-sm font-semibold">
                        Animaux autorisés
                        <input
                          type="checkbox"
                          checked={form.animauxAutorises}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              animauxAutorises: e.target.checked,
                            })
                          }
                          className="h-5 w-5 accent-primary"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-outline-variant/60 mt-8">
                  <button
                    type="submit"
                    disabled={hasPublishBlocker}
                    className="w-full rounded-2xl bg-primary py-5 text-lg font-headline font-extrabold text-on-primary shadow-[0_12px_32px_rgba(31,41,51,0.08)] shadow-primary/30 transition-all hover:bg-primary-dim hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Publier le trajet
                  </button>
                  {vehicules.length === 0 && (
                    <p className="text-error text-sm text-center mt-3 font-semibold">
                      Ajoutez un véhicule dans l'onglet flotte avant de publier.
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
