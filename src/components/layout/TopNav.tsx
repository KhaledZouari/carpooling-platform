import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { MaterialIcon } from "../MaterialIcon";

const globalNav = [
  { label: "Find a Ride", href: "/rides", icon: "search" },
  { label: "Passenger Space", href: "/voyageur", icon: "luggage" },
  { label: "Driver Dashboard", href: "/conducteur", icon: "directions_car" },
];

export function TopNav() {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  return (
    <header className="fixed top-0 z-50 w-full bg-surface/80 backdrop-blur-xl border-b border-white/5">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          to="/"
          className="flex items-center gap-3 text-2xl font-headline font-extrabold tracking-tighter text-on-surface hover:text-primary transition-colors"
        >
          <MaterialIcon name="api" className="text-primary text-3xl" />
          COVOITURAGE
        </Link>
        <div className="hidden items-center gap-2 md:flex bg-surface-container-low p-1 rounded-full border border-white/5 shadow-inner">
          {globalNav.map((item) => {
            const isActive = location.pathname.startsWith(item.href);
            return (
              <NavLink 
                key={item.href} 
                to={item.href} 
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                  isActive 
                    ? "bg-surface-container-high text-primary shadow-sm" 
                    : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
                }`}
              >
                <MaterialIcon name={item.icon} className="text-[18px]" />
                {item.label}
              </NavLink>
            );
          })}
        </div>
        <div className="flex items-center gap-4">
          {user?.role === "ADMIN" && (
             <Link to="/admin" className="text-sm font-bold text-secondary hover:text-white transition-colors flex items-center gap-1">
                <MaterialIcon name="admin_panel_settings" className="text-lg" /> Admin
             </Link>
          )}
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-low text-on-surface-variant transition-colors hover:text-primary hover:bg-surface-container"
            aria-label="Notifications"
          >
            <MaterialIcon name="notifications" />
          </button>
          <Link
            to={isAuthenticated ? "/auth" : "/auth"}
            className="flex h-10 w-10 overflow-hidden rounded-full border border-primary/30 hover:border-primary transition-colors bg-primary/10 items-center justify-center text-primary font-headline font-bold"
            aria-label={user ? `${user.prenom} ${user.nom}` : "Login"}
          >
            {user ? `${user.prenom?.[0] ?? "U"}${user.nom?.[0] ?? ""}` : <MaterialIcon name="person" />}
          </Link>
        </div>
      </nav>
    </header>
  );
}
