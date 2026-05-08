import type { ReactNode } from "react";
import { Footer } from "./Footer";
import { TopNav } from "./TopNav";

export function PageShell({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface text-on-surface selection:bg-primary selection:text-on-primary flex flex-col transition-colors duration-200">
      <TopNav />
      <main className="flex-1 flex flex-col">{children}</main>
      <Footer />
    </div>
  );
}
