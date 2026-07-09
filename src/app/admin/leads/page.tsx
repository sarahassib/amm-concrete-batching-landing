"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Eye, X, Download, Calendar } from "lucide-react";
import * as XLSX from "xlsx";

/* =====================================================
   Lead type from Supabase
   ===================================================== */
interface Lead {
  id: string;
  type: string;
  full_name: string;
  company: string | null;
  phone: string;
  email: string;
  city: string | null;
  plant_type: string | null;
  request_type: string | null;
  project_stage: string | null;
  product_service: string | null;
  position: string | null;
  experience: string | null;
  message: string | null;
  confirmation: string | null;
  created_at: string;
}

const typeLabels: Record<string, string> = {
  achat: "Achat",
  fournisseur: "Fournisseur",
  emploi: "Emploi",
};

const typeBadge: Record<string, string> = {
  achat: "bg-amm-red/10 text-amm-red",
  fournisseur: "bg-amm-red-light/10 text-amm-red-light",
  emploi: "bg-white/5 text-amm-gray",
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  useEffect(() => {
    async function fetchLeads() {
      try {
        const res = await fetch("/api/leads");
        const data = await res.json();
        setLeads(data.leads || []);
      } catch (err) {
        console.error("Failed to fetch leads:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchLeads();
  }, []);

  // Filter leads by date + type + search
  const filtered = useMemo(() => {
    return leads.filter((lead) => {
      // Type filter
      if (filter !== "all" && lead.type !== filter) return false;

      // Date filter
      const d = new Date(lead.created_at);
      if (dateFrom && d < new Date(dateFrom)) return false;
      if (dateTo) {
        const to = new Date(dateTo);
        to.setHours(23, 59, 59, 999);
        if (d > to) return false;
      }

      // Search filter
      if (search) {
        const q = search.toLowerCase();
        return (
          lead.full_name.toLowerCase().includes(q) ||
          (lead.company && lead.company.toLowerCase().includes(q)) ||
          lead.email.toLowerCase().includes(q) ||
          lead.phone.includes(q)
        );
      }
      return true;
    });
  }, [leads, filter, search, dateFrom, dateTo]);

  // Count per type (for current date filter, before type filter)
  const dateFiltered = useMemo(() => {
    return leads.filter((lead) => {
      const d = new Date(lead.created_at);
      if (dateFrom && d < new Date(dateFrom)) return false;
      if (dateTo) {
        const to = new Date(dateTo);
        to.setHours(23, 59, 59, 999);
        if (d > to) return false;
      }
      if (search) {
        const q = search.toLowerCase();
        return (
          lead.full_name.toLowerCase().includes(q) ||
          (lead.company && lead.company.toLowerCase().includes(q)) ||
          lead.email.toLowerCase().includes(q) ||
          lead.phone.includes(q)
        );
      }
      return true;
    });
  }, [leads, dateFrom, dateTo, search]);

  const countByType = {
    all: dateFiltered.length,
    achat: dateFiltered.filter((l) => l.type === "achat").length,
    fournisseur: dateFiltered.filter((l) => l.type === "fournisseur").length,
    emploi: dateFiltered.filter((l) => l.type === "emploi").length,
  };

  // Export to Excel
  function exportToExcel() {
    const data = filtered.map((lead) => ({
      Date: new Date(lead.created_at).toLocaleDateString("fr-FR"),
      Nom: lead.full_name,
      Société: lead.company || "",
      Type: typeLabels[lead.type] || lead.type,
      Téléphone: lead.phone,
      Email: lead.email,
      Ville: lead.city || "",
      "Type centrale": lead.plant_type || "",
      "Type demande": lead.request_type || "",
      Avancement: lead.project_stage || "",
      "Produit/Service": lead.product_service || "",
      Poste: lead.position || "",
      Expérience: lead.experience || "",
      Message: lead.message || "",
      Confirmation: lead.confirmation || "",
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Leads");
    XLSX.writeFile(wb, `leads-amm-${new Date().toISOString().slice(0, 10)}.xlsx`);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Chargement...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Leads</h1>
          <p className="text-gray-500 text-sm">
            {filtered.length} résultat{filtered.length > 1 ? "s" : ""} affiché{filtered.length > 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={exportToExcel}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-amm-red hover:bg-amm-red-dark text-white text-sm font-semibold transition-colors"
        >
          <Download className="w-4 h-4" />
          Export Excel ({filtered.length})
        </button>
      </div>

      {/* Search + Date filter */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom, société, email, téléphone..."
            className="w-full pl-11 pr-4 py-2.5 rounded-lg bg-amm-black-card border border-gray-800/50 text-white placeholder-gray-500 focus:border-amm-red focus:ring-1 focus:ring-amm-red outline-none transition-colors text-sm"
          />
        </div>

        {/* Date range */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <Calendar className="w-4 h-4" />
            Période :
          </div>
          <div className="flex items-center gap-3">
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="px-3 py-2 rounded-lg bg-amm-black-card border border-gray-800/50 text-white text-sm focus:border-amm-red outline-none"
            />
            <span className="text-gray-500">→</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="px-3 py-2 rounded-lg bg-amm-black-card border border-gray-800/50 text-white text-sm focus:border-amm-red outline-none"
            />
            {(dateFrom || dateTo) && (
              <button
                onClick={() => {
                  setDateFrom("");
                  setDateTo("");
                }}
                className="px-3 py-2 rounded-lg border border-gray-700 text-gray-400 hover:text-white text-sm transition-colors"
              >
                Effacer
              </button>
            )}
          </div>
        </div>

        {/* Type filter with counts */}
        <div className="flex flex-wrap gap-2">
          {(
            [
              { value: "all", label: "Tous" },
              { value: "achat", label: "Achat" },
              { value: "fournisseur", label: "Fournisseur" },
              { value: "emploi", label: "Emploi" },
            ] as const
          ).map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                filter === opt.value
                  ? "bg-amm-red text-white"
                  : "bg-amm-black-card border border-gray-800/50 text-gray-400 hover:text-white"
              }`}
            >
              {opt.label}
              <span
                className={`px-1.5 py-0.5 rounded text-xs ${
                  filter === opt.value
                    ? "bg-white/20 text-white"
                    : "bg-white/5 text-gray-500"
                }`}
              >
                {countByType[opt.value]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl bg-amm-black-card border border-gray-800/50 overflow-hidden"
      >
        {filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Date</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Nom</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Société</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Type</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Téléphone</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Email</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Ville</th>
                  <th className="text-right py-3 px-4 text-gray-500 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((lead) => (
                  <tr
                    key={lead.id}
                    className="border-b border-gray-800/50 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="py-3 px-4 text-gray-400 whitespace-nowrap">
                      {new Date(lead.created_at).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="py-3 px-4 text-white font-medium">
                      {lead.full_name}
                    </td>
                    <td className="py-3 px-4 text-gray-400">{lead.company || "—"}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-md text-xs font-medium ${typeBadge[lead.type] || ""}`}
                      >
                        {typeLabels[lead.type] || lead.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-400">{lead.phone}</td>
                    <td className="py-3 px-4 text-gray-400">{lead.email}</td>
                    <td className="py-3 px-4 text-gray-400">{lead.city || "—"}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedLead(lead)}
                        className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-600 text-sm">
            Aucun lead trouvé
          </div>
        )}
      </motion.div>

      {/* Lead detail modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setSelectedLead(null)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-lg max-h-[80vh] overflow-y-auto rounded-2xl bg-amm-black-card border border-gray-800/50 p-6"
          >
            <button
              onClick={() => setSelectedLead(null)}
              className="absolute top-4 right-4 p-1 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <span
                className={`inline-block px-3 py-1 rounded-md text-xs font-medium ${typeBadge[selectedLead.type]}`}
              >
                {typeLabels[selectedLead.type]}
              </span>
              <h2 className="text-xl font-bold text-white mt-3">
                {selectedLead.full_name}
              </h2>
              {selectedLead.company && (
                <p className="text-gray-400 text-sm">{selectedLead.company}</p>
              )}
            </div>

            <div className="space-y-4 text-sm">
              <Row label="Email" value={selectedLead.email} />
              <Row label="Téléphone" value={selectedLead.phone} />
              <Row label="Ville" value={selectedLead.city} />

              {selectedLead.type === "achat" && (
                <>
                  <Row label="Type de centrale" value={selectedLead.plant_type} />
                  <Row label="Type de demande" value={selectedLead.request_type} />
                  <Row label="Avancement projet" value={selectedLead.project_stage} />
                  <Row label="Confirmation" value={selectedLead.confirmation} />
                </>
              )}

              {selectedLead.type === "fournisseur" && (
                <Row label="Produit/Service" value={selectedLead.product_service} />
              )}

              {selectedLead.type === "emploi" && (
                <>
                  <Row label="Poste souhaité" value={selectedLead.position} />
                  <Row label="Expérience" value={selectedLead.experience} />
                </>
              )}

              {selectedLead.message && (
                <div>
                  <span className="text-gray-500 block mb-1">Message</span>
                  <p className="text-gray-300 bg-amm-black p-3 rounded-lg">
                    {selectedLead.message}
                  </p>
                </div>
              )}

              <Row
                label="Date"
                value={new Date(selectedLead.created_at).toLocaleString("fr-FR")}
              />
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div className="flex justify-between py-2 border-b border-gray-800/50">
      <span className="text-gray-500">{label}</span>
      <span className="text-gray-200 text-right">{value}</span>
    </div>
  );
}
