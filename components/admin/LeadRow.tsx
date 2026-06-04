import type { Lead } from "@/lib/api";
import { Edit3, Trash2 } from "lucide-react";

type LeadRowProps = {
  lead: Lead;
  onEdit: (lead: Lead) => void;
  onDelete: (id: string) => void;
};

export default function LeadRow({ lead, onEdit, onDelete }: LeadRowProps) {
  return (
    <tr className="border-t border-white/10 hover:bg-white/5 transition-colors">
      <td className="px-4 py-4 text-sm text-white/80 font-body whitespace-nowrap">
        {lead.name || "—"}
      </td>
      <td className="px-4 py-4 text-sm text-white/70 font-body whitespace-nowrap">
        {lead.phone || "—"}
      </td>
      <td className="px-4 py-4 text-sm text-white/70 font-body whitespace-nowrap break-words max-w-[180px]">
        {lead.email || "—"}
      </td>
      <td className="px-4 py-4 text-sm text-white/70 font-body whitespace-nowrap">
        {lead.destination || "—"}
      </td>
      <td className="px-4 py-4 text-sm text-white/70 font-body whitespace-nowrap">
        {lead.pickup || "—"}
      </td>
      <td className="px-4 py-4 text-sm text-white/70 font-body whitespace-nowrap">
        {lead.service || "—"}
      </td>
      <td className="px-4 py-4 text-sm text-white/70 font-body whitespace-nowrap">
        {lead.date || lead.timestamp || "—"}
      </td>
      <td className="px-4 py-4 text-sm text-white/70 font-body max-w-[200px] break-words">
        {lead.message || "—"}
      </td>
      <td className="px-4 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(lead)}
            className="flex items-center gap-1 rounded-lg border border-gold-500/30 px-3 py-1.5 text-xs text-gold-400 transition hover:bg-gold-500/10"
          >
            <Edit3 size={12} />
            Edit
          </button>
          <button
            onClick={() => onDelete(lead.id)}
            className="flex items-center gap-1 rounded-lg border border-red-500/30 px-3 py-1.5 text-xs text-red-400 transition hover:bg-red-500/10"
          >
            <Trash2 size={12} />
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}
