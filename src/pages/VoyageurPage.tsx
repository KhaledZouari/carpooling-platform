import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MaterialIcon } from "../components/MaterialIcon";
import gsap from "gsap";
import {
  authApi,
  reservationApi,
  trajetApi,
  avisApi,
  reclamationApi,
} from "../api/covoiturage";
import { PageShell } from "../components/layout/PageShell";
import { useAuth } from "../context/AuthContext";
import { demoTrajets } from "../data/demo";
import type {
  ReclamationResponse,
  ReservationResponse,
  TrajetResponse,
  UserResponse,
} from "../types/covoiturage";
import { Toast, ConfirmModal } from "../components/IHM";

export function VoyageurPage() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserResponse | null>(user);
  const [trips, setTrips] = useState<TrajetResponse[]>(demoTrajets);
  const [reservations, setReservations] = useState<ReservationResponse[]>([]);
  const [isLoadingReservations, setIsLoadingReservations] = useState(true);
  const [reclamations, setReclamations] = useState<ReclamationResponse[]>([]);
  const [reservationTrips, setReservationTrips] = useState<
    Map<number, TrajetResponse>
  >(new Map());
  const [profileForm, setProfileForm] = useState({
    nom: "",
    prenom: "",
    telephone: "",
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [reclamationForm, setReclamationForm] = useState({
    reservationId: "",
    objet: "",
    message: "",
  });
  const [isSubmittingReclamation, setIsSubmittingReclamation] = useState(false);

  // Tabs
  const [activeTab, setActiveTab] = useState<
    "bookings" | "discover" | "profile"
  >("bookings");
  const contentRef = useRef<HTMLDivElement>(null);

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
  const [reviewModal, setReviewModal] = useState<{
    isOpen: boolean;
    trajetId: number | null;
  }>({ isOpen: false, trajetId: null });
  const [reviewForm, setReviewForm] = useState({ note: 5, commentaire: "" });

  const fetchData = () => {
    authApi
      .me()
      .then(setProfile)
      .catch(() => setProfile(user));
    trajetApi
      .search()
      .then(setTrips)
      .catch(() => setTrips(demoTrajets));
    setIsLoadingReservations(true);
    reservationApi
      .myReservations()
      .then(setReservations)
      .catch(() => setReservations([]))
      .finally(() => setIsLoadingReservations(false));
    reclamationApi
      .myReclamations()
      .then(setReclamations)
      .catch(() => setReclamations([]));
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  useEffect(() => {
    setProfileForm({
      nom: profile?.nom ?? "",
      prenom: profile?.prenom ?? "",
      telephone: profile?.telephone ?? "",
    });
  }, [profile]);

  useEffect(() => {
    // Fetch trip details for each reservation to check completion status
    const tripMap = new Map<number, TrajetResponse>();
    const fetchTripDetails = async () => {
      for (const res of reservations) {
        if (res.trajetId && !tripMap.has(res.trajetId)) {
          try {
            const tripData = await trajetApi.getById(res.trajetId);
            tripMap.set(res.trajetId, tripData);
          } catch {
            // Ignore errors, trip data may not be available
          }
        }
      }
      setReservationTrips(tripMap);
    };
    if (reservations.length > 0) {
      fetchTripDetails();
    }
  }, [reservations]);

  useEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.6, ease: "power3.out" },
      );
    }
  }, [activeTab]);

  const confirmCancelReservation = (id: number) => {
    setConfirmState({
      isOpen: true,
      title: "Annuler la réservation",
      message: "Confirmez-vous l'annulation ? Le conducteur sera informé.",
      danger: true,
      action: async () => {
        try {
          await reservationApi.annuler(id);
          setToast({ message: "Réservation annulée.", type: "success" });
          fetchData();
        } catch {
          setToast({ message: "Annulation impossible.", type: "error" });
        } finally {
          setConfirmState((prev) => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  const submitReview = async () => {
    if (!reviewModal.trajetId) return;
    try {
      await avisApi.create({
        trajetId: reviewModal.trajetId,
        note: reviewForm.note,
        commentaire: reviewForm.commentaire,
      });
      setToast({ message: "Avis envoyé.", type: "success" });
      setReviewModal({ isOpen: false, trajetId: null });
      setReviewForm({ note: 5, commentaire: "" });
    } catch {
      setToast({ message: "Envoi de l'avis impossible.", type: "error" });
    }
  };

  const saveProfile = async () => {
    setIsSavingProfile(true);
    try {
      const updated = await authApi.updateMe({
        nom: profileForm.nom,
        prenom: profileForm.prenom,
        telephone: profileForm.telephone,
      });
      setProfile(updated);
      updateUser(updated);
      setToast({ message: "Profil mis à jour.", type: "success" });
    } catch {
      setToast({ message: "Mise à jour du profil impossible.", type: "error" });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const submitReclamation = async () => {
    if (!reclamationForm.objet.trim() || !reclamationForm.message.trim()) {
      setToast({
        message: "Objet et message sont obligatoires.",
        type: "error",
      });
      return;
    }
    setIsSubmittingReclamation(true);
    try {
      await reclamationApi.create({
        objet: reclamationForm.objet.trim(),
        message: reclamationForm.message.trim(),
        reservationId: reclamationForm.reservationId
          ? Number(reclamationForm.reservationId)
          : undefined,
      });
      setToast({ message: "Réclamation envoyée.", type: "success" });
      setReclamationForm({ reservationId: "", objet: "", message: "" });
      fetchData();
    } catch {
      setToast({
        message: "Envoi de la réclamation impossible.",
        type: "error",
      });
    } finally {
      setIsSubmittingReclamation(false);
    }
  };

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
              Espace voyageur
            </h1>
            <p className="mt-2 text-lg text-on-surface-variant font-medium">
              Suivez vos réservations et trouvez de nouveaux trajets.
            </p>
          </div>

          <div className="flex flex-col gap-3 md:items-end">
            <div className="flex bg-surface-container-low p-1.5 rounded-2xl border border-outline-variant/60 shadow-inner self-start md:self-auto">
              {[
                { id: "bookings", label: "Réservations", icon: "book_online" },
                { id: "discover", label: "Découvrir", icon: "explore" },
                { id: "profile", label: "Profil", icon: "person" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() =>
                    setActiveTab(tab.id as "bookings" | "discover" | "profile")
                  }
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
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
            <Link
              to="/conducteur"
              className="inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-5 py-2.5 font-bold text-on-primary shadow-lg shadow-primary/20 transition-colors hover:bg-primary-dim"
            >
              Publier un trajet
            </Link>
          </div>
        </div>

        {/* Tab Content */}
        <div ref={contentRef} className="flex-1">
          {activeTab === "bookings" && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {isLoadingReservations ? (
                [0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="col-span-full rounded-2xl border-2 border-outline bg-surface p-6 animate-pulse"
                  >
                    <div className="h-6 w-40 bg-surface-container-high mb-4" />
                    <div className="h-4 w-28 bg-surface-container-high mb-2" />
                    <div className="mt-6 h-8 w-full bg-surface-container-high" />
                  </div>
                ))
              ) : reservations.length === 0 ? (
                <div className="col-span-full rounded-3xl border border-dashed border-outline-variant/30 bg-surface-container-lowest p-16 text-center">
                  <MaterialIcon
                    name="directions_car"
                    className="text-8xl text-primary/30 mb-6 inline-block"
                  />
                  <h3 className="text-2xl font-headline font-bold uppercase mb-3 text-on-surface">
                    Aucune réservation active
                  </h3>
                  <p className="text-on-surface-variant mb-6 font-medium">
                    Trouvez un trajet et réservez votre place.
                  </p>
                  <button
                    onClick={() => setActiveTab("discover")}
                    className="mt-6 px-8 py-3 bg-primary text-on-primary rounded-xl font-bold hover:bg-primary-dim transition-colors"
                  >
                    Parcourir les trajets
                  </button>
                </div>
              ) : (
                reservations.map((res) => {
                  const isActive =
                    res.statut === "EN_ATTENTE" || res.statut === "CONFIRMEE";
                  const tripData = reservationTrips.get(res.trajetId ?? 0);
                  const isDone =
                    res.statut === "CONFIRMEE" &&
                    tripData?.statut === "TERMINE";

                  return (
                    <article
                      key={res.id}
                      className="group relative overflow-hidden rounded-2xl bg-surface-container-lowest p-6 border border-outline-variant/60 hover:border-primary/50 transition-colors shadow-[0_12px_32px_rgba(31,41,51,0.08)]"
                    >
                      <div className="absolute top-0 right-0 p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                            res.statut === "CONFIRMEE"
                              ? "bg-primary/20 text-primary"
                              : res.statut === "EN_ATTENTE"
                                ? "bg-amber-500/20 text-amber-500"
                                : res.statut === "REFUSEE"
                                  ? "bg-error/20 text-error"
                                  : "bg-surface-variant text-on-surface-variant"
                          }`}
                        >
                          {res.statut}
                        </span>
                      </div>

                      <div className="mt-8 mb-6">
                        <h3 className="text-xl font-headline font-bold text-on-surface line-clamp-2">
                          {res.trajetDescription ?? `Trajet #${res.trajetId}`}
                        </h3>
                        <p className="mt-2 text-on-surface-variant text-sm font-medium">
                          {res.nbPlacesReservees} place(s) réservée(s)
                        </p>
                        {res.statut === "ANNULEE" &&
                        (res.penalitePourcentage ?? 0) > 0 ? (
                          <p className="mt-2 text-error text-xs font-bold uppercase">
                            Pénalité: {res.penalitePourcentage}% (
                            {(res.penaliteMontant ?? 0).toFixed(2)}€)
                          </p>
                        ) : null}
                      </div>

                      <div className="flex gap-2 mt-auto pt-4 border-t border-outline-variant/10">
                        {isActive && (
                          <button
                            onClick={() => confirmCancelReservation(res.id)}
                            className="flex-1 py-2.5 border-2 border-outline bg-surface hover:bg-error/10 hover:border-error font-mono font-bold uppercase text-xs text-on-surface transition-colors"
                          >
                            Annuler
                          </button>
                        )}
                        {isDone && (
                          <button
                            onClick={() =>
                              setReviewModal({
                                isOpen: true,
                                trajetId: res.trajetId ?? null,
                              })
                            }
                            className="flex-1 py-2.5 border-2 border-primary bg-primary text-on-primary font-mono font-bold uppercase text-xs hover:bg-primary-dim transition-colors"
                          >
                            Laisser un avis
                          </button>
                        )}
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          )}

          {activeTab === "discover" && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-headline font-bold">
                  Recommandés pour vous
                </h2>
                <Link
                  to="/rides"
                  className="text-primary font-bold hover:underline flex items-center gap-1"
                >
                  Tout voir{" "}
                  <MaterialIcon name="arrow_forward" className="text-sm" />
                </Link>
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {trips.slice(0, 3).map((trip) => (
                  <Link
                    key={trip.id}
                    to={`/ride-details/${trip.id}`}
                    className="group block rounded-2xl bg-surface-container-lowest border border-outline-variant/60 hover:border-primary/50 transition-all hover:-translate-y-1 shadow-[0_12px_32px_rgba(31,41,51,0.08)] overflow-hidden"
                  >
                    <div className="h-32 bg-surface-container-high relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-tr from-surface-container-lowest to-transparent opacity-50 z-10" />
                      <MaterialIcon
                        name="map"
                        className="absolute -bottom-4 -right-4 text-8xl text-on-surface/5 transform group-hover:rotate-12 transition-transform"
                      />
                      <div className="absolute top-4 left-4 z-20">
                        <span className="bg-scrim/60 backdrop-blur-md text-primary font-bold px-3 py-1 rounded-full text-xs">
                          €{trip.prix.toFixed(0)}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="font-headline font-bold text-xl mb-1 group-hover:text-primary transition-colors">
                        {trip.villeDepart}{" "}
                        <MaterialIcon
                          name="arrow_right_alt"
                          className="inline align-middle"
                        />{" "}
                        {trip.villeArrivee}
                      </h3>
                      <p className="text-sm text-on-surface-variant font-medium">
                        {new Date(trip.dateDepart).toLocaleDateString()}
                      </p>
                      <div className="mt-4 flex items-center justify-between text-sm text-on-surface-variant font-semibold">
                        <span className="flex items-center gap-1">
                          <MaterialIcon
                            name="airline_seat_recline_normal"
                            className="text-lg"
                          />{" "}
                          {trip.nbPlacesDisponibles} restantes
                        </span>
                        <span className="text-primary group-hover:translate-x-1 transition-transform">
                          Réserver &rarr;
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {activeTab === "profile" && (
            <div className="grid max-w-5xl mx-auto gap-6 lg:grid-cols-[1fr_1fr]">
              <div className="rounded-2xl bg-surface-container-lowest p-8 border border-outline-variant/60 shadow-[0_12px_32px_rgba(31,41,51,0.08)]">
                <div className="flex flex-col md:flex-row gap-6 md:items-center">
                  <div className="h-24 w-24 rounded-full bg-primary flex items-center justify-center text-4xl font-headline font-extrabold text-on-primary shrink-0">
                    {profile?.prenom?.[0] ?? "U"}
                    {profile?.nom?.[0] ?? ""}
                  </div>
                  <div>
                    <div className="inline-block px-3 py-1 bg-surface-container text-xs font-bold uppercase tracking-widest rounded-full mb-2 text-on-surface-variant">
                      Compte voyageur
                    </div>
                    <h2 className="text-3xl font-headline font-bold text-on-surface">
                      {profile
                        ? `${profile.prenom} ${profile.nom}`
                        : "Voyageur"}
                    </h2>
                    <p className="text-on-surface-variant font-medium">
                      {profile?.email ?? "Email non renseigné"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-surface-container-low p-4 rounded-2xl">
                    <div className="text-on-surface-variant text-xs uppercase font-bold tracking-widest mb-1">
                      Trajets
                    </div>
                    <div className="text-2xl font-bold text-primary">
                      {reservations.length}
                    </div>
                  </div>
                  <div className="bg-surface-container-low p-4 rounded-2xl">
                    <div className="text-on-surface-variant text-xs uppercase font-bold tracking-widest mb-1">
                      Économie estimée
                    </div>
                    <div className="text-2xl font-bold text-primary">
                      €{reservations.length * 15}
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid gap-4">
                  <h3 className="font-headline text-2xl font-bold">
                    Modifier mes données
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      className="rounded-xl border border-outline-variant/20 bg-surface-container px-4 py-3 font-medium"
                      placeholder="Prénom"
                      value={profileForm.prenom}
                      onChange={(e) =>
                        setProfileForm((current) => ({
                          ...current,
                          prenom: e.target.value,
                        }))
                      }
                    />
                    <input
                      className="rounded-xl border border-outline-variant/20 bg-surface-container px-4 py-3 font-medium"
                      placeholder="Nom"
                      value={profileForm.nom}
                      onChange={(e) =>
                        setProfileForm((current) => ({
                          ...current,
                          nom: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <input
                    className="rounded-xl border border-outline-variant/20 bg-surface-container px-4 py-3 font-medium"
                    placeholder="Téléphone"
                    value={profileForm.telephone}
                    onChange={(e) =>
                      setProfileForm((current) => ({
                        ...current,
                        telephone: e.target.value,
                      }))
                    }
                  />
                  <button
                    type="button"
                    onClick={saveProfile}
                    disabled={isSavingProfile}
                    className="rounded-xl bg-primary px-4 py-3 font-bold text-on-primary hover:bg-primary-dim disabled:opacity-70"
                  >
                    {isSavingProfile ? "Enregistrement..." : "Enregistrer"}
                  </button>
                </div>
              </div>

              <div className="rounded-2xl bg-surface-container-lowest p-8 border border-outline-variant/60 shadow-[0_12px_32px_rgba(31,41,51,0.08)]">
                <h3 className="font-headline text-2xl font-bold mb-4">
                  Réclamations
                </h3>
                <div className="grid gap-3">
                  <select
                    className="rounded-xl border border-outline-variant/20 bg-surface-container px-4 py-3 font-medium"
                    value={reclamationForm.reservationId}
                    onChange={(e) =>
                      setReclamationForm((current) => ({
                        ...current,
                        reservationId: e.target.value,
                      }))
                    }
                  >
                    <option value="">Sans réservation</option>
                    {reservations.map((reservation) => (
                      <option key={reservation.id} value={reservation.id}>
                        #{reservation.id} -{" "}
                        {reservation.trajetDescription ??
                          `Trajet #${reservation.trajetId}`}
                      </option>
                    ))}
                  </select>
                  <input
                    className="rounded-xl border border-outline-variant/20 bg-surface-container px-4 py-3 font-medium"
                    placeholder="Objet"
                    value={reclamationForm.objet}
                    onChange={(e) =>
                      setReclamationForm((current) => ({
                        ...current,
                        objet: e.target.value,
                      }))
                    }
                  />
                  <textarea
                    rows={4}
                    className="rounded-xl border border-outline-variant/20 bg-surface-container px-4 py-3 font-medium resize-none"
                    placeholder="Décrivez votre problème..."
                    value={reclamationForm.message}
                    onChange={(e) =>
                      setReclamationForm((current) => ({
                        ...current,
                        message: e.target.value,
                      }))
                    }
                  />
                  <button
                    type="button"
                    onClick={submitReclamation}
                    disabled={isSubmittingReclamation}
                    className="rounded-xl bg-primary px-4 py-3 font-bold text-on-primary hover:bg-primary-dim disabled:opacity-70"
                  >
                    {isSubmittingReclamation
                      ? "Envoi..."
                      : "Envoyer la réclamation"}
                  </button>
                </div>
                <div className="mt-6 grid gap-3 max-h-56 overflow-auto pr-1">
                  {reclamations.length === 0 ? (
                    <p className="text-sm text-on-surface-variant font-medium">
                      Aucune réclamation pour le moment.
                    </p>
                  ) : (
                    reclamations.map((reclamation) => (
                      <article
                        key={reclamation.id}
                        className="rounded-xl border border-outline-variant/40 bg-surface-container-low p-3"
                      >
                        <div className="flex justify-between items-start gap-3">
                          <p className="font-bold">{reclamation.objet}</p>
                          <span className="text-[10px] font-bold uppercase bg-surface-container px-2 py-1 rounded">
                            {reclamation.statut}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-on-surface-variant">
                          {reclamation.message}
                        </p>
                      </article>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Review Modal powered by GSAP in IHM components isn't built for full custom forms, so we inline a GSAP modal here or just use CSS. We will use a simple CSS one for now, or build a custom one if needed. */}
      {reviewModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-scrim/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-md rounded-none bg-surface border-2 border-on-surface p-8 shadow-[0_12px_32px_rgba(31,41,51,0.08)] animate-in zoom-in-95 duration-300">
            <h3 className="text-3xl font-headline font-extrabold uppercase text-on-surface mb-1">
              Laisser un avis
            </h3>
            <p className="text-sm text-on-surface-variant mb-8 font-mono font-bold uppercase">
              Notez votre expérience du trajet
            </p>

            <div className="space-y-8">
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-widest text-on-surface-variant mb-4">
                  Note (1-5 étoiles)
                </label>
                <div className="flex gap-2 justify-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() =>
                        setReviewForm({ ...reviewForm, note: star })
                      }
                      className={`p-3 border-2 transition-all ${
                        reviewForm.note >= star
                          ? "border-primary bg-primary text-on-primary scale-110"
                          : "border-outline bg-surface text-on-surface-variant hover:border-primary"
                      }`}
                    >
                      <MaterialIcon
                        name="star"
                        filled={reviewForm.note >= star}
                        className="text-2xl"
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-widest text-on-surface-variant mb-4">
                  Commentaire
                </label>
                <textarea
                  className="w-full border-2 border-outline bg-surface-container p-4 text-sm font-mono focus:border-primary focus:outline-none resize-none placeholder:text-on-surface-variant/50"
                  rows={4}
                  placeholder="Partagez votre expérience..."
                  value={reviewForm.commentaire}
                  onChange={(e) =>
                    setReviewForm({
                      ...reviewForm,
                      commentaire: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <button
                onClick={() =>
                  setReviewModal({ isOpen: false, trajetId: null })
                }
                className="border-2 border-outline px-6 py-3 font-mono font-bold uppercase text-on-surface hover:bg-surface-container transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={submitReview}
                disabled={!reviewForm.commentaire}
                className="border-2 border-primary bg-primary px-6 py-3 font-mono font-bold uppercase text-on-primary hover:bg-primary-dim transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:border-on-surface-variant"
              >
                Envoyer
              </button>
            </div>
          </div>
        </div>
      )}

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
