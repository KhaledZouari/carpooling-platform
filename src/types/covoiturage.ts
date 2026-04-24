export type Role = "ADMIN" | "VOYAGEUR" | "CONDUCTEUR";
export type StatutTrajet = "OUVERT" | "COMPLET" | "ANNULE" | "TERMINE";
export type StatutReservation =
  | "EN_ATTENTE"
  | "CONFIRMEE"
  | "ANNULEE"
  | "REFUSEE";

export type UserResponse = {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string | null;
  role: Role;
  actif: boolean;
  dateInscription?: string | null;
  permisConduire?: string | null;
  note?: number | null;
};

export type AuthResponse = {
  token: string;
  user: UserResponse;
};

export type TrajetResponse = {
  id: number;
  villeDepart: string;
  villeArrivee: string;
  dateDepart: string;
  nbPlacesTotal: number;
  nbPlacesDisponibles: number;
  prix: number;
  statut: StatutTrajet;
  conducteurId?: number | null;
  conducteurNom?: string | null;
  vehiculeId?: number | null;
  vehiculeDescription?: string | null;
  vehiculeImageUrl?: string | null;
  createdAt?: string | null;
};

export type ReservationResponse = {
  id: number;
  trajetId?: number | null;
  trajetDescription?: string | null;
  voyageurId?: number | null;
  voyageurNom?: string | null;
  nbPlacesReservees: number;
  statut: StatutReservation;
  dateReservation?: string | null;
};

export type VehiculeResponse = {
  id: number;
  marque: string;
  modele: string;
  immatriculation: string;
  nbPlaces: number;
  couleur?: string | null;
  annee: number;
  conducteurId?: number | null;
};

export type AvisResponse = {
  id: number;
  note: number;
  commentaire?: string | null;
  dateAvis?: string | null;
  auteurId?: number | null;
  auteurNom?: string | null;
  trajetId?: number | null;
  conducteurId?: number | null;
};

export type AdminStatsResponse = {
  nbUsers: number;
  nbTrajets: number;
  nbReservations: number;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  nom: string;
  prenom: string;
  email: string;
  password: string;
  telephone?: string;
  permisConduire?: string;
  role: Exclude<Role, "ADMIN">;
};

export type TrajetRequest = {
  villeDepart: string;
  villeArrivee: string;
  dateDepart: string;
  nbPlacesTotal: number;
  prix: number;
  vehiculeId?: number | null;
};

export type ReservationRequest = {
  trajetId: number;
  nbPlacesReservees: number;
};

export type AvisRequest = {
  trajetId: number;
  note: number;
  commentaire: string;
};

export type TripSearchParams = {
  depart?: string;
  arrivee?: string;
  date?: string;
  places?: number;
};
