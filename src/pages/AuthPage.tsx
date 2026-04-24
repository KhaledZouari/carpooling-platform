import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/covoiturage";
import { MaterialIcon } from "../components/MaterialIcon";
import { useAuth } from "../context/AuthContext";
import type { RegisterRequest } from "../types/covoiturage";

export function AuthPage() {
  const navigate = useNavigate();
  const { setSession } = useAuth();
  const [tab, setTab] = useState<"login" | "register">("login");
  const [error, setError] = useState("");

  const [login, setLogin] = useState({ email: "", password: "" });
  const [register, setRegister] = useState<RegisterRequest>({
    nom: "",
    prenom: "",
    email: "",
    password: "",
    telephone: "",
    permisConduire: "",
    role: "VOYAGEUR",
  });

  const getDashboardPath = (role: string) =>
    role === "ADMIN"
      ? "/admin"
      : role === "CONDUCTEUR"
        ? "/conducteur"
        : "/voyageur";

  const submitLogin = async () => {
    setError("");
    try {
      const response = await authApi.login(login);
      setSession(response);
      navigate(getDashboardPath(response.user.role));
    } catch {
      setError("Unable to login. Check your credentials.");
    }
  };

  const submitRegister = async () => {
    setError("");
    try {
      const response = await authApi.register(register);
      setSession(response);
      navigate(getDashboardPath(response.user.role));
    } catch {
      setError("Unable to create the account.");
    }
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <main className="flex min-h-screen flex-col items-center justify-center p-6 md:p-12">
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-[0px_8px_24px_rgba(0,90,194,0.15)]">
            <MaterialIcon
              name="directions_car"
              filled
              className="text-2xl text-on-primary"
            />
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight">
            Covoiturage
          </h1>
          <p className="mt-2 text-sm font-medium tracking-wide text-on-surface-variant">
            Shared journeys, smarter logistics.
          </p>
        </div>

        <section className="w-full max-w-[440px] overflow-hidden rounded-xl bg-surface-container-lowest shadow-[0px_8px_24px_rgba(42,52,57,0.06)]">
          <div className="m-6 flex rounded-lg bg-surface-container-low p-1.5">
            <button
              type="button"
              onClick={() => setTab("login")}
              className={`flex-1 rounded-lg py-2.5 text-sm font-semibold ${tab === "login" ? "bg-surface-container-lowest text-primary shadow-sm" : "text-on-surface-variant"}`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setTab("register")}
              className={`flex-1 rounded-lg py-2.5 text-sm font-semibold ${tab === "register" ? "bg-surface-container-lowest text-primary shadow-sm" : "text-on-surface-variant"}`}
            >
              Sign Up
            </button>
          </div>

          <div className="px-6 pb-6">
            {tab === "login" ? (
              <div className="space-y-4">
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                  Email Address
                </label>
                <input
                  className="w-full border-0 border-b border-outline-variant/20 bg-transparent px-0 py-3 placeholder:text-on-surface-variant focus:ring-0"
                  placeholder="name@company.com"
                  value={login.email}
                  onChange={(event) =>
                    setLogin({ ...login, email: event.target.value })
                  }
                />
                <label className="mt-4 block text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                  Password
                </label>
                <input
                  type="password"
                  className="w-full border-0 border-b border-outline-variant/20 bg-transparent px-0 py-3 placeholder:text-on-surface-variant focus:ring-0"
                  value={login.password}
                  onChange={(event) =>
                    setLogin({ ...login, password: event.target.value })
                  }
                />
                <button
                  type="button"
                  onClick={submitLogin}
                  className="mt-6 w-full rounded-lg bg-primary py-4 font-bold text-on-primary"
                >
                  Sign in to your account
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <input
                  className="w-full border-0 border-b border-outline-variant/20 bg-transparent px-0 py-3 placeholder:text-on-surface-variant focus:ring-0"
                  placeholder="First name"
                  value={register.prenom}
                  onChange={(event) =>
                    setRegister({ ...register, prenom: event.target.value })
                  }
                />
                <input
                  className="w-full border-0 border-b border-outline-variant/20 bg-transparent px-0 py-3 placeholder:text-on-surface-variant focus:ring-0"
                  placeholder="Last name"
                  value={register.nom}
                  onChange={(event) =>
                    setRegister({ ...register, nom: event.target.value })
                  }
                />
                <input
                  className="w-full border-0 border-b border-outline-variant/20 bg-transparent px-0 py-3 placeholder:text-on-surface-variant focus:ring-0"
                  placeholder="name@company.com"
                  value={register.email}
                  onChange={(event) =>
                    setRegister({ ...register, email: event.target.value })
                  }
                />
                <input
                  type="password"
                  className="w-full border-0 border-b border-outline-variant/20 bg-transparent px-0 py-3 placeholder:text-on-surface-variant focus:ring-0"
                  placeholder="Password"
                  value={register.password}
                  onChange={(event) =>
                    setRegister({ ...register, password: event.target.value })
                  }
                />
                <select
                  className="w-full border-0 border-b border-outline-variant/20 bg-transparent px-0 py-3 focus:ring-0"
                  value={register.role}
                  onChange={(event) =>
                    setRegister({
                      ...register,
                      role: event.target.value as RegisterRequest["role"],
                    })
                  }
                >
                  <option value="VOYAGEUR">Voyageur</option>
                  <option value="CONDUCTEUR">Conducteur</option>
                </select>
                <input
                  className="w-full border-0 border-b border-outline-variant/20 bg-transparent px-0 py-3 placeholder:text-on-surface-variant focus:ring-0"
                  placeholder="Telephone"
                  value={register.telephone}
                  onChange={(event) =>
                    setRegister({ ...register, telephone: event.target.value })
                  }
                />
                {register.role === "CONDUCTEUR" ? (
                  <input
                    className="w-full border-0 border-b border-outline-variant/20 bg-transparent px-0 py-3 placeholder:text-on-surface-variant focus:ring-0"
                    placeholder="Permis de conduire"
                    value={register.permisConduire}
                    onChange={(event) =>
                      setRegister({
                        ...register,
                        permisConduire: event.target.value,
                      })
                    }
                  />
                ) : null}
                <button
                  type="button"
                  onClick={submitRegister}
                  className="mt-6 w-full rounded-lg bg-primary py-4 font-bold text-on-primary"
                >
                  Create account
                </button>
              </div>
            )}
            {error ? (
              <p className="mt-4 text-sm font-medium text-red-600">{error}</p>
            ) : null}
          </div>
        </section>
      </main>
    </div>
  );
}
