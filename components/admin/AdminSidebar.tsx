"use client";

type AdminSidebarProps = {
  activeSection: "dashboard" | "leads";
  onNavigate: (section: "dashboard" | "leads") => void;
  onLogout: () => void;
};

const navItems = [
  { label: "Dashboard", section: "dashboard" as const },
  { label: "Leads", section: "leads" as const },
];

export default function AdminSidebar({
  activeSection,
  onNavigate,
  onLogout,
}: AdminSidebarProps) {
  return (
    <aside className="sticky top-8 hidden h-fit rounded-[32px] border border-white/10 bg-royal-800/80 p-6 shadow-2xl shadow-black/40 xl:block">
      <div className="mb-10">
        <p className="text-sm uppercase tracking-[0.35em] text-white/40">
          Admin panel
        </p>
        <h2 className="mt-3 text-3xl font-display text-white">Equila CRM</h2>
      </div>

      <nav className="space-y-3">
        {navItems.map((item) => {
          const active = item.section === activeSection;
          return (
            <button
              key={item.section}
              type="button"
              onClick={() => onNavigate(item.section)}
              className={`w-full rounded-3xl px-4 py-4 text-left text-sm font-semibold transition ${
                active
                  ? "bg-gold-500 text-royal-900 shadow-lg shadow-gold-500/20"
                  : "border border-white/10 bg-white/5 text-white/80 hover:bg-white/10"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="mt-10 border-t border-white/10 pt-6">
        <button
          type="button"
          onClick={onLogout}
          className="w-full rounded-3xl bg-red-500/10 px-4 py-4 text-sm font-semibold text-red-100 transition hover:bg-red-500/20"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
