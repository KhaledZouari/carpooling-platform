import api from "./http";
import type {
  AdminStatsResponse,
  AuthResponse,
  AvisRequest,
  AvisResponse,
  BecomeConducteurRequest,
  LoginRequest,
  ReclamationRequest,
  ReclamationResponse,
  RegisterRequest,
  ReservationRequest,
  ReservationResponse,
  StatutReclamation,
  TrajetRequest,
  TrajetResponse,
  TripSearchParams,
  UpdateProfileRequest,
  UserResponse,
  VehiculeResponse,
} from "../types/covoiturage";

const toSearchParams = (params: TripSearchParams) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (typeof value === "string" && value.trim() === "") return;
    searchParams.set(key, String(value));
  });
  return searchParams.toString();
};

const toLocalDateTimeString = (date: Date) => {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};

const normalizeTrajetPayload = (payload: TrajetRequest): TrajetRequest => {
  const dateDepart = payload.dateDepart.trim();

  if (!dateDepart) {
    return payload;
  }

  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(dateDepart)) {
    return { ...payload, dateDepart: `${dateDepart}:00` };
  }

  if (dateDepart.endsWith("Z")) {
    const parsedDate = new Date(dateDepart);
    if (!Number.isNaN(parsedDate.getTime())) {
      return { ...payload, dateDepart: toLocalDateTimeString(parsedDate) };
    }
  }

  return payload;
};

export const authApi = {
  login: async (payload: LoginRequest) =>
    (await api.post<AuthResponse>("/auth/login", payload)).data,
  register: async (payload: RegisterRequest) =>
    (await api.post<AuthResponse>("/auth/register", payload)).data,
  becomeConducteur: async (payload: BecomeConducteurRequest = {}) =>
    (await api.post<AuthResponse>("/auth/become-conducteur", payload)).data,
  me: async () => (await api.get<UserResponse>("/auth/me")).data,
  updateMe: async (payload: UpdateProfileRequest) =>
    (await api.put<UserResponse>("/auth/me", payload)).data,
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
    (
      await api.post<TrajetResponse>(
        "/trajets",
        normalizeTrajetPayload(payload),
      )
    ).data,
  update: async (id: number, payload: TrajetRequest) =>
    (
      await api.put<TrajetResponse>(
        `/trajets/${id}`,
        normalizeTrajetPayload(payload),
      )
    ).data,
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
  pourMesTrajets: async () =>
    (await api.get<ReservationResponse[]>("/reservations/pour-mes-trajets"))
      .data,
  confirmer: async (id: number) =>
    (await api.put<ReservationResponse>(`/reservations/${id}/confirmer`)).data,
  annuler: async (id: number) =>
    (await api.put<ReservationResponse>(`/reservations/${id}/annuler`)).data,
  refuser: async (id: number) =>
    (await api.put<ReservationResponse>(`/reservations/${id}/refuser`)).data,
};

export const vehiculeApi = {
  create: async (
    payload: Omit<VehiculeResponse, "id" | "conducteurId" | "imageUrl">,
  ) => (await api.post<VehiculeResponse>("/vehicules", payload)).data,
  myVehicules: async () =>
    (await api.get<VehiculeResponse[]>("/vehicules/mes-vehicules")).data,
  remove: async (id: number) => {
    await api.delete(`/vehicules/${id}`);
  },
  uploadImage: async (id: number, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return (
      await api.post<VehiculeResponse>(`/vehicules/${id}/image`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
    ).data;
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
  searchUsers: async (q: string) =>
    (
      await api.get<UserResponse[]>(
        `/admin/users/search?q=${encodeURIComponent(q)}`,
      )
    ).data,
  block: async (id: number) =>
    (await api.put<UserResponse>(`/admin/users/${id}/bloquer`)).data,
  unblock: async (id: number) =>
    (await api.put<UserResponse>(`/admin/users/${id}/debloquer`)).data,
  trajets: async () => (await api.get<TrajetResponse[]>("/admin/trajets")).data,
  deleteTrajet: async (id: number) => {
    await api.delete(`/admin/trajets/${id}`);
  },
  stats: async () => (await api.get<AdminStatsResponse>("/admin/stats")).data,
  reclamations: async (params?: { q?: string; statut?: StatutReclamation }) => {
    const query = new URLSearchParams();
    if (params?.q?.trim()) query.set("q", params.q.trim());
    if (params?.statut) query.set("statut", params.statut);
    const suffix = query.toString() ? `?${query.toString()}` : "";
    return (
      await api.get<ReclamationResponse[]>(`/admin/reclamations${suffix}`)
    ).data;
  },
  updateReclamationStatus: async (id: number, statut: StatutReclamation) =>
    (
      await api.put<ReclamationResponse>(`/admin/reclamations/${id}/statut`, {
        statut,
      })
    ).data,
};

export const reclamationApi = {
  create: async (payload: ReclamationRequest) =>
    (await api.post<ReclamationResponse>("/reclamations", payload)).data,
  myReclamations: async () =>
    (await api.get<ReclamationResponse[]>("/reclamations/mes-reclamations"))
      .data,
};
