export type Role = "ADMIN" | "VOYAGEUR" | "CONDUCTEUR";
export type StatutTrajet = "OUVERT" | "COMPLET" | "ANNULE" | "TERMINE";
export type TypeTrajet = "LONG" | "LEGER";
export type StatutReservation =
  | "EN_ATTENTE"
  | "CONFIRMEE"
  | "ANNULEE"
  | "REFUSEE";
export type StatutReclamation = "OUVERTE" | "EN_COURS" | "RESOLUE" | "REJETEE";

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
  distanceKm?: number | null;
  typeTrajet?: TypeTrajet | null;
  fumeurAutorise?: boolean | null;
  animauxAutorises?: boolean | null;
  nbBagagesMax?: number | null;
  typeBagage?: string | null;
  statut: StatutTrajet;
  conducteurId?: number | null;
  conducteurNom?: string | null;
  conducteurNote?: number | null;
  conducteurTrajets?: number | null;
  vehiculeId?: number | null;
  vehiculeDescription?: string | null;
  vehiculeType?: string | null;
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
  penaliteMontant?: number | null;
  penalitePourcentage?: number | null;
  dateReservation?: string | null;
  dateAnnulation?: string | null;
};

export type VehiculeResponse = {
  id: number;
  marque: string;
  modele: string;
  typeVehicule?: string | null;
  immatriculation: string;
  nbPlaces: number;
  couleur?: string | null;
  annee: number;
  conducteurId?: number | null;
  imageUrl?: string | null;
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
  role?: Exclude<Role, "ADMIN">;
};

export type BecomeConducteurRequest = {
  permisConduire?: string;
};

export type TrajetRequest = {
  villeDepart: string;
  villeArrivee: string;
  dateDepart: string;
  nbPlacesTotal: number;
  prix: number;
  distanceKm?: number | null;
  typeTrajet?: TypeTrajet | null;
  fumeurAutorise?: boolean | null;
  animauxAutorises?: boolean | null;
  nbBagagesMax?: number | null;
  typeBagage?: string | null;
  statut?: StatutTrajet | null;
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
  typeTrajet?: TypeTrajet;
  fumeur?: boolean;
  animaux?: boolean;
  typeVehicule?: string;
  statut?: StatutTrajet;
  prixMin?: number;
  prixMax?: number;
  noteMin?: number;
  distanceKmMin?: number;
  distanceKmMax?: number;
  heureDepartMin?: string;
  heureDepartMax?: string;
};

export type UpdateProfileRequest = {
  nom?: string;
  prenom?: string;
  telephone?: string;
};

export type ReclamationRequest = {
  objet: string;
  message: string;
  reservationId?: number;
};

export type ReclamationResponse = {
  id: number;
  objet: string;
  message: string;
  statut: StatutReclamation;
  auteurId?: number | null;
  auteurNom?: string | null;
  reservationId?: number | null;
  dateCreation?: string | null;
  dateMiseAJour?: string | null;
};
