import api from "./http";
import type {
  AdminStatsResponse,
  AuthResponse,
  AvisRequest,
  AvisResponse,
  LoginRequest,
  RegisterRequest,
  ReservationRequest,
  ReservationResponse,
  TrajetRequest,
  TrajetResponse,
  TripSearchParams,
  UserResponse,
  VehiculeResponse,
} from "../types/covoiturage";

const toSearchParams = (params: TripSearchParams) => {
  const searchParams = new URLSearchParams();
  if (params.depart) searchParams.set("depart", params.depart);
  if (params.arrivee) searchParams.set("arrivee", params.arrivee);
  if (params.date) searchParams.set("date", params.date);
  if (params.places) searchParams.set("places", String(params.places));
  return searchParams.toString();
};

export const authApi = {
  login: async (payload: LoginRequest) =>
    (await api.post<AuthResponse>("/auth/login", payload)).data,
  register: async (payload: RegisterRequest) =>
    (await api.post<AuthResponse>("/auth/register", payload)).data,
  me: async () => (await api.get<UserResponse>("/auth/me")).data,
};

export const trajetApi = {
  search: async (params: TripSearchParams = {}) => {
    const query = toSearchParams(params);
    const url = query ? `/trajets?${query}` : "/trajets";
    return (await api.get<TrajetResponse[]>(url)).data;
  },
  getById: async (id: number) =>
    (await api.get<TrajetResponse>(`/trajets/${id}`)).data,
  create: async (payload: TrajetRequest) =>
    (await api.post<TrajetResponse>("/trajets", payload)).data,
  update: async (id: number, payload: TrajetRequest) =>
    (await api.put<TrajetResponse>(`/trajets/${id}`, payload)).data,
  cancel: async (id: number) =>
    (await api.delete<TrajetResponse>(`/trajets/${id}`)).data,
  myTrajets: async () =>
    (await api.get<TrajetResponse[]>("/trajets/mes-trajets")).data,
};

export const reservationApi = {
  create: async (payload: ReservationRequest) =>
    (await api.post<ReservationResponse>("/reservations", payload)).data,
  myReservations: async () =>
    (await api.get<ReservationResponse[]>("/reservations/mes-reservations"))
      .data,
  confirmer: async (id: number) =>
    (await api.put<ReservationResponse>(`/reservations/${id}/confirmer`)).data,
  annuler: async (id: number) =>
    (await api.put<ReservationResponse>(`/reservations/${id}/annuler`)).data,
  refuser: async (id: number) =>
    (await api.put<ReservationResponse>(`/reservations/${id}/refuser`)).data,
};

export const vehiculeApi = {
  create: async (payload: Omit<VehiculeResponse, "id" | "conducteurId">) =>
    (await api.post<VehiculeResponse>("/vehicules", payload)).data,
  myVehicules: async () =>
    (await api.get<VehiculeResponse[]>("/vehicules/mes-vehicules")).data,
  remove: async (id: number) => {
    await api.delete(`/vehicules/${id}`);
  },
};

export const avisApi = {
  create: async (payload: AvisRequest) =>
    (await api.post<AvisResponse>("/avis", payload)).data,
  byConducteur: async (id: number) =>
    (await api.get<AvisResponse[]>(`/avis/conducteur/${id}`)).data,
};

export const adminApi = {
  users: async () => (await api.get<UserResponse[]>("/admin/users")).data,
  block: async (id: number) =>
    (await api.put<UserResponse>(`/admin/users/${id}/bloquer`)).data,
  unblock: async (id: number) =>
    (await api.put<UserResponse>(`/admin/users/${id}/debloquer`)).data,
  trajets: async () => (await api.get<TrajetResponse[]>("/admin/trajets")).data,
  deleteTrajet: async (id: number) => {
    await api.delete(`/admin/trajets/${id}`);
  },
  stats: async () => (await api.get<AdminStatsResponse>("/admin/stats")).data,
};
