export type AppRole = "public" | "voyageur" | "conducteur" | "admin";

export type RoleTheme = {
  label: string;
  accent: string;
  accentSoft: string;
  border: string;
  ring: string;
};

const themes: Record<AppRole, RoleTheme> = {
  public: {
    label: "Public space",
    accent: "text-primary",
    accentSoft: "bg-primary/10 text-primary",
    border: "border-primary",
    ring: "ring-primary/20",
  },
  voyageur: {
    label: "Voyageur",
    accent: "text-sky-700",
    accentSoft: "bg-sky-100 text-sky-700",
    border: "border-sky-500",
    ring: "ring-sky-200",
  },
  conducteur: {
    label: "Conducteur",
    accent: "text-emerald-700",
    accentSoft: "bg-emerald-100 text-emerald-700",
    border: "border-emerald-500",
    ring: "ring-emerald-200",
  },
  admin: {
    label: "Admin",
    accent: "text-slate-800",
    accentSoft: "bg-slate-200 text-slate-800",
    border: "border-slate-800",
    ring: "ring-slate-300",
  },
};

export function getRoleTheme(role: AppRole) {
  return themes[role];
}
