import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { MaterialIcon } from "../MaterialIcon";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  isActive
    ? "font-semibold text-blue-600 border-b-2 border-blue-600"
    : "font-medium text-slate-500 hover:text-blue-500 transition-colors";

export function TopNav() {
  const { user, isAuthenticated } = useAuth();

  return (
    <header className="fixed top-0 z-50 w-full bg-white/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          to="/"
          className="text-xl font-bold tracking-tight text-slate-800"
        >
          Covoiturage
        </Link>
        <div className="hidden items-center gap-8 md:flex">
          <NavLink to="/rides" className={navLinkClass}>
            Find a Ride
          </NavLink>
          <NavLink to="/driver" className={navLinkClass}>
            Offer a Ride
          </NavLink>
          <NavLink to="/ride-details" className={navLinkClass}>
            My Trips
          </NavLink>
          <NavLink to="/admin" className={navLinkClass}>
            Admin
          </NavLink>
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
            className="h-8 w-8 overflow-hidden rounded-full bg-surface-container ring-2 ring-primary/10"
            aria-label={user ? `${user.prenom} ${user.nom}` : "Login"}
          >
            <div className="flex h-full w-full items-center justify-center bg-surface-container-high text-xs font-bold text-primary">
              {user ? `${user.prenom?.[0] ?? "U"}${user.nom?.[0] ?? ""}` : "In"}
            </div>
          </Link>
        </div>
      </nav>
    </header>
  );
}
