import type { ReactNode } from "react";
import { Footer } from "./Footer";
import { TopNav } from "./TopNav";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <TopNav />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
