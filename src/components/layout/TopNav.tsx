import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { MaterialIcon } from "../MaterialIcon";
import { getRoleTheme, type AppRole } from "./roleTheme.ts";

type NavItem = {
  label: string;
  href: string;
  kind: "route" | "hash";
};

const publicNav: NavItem[] = [
  { label: "Find a Ride", href: "/rides", kind: "route" },
  { label: "Voyageur Space", href: "/voyageur", kind: "route" },
  { label: "Offer a Ride", href: "/conducteur", kind: "route" },
];

const roleNav: Record<Exclude<AppRole, "public">, NavItem[]> = {
  voyageur: [
    { label: "Search", href: "#search", kind: "hash" },
    { label: "Reservations", href: "#reservations", kind: "hash" },
    { label: "Profile", href: "#profile", kind: "hash" },
  ],
  conducteur: [
    { label: "Stats", href: "#stats", kind: "hash" },
    { label: "Publish", href: "#publish", kind: "hash" },
    { label: "Trips", href: "#trajets", kind: "hash" },
  ],
  admin: [
    { label: "Stats", href: "#stats", kind: "hash" },
    { label: "Users", href: "#users", kind: "hash" },
    { label: "Trips", href: "#trajets", kind: "hash" },
  ],
};

export function TopNav({ role = "public" }: { role?: AppRole }) {
  const { user, isAuthenticated } = useAuth();
  const theme = getRoleTheme(role);
  const items = role === "public" ? publicNav : roleNav[role];

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? `font-semibold ${theme.accent} border-b-2 ${theme.border}`
      : "font-medium text-slate-500 hover:text-blue-500 transition-colors";

  return (
    <header className="fixed top-0 z-50 w-full bg-white/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          to="/"
          className="flex items-center gap-3 text-xl font-bold tracking-tight text-slate-800"
        >
          Covoiturage
          <span
            className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${theme.accentSoft}`}
          >
            {theme.label}
          </span>
        </Link>
        <div className="hidden items-center gap-8 md:flex">
          {items.map((item) =>
            item.kind === "route" ? (
              <NavLink key={item.href} to={item.href} className={navLinkClass}>
                {item.label}
              </NavLink>
            ) : (
              <a
                key={item.href}
                href={item.href}
                className="font-medium text-slate-500 transition-colors hover:text-blue-500"
              >
                {item.label}
              </a>
            ),
          )}
        </div>
        <div className="flex items-center gap-4">
          <button
            className="text-on-surface-variant transition-colors hover:text-primary"
            type="button"
            aria-label="Notifications"
          >
            <MaterialIcon name="notifications" />
          </button>
          <Link
            to={isAuthenticated ? "/auth" : "/auth"}
            className={`h-8 w-8 overflow-hidden rounded-full bg-surface-container ring-2 ${theme.ring}`}
            aria-label={user ? `${user.prenom} ${user.nom}` : "Login"}
          >
            <div
              className={`flex h-full w-full items-center justify-center bg-surface-container-high text-xs font-bold ${theme.accent}`}
            >
              {user ? `${user.prenom?.[0] ?? "U"}${user.nom?.[0] ?? ""}` : "In"}
            </div>
          </Link>
        </div>
      </nav>
    </header>
  );
}
