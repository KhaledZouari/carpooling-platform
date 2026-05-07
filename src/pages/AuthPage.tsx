import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { PageShell } from "../components/layout/PageShell";
import { useAuth } from "../context/AuthContext";
import { MaterialIcon } from "../components/MaterialIcon";
import { RequiredFieldLabel } from "../components/RequiredFieldLabel";
import { authApi } from "../api/covoiturage";

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { setSession } = useAuth();
  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (formRef.current) {
      gsap.fromTo(
        formRef.current,
        { opacity: 0, scale: 0.95, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "power2.out" },
      );
    }
  }, [isLogin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (isLogin) {
        const authData = await authApi.login({ email, password });
        setSession(authData);
        navigate(authData.user.role === "ADMIN" ? "/admin" : "/voyageur");
      } else {
        await authApi.register({ nom, prenom, email, password });
        const authData = await authApi.login({ email, password });
        setSession(authData);
        navigate("/voyageur");
      }
    } catch {
      setError("Connexion impossible. Vérifiez vos identifiants.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageShell>
      <main className="mx-auto flex min-h-[80vh] w-full max-w-7xl items-center justify-center px-6 py-32 relative">
        <div className="w-full max-w-md">
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="rounded-2xl bg-surface-container-lowest/80 backdrop-blur-2xl p-10 shadow-[0_12px_32px_rgba(31,41,51,0.08)] border border-outline-variant/60"
          >
            <div className="text-center mb-10">
              <MaterialIcon name="api" className="text-primary text-5xl mb-4" />
              <h1 className="text-4xl font-headline font-extrabold tracking-tight text-on-surface">
                {isLogin ? "Connexion" : "Créer un compte"}
              </h1>
              <p className="mt-2 text-on-surface-variant font-medium">
                {isLogin
                  ? "Accédez à votre espace."
                  : "Réservez ou publiez des trajets."}
              </p>
            </div>

            {error && (
              <div className="mb-6 rounded-xl bg-error/10 p-4 text-sm font-bold text-error border border-error/20 flex items-center gap-2">
                <MaterialIcon name="error" className="text-lg" /> {error}
              </div>
            )}

            <div className="space-y-5">
              {!isLogin && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">
                      <RequiredFieldLabel required>Prénom</RequiredFieldLabel>
                    </label>
                    <input
                      required
                      className="w-full rounded-xl border-none bg-surface-container py-3 px-4 font-medium focus:ring-2 focus:ring-primary placeholder:text-outline-variant"
                      placeholder="Jane"
                      value={prenom}
                      onChange={(e) => setPrenom(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">
                      <RequiredFieldLabel required>Nom</RequiredFieldLabel>
                    </label>
                    <input
                      required
                      className="w-full rounded-xl border-none bg-surface-container py-3 px-4 font-medium focus:ring-2 focus:ring-primary placeholder:text-outline-variant"
                      placeholder="Doe"
                      value={nom}
                      onChange={(e) => setNom(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">
                  <RequiredFieldLabel required>Email</RequiredFieldLabel>
                </label>
                <div className="relative">
                  <MaterialIcon
                    name="email"
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant"
                  />
                  <input
                    required
                    type="email"
                    className="w-full rounded-xl border-none bg-surface-container py-3 pl-12 pr-4 font-medium focus:ring-2 focus:ring-primary placeholder:text-outline-variant"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">
                  <RequiredFieldLabel required>Mot de passe</RequiredFieldLabel>
                </label>
                <div className="relative">
                  <MaterialIcon
                    name="lock"
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant"
                  />
                  <input
                    required
                    type="password"
                    className="w-full rounded-xl border-none bg-surface-container py-3 pl-12 pr-4 font-medium focus:ring-2 focus:ring-primary placeholder:text-outline-variant"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              {!isLogin && (
                <div className="rounded-xl border border-outline-variant/60 bg-surface-container-low p-4 text-sm font-semibold text-on-surface-variant">
                  Un seul compte permet de réserver des trajets et d'en publier.
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="mt-8 w-full rounded-xl bg-primary py-4 font-headline font-extrabold text-lg text-on-primary shadow-lg shadow-primary/20 transition-all hover:bg-primary-dim active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <MaterialIcon name="refresh" className="animate-spin" />
                ) : isLogin ? (
                  "Se connecter"
                ) : (
                  "Créer le compte"
                )}
              </button>
            </div>

            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError("");
                }}
                className="text-sm font-bold text-on-surface-variant hover:text-primary transition-colors"
              >
                {isLogin
                  ? "Pas encore de compte ? Inscription"
                  : "Déjà un compte ? Connexion"}
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-outline-variant/60 text-center">
              <div className="text-xs font-medium text-on-surface-variant">
                Comptes de démonstration :
              </div>
              <div className="flex justify-center gap-4 mt-2 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => {
                    setEmail("conducteur@test.com");
                    setPassword("password");
                  }}
                  className="text-primary hover:underline"
                >
                  Utilisateur
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEmail("admin@test.com");
                    setPassword("password");
                  }}
                  className="text-primary hover:underline"
                >
                  Admin
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </PageShell>
  );
}
