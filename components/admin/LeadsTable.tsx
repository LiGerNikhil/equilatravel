import type { Lead } from "@/lib/api";
import LeadRow from "@/components/admin/LeadRow";

type LeadsTableProps = {
  leads: Lead[];
  onEdit: (lead: Lead) => void;
  onDelete: (id: string) => void;
};

export default function LeadsTable({ leads, onEdit, onDelete }: LeadsTableProps) {
  return (
    <div>
      {/* Desktop / tablet: table view */}
      <div className="hidden md:block overflow-x-auto rounded-3xl border border-white/10 bg-white/5 shadow-xl shadow-black/20">
        <table className="min-w-full border-separate border-spacing-0">
          <thead>
            <tr className="bg-white/5 text-left text-[11px] uppercase tracking-[0.25em] text-white/50">
              <th className="px-4 py-4">Name</th>
              <th className="px-4 py-4">Phone</th>
              <th className="px-4 py-4">Email</th>
              <th className="px-4 py-4">Destination</th>
              <th className="px-4 py-4">Pickup</th>
              <th className="px-4 py-4">Service</th>
              <th className="px-4 py-4">Date</th>
              <th className="px-4 py-4">Message</th>
              <th className="px-4 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="px-4 py-12 text-center text-sm text-white/50"
                >
                  No leads available yet.
                </td>
              </tr>
            ) : (
              leads.map((lead) => (
                <LeadRow
                  key={lead.id}
                  lead={lead}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile: stacked cards */}
      <div className="md:hidden space-y-4">
        {leads.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center text-sm text-white/50">
            No leads available yet.
          </div>
        ) : (
          leads.map((lead) => (
            <div
              key={lead.id}
              className="rounded-2xl border border-white/10 bg-white/5 p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-white">
                    {lead.name || "—"}
                  </p>
                  <p className="text-xs text-white/60">{lead.email || "—"}</p>
                </div>
                <div className="text-right text-xs text-white/60">
                  <div>{lead.phone || "—"}</div>
                  <div>{lead.date || lead.timestamp || "—"}</div>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-white/70">
                <div>
                  <div className="text-[10px] text-white/40 uppercase">Destination</div>
                  <div className="mt-1">{lead.destination || "—"}</div>
                </div>
                <div>
                  <div className="text-[10px] text-white/40 uppercase">Pickup</div>
                  <div className="mt-1">{lead.pickup || "—"}</div>
                </div>
                <div>
                  <div className="text-[10px] text-white/40 uppercase">Service</div>
                  <div className="mt-1">{lead.service || "—"}</div>
                </div>
                <div>
                  <div className="text-[10px] text-white/40 uppercase">Message</div>
                  <div className="mt-1">{lead.message || "—"}</div>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={() => onEdit(lead)}
                  className="flex items-center gap-1 rounded-lg border border-gold-500/30 px-3 py-1.5 text-xs text-gold-400 transition hover:bg-gold-500/10"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(lead.id)}
                  className="flex items-center gap-1 rounded-lg border border-red-500/30 px-3 py-1.5 text-xs text-red-400 transition hover:bg-red-500/10"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
