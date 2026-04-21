export function Footer() {
  return (
    <footer className="w-full border-t border-slate-200/20 bg-slate-50 py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-8 md:flex-row">
        <div className="text-sm uppercase tracking-wide text-slate-500">
          © 2024 Covoiturage Logistics. All rights reserved.
        </div>
        <div className="flex gap-8">
          <a
            href="#"
            className="text-sm uppercase tracking-wide text-slate-500 transition-colors hover:text-slate-800"
          >
            Help Center
          </a>
          <a
            href="#"
            className="text-sm uppercase tracking-wide text-slate-500 transition-colors hover:text-slate-800"
          >
            Terms of Service
          </a>
          <a
            href="#"
            className="text-sm uppercase tracking-wide text-slate-500 transition-colors hover:text-slate-800"
          >
            Privacy Policy
          </a>
          <a
            href="#"
            className="text-sm uppercase tracking-wide text-slate-500 transition-colors hover:text-slate-800"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
