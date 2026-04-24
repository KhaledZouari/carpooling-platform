import type { ReactNode } from "react";
import { Footer } from "./Footer";
import { TopNav } from "./TopNav";
import { getRoleTheme, type AppRole } from "./roleTheme.ts";

export function PageShell({
  children,
  role = "public",
}: {
  children: ReactNode;
  role?: AppRole;
}) {
  const theme = getRoleTheme(role);

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <div className={`h-1 w-full border-t-4 ${theme.border}`} />
      <TopNav role={role} />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
