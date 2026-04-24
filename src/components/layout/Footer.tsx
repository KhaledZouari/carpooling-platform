export function Footer() {
  return (
    <footer className="w-full border-t-2 border-outline bg-on-surface py-8 text-surface">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 px-4 sm:px-6 md:flex-row md:items-center">
        <div className="font-mono text-xs font-bold uppercase">
          © 2026 Covoiturage. Réseau de places partagées.
        </div>
        <div className="flex flex-wrap gap-4 font-mono text-xs font-bold uppercase">
          {["Aide", "Conditions", "Confidentialité", "Contact"].map((item) => (
            <a
              key={item}
              href="#"
              className="border-b-2 border-transparent transition-colors hover:border-primary hover:text-primary"
            >
              {item}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
