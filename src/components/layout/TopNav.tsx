import { Link, NavLink, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/theme";
import { MaterialIcon } from "../MaterialIcon";

export function TopNav() {
  const { user, isAuthenticated, clearSession } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dashboardHref = user?.role === "ADMIN" ? "/admin" : "/voyageur";
  const globalNav =
    user?.role === "ADMIN"
      ? [
          { label: "Admin", href: "/admin" },
          { label: "Trajets", href: "/rides" },
        ]
      : [
          { label: "Rechercher", href: "/rides" },
          { label: "Mon espace", href: "/voyageur" },
          { label: "Publier", href: "/conducteur" },
        ];

  return (
    <header className="fixed top-0 z-50 w-full border-b-2 border-outline bg-surface/95 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link
          to="/"
          className="flex min-h-11 items-center gap-3 font-headline text-2xl font-extrabold uppercase tracking-normal text-on-surface transition-colors hover:text-primary"
        >
          <span className="grid h-11 w-11 place-items-center border-2 border-outline bg-on-surface text-surface">
            CV
          </span>
          <span>Covoiturage</span>
        </Link>

        <div className="hidden items-stretch border-2 border-outline bg-surface md:flex">
          {globalNav.map((item) => {
            const isActive = location.pathname.startsWith(item.href);
            return (
              <NavLink
                key={item.href}
                to={item.href}
                className={`relative flex min-h-11 items-center px-5 font-mono text-xs font-bold uppercase transition-colors ${
                  isActive
                    ? "bg-primary-container text-on-surface after:absolute after:inset-x-0 after:bottom-0 after:h-1 after:bg-primary"
                    : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                }`}
              >
                {item.label}
              </NavLink>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className="app-icon-button"
            aria-label={isDark ? "Activer le mode clair" : "Activer le mode sombre"}
            title={isDark ? "Mode clair" : "Mode sombre"}
          >
            <MaterialIcon name={isDark ? "light_mode" : "dark_mode"} />
          </button>
          <Link
            to={isAuthenticated ? dashboardHref : "/auth"}
            className="app-icon-button font-mono text-xs font-bold uppercase hover:bg-primary-container"
            aria-label={user ? `Ouvrir l'espace de ${user.prenom} ${user.nom}` : "Connexion"}
          >
            {user ? `${user.prenom?.[0] ?? "U"}${user.nom?.[0] ?? ""}` : "IN"}
          </Link>
          {isAuthenticated ? (
            <button
              type="button"
              onClick={clearSession}
              className="app-icon-button hidden sm:inline-flex"
              aria-label="Se déconnecter"
              title="Se déconnecter"
            >
              <MaterialIcon name="logout" className="text-lg" />
            </button>
          ) : null}
          <button
            type="button"
            className="app-icon-button md:hidden"
            aria-label="Ouvrir le menu"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            <MaterialIcon name={isMenuOpen ? "close" : "menu"} />
          </button>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="border-t-2 border-outline bg-surface px-4 py-4 md:hidden">
          <div className="mx-auto grid max-w-7xl gap-2">
            {globalNav.map((item) => {
              const isActive = location.pathname.startsWith(item.href);
              return (
                <NavLink
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`border-2 border-outline px-4 py-3 font-mono text-sm font-bold uppercase ${
                    isActive
                      ? "bg-primary-container underline decoration-4 underline-offset-8"
                      : "bg-surface hover:bg-surface-container"
                  }`}
                >
                  {item.label}
                </NavLink>
              );
            })}
            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => {
                  clearSession();
                  setIsMenuOpen(false);
                }}
                className="border-2 border-outline bg-surface px-4 py-3 text-left font-mono text-sm font-bold uppercase hover:bg-surface-container"
              >
                Déconnexion
              </button>
            ) : null}
          </div>
        </div>
      )}
    </header>
  );
}
