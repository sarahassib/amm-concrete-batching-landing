"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Factory,
  Building2,
  Briefcase,
  Users,
  TrendingUp,
  Download,
  Calendar,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
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
  created_at: string;
}

const COLORS = ["#D92323", "#E84545", "#888888"];

export default function AdminDashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

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

  // Filter by date range
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const d = new Date(lead.created_at);
      if (dateFrom && d < new Date(dateFrom)) return false;
      if (dateTo) {
        const to = new Date(dateTo);
        to.setHours(23, 59, 59, 999);
        if (d > to) return false;
      }
      return true;
    });
  }, [leads, dateFrom, dateTo]);

  // Stats from filtered leads
  const total = filteredLeads.length;
  const achatCount = filteredLeads.filter((l) => l.type === "achat").length;
  const fournisseurCount = filteredLeads.filter((l) => l.type === "fournisseur").length;
  const emploiCount = filteredLeads.filter((l) => l.type === "emploi").length;

  // Monthly data for bar chart
  const monthlyData = (() => {
    const map: Record<string, { achat: number; fournisseur: number; emploi: number }> = {};
    filteredLeads.forEach((lead) => {
      const d = new Date(lead.created_at);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (!map[key]) map[key] = { achat: 0, fournisseur: 0, emploi: 0 };
      map[key][lead.type as "achat" | "fournisseur" | "emploi"]++;
    });
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, counts]) => ({ month, ...counts }));
  })();

  // Pie data
  const pieData = [
    { name: "Achat", value: achatCount },
    { name: "Fournisseur", value: fournisseurCount },
    { name: "Emploi", value: emploiCount },
  ];

  // Export to Excel
  function exportToExcel() {
    const data = filteredLeads.map((lead) => ({
      Date: new Date(lead.created_at).toLocaleDateString("fr-FR"),
      Nom: lead.full_name,
      Société: lead.company || "",
      Type: lead.type,
      Téléphone: lead.phone,
      Email: lead.email,
      Ville: lead.city || "",
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Leads");
    XLSX.writeFile(wb, `leads-amm-${new Date().toISOString().slice(0, 10)}.xlsx`);
  }

  const stats = [
    {
      label: "Total Leads",
      value: total,
      icon: Users,
      color: "text-white",
      bg: "bg-white/5",
    },
    {
      label: "Achat centrale",
      value: achatCount,
      icon: Factory,
      color: "text-amm-red",
      bg: "bg-amm-red/10",
    },
    {
      label: "Fournisseurs",
      value: fournisseurCount,
      icon: Building2,
      color: "text-amm-red-light",
      bg: "bg-amm-red-light/10",
    },
    {
      label: "Emploi / RH",
      value: emploiCount,
      icon: Briefcase,
      color: "text-amm-gray",
      bg: "bg-white/5",
    },
  ];

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
          <h1 className="text-2xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-500 text-sm">
            Vue d&apos;ensemble des leads et demandes AMM
          </p>
        </div>
        <button
          onClick={exportToExcel}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-amm-red hover:bg-amm-red-dark text-white text-sm font-semibold transition-colors"
        >
          <Download className="w-4 h-4" />
          Export Excel
        </button>
      </div>

      {/* Date filter */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8 p-4 rounded-xl bg-amm-black-card border border-gray-800/50"
      >
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <Calendar className="w-4 h-4" />
          Filtrer par date :
        </div>
        <div className="flex items-center gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Du</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="px-3 py-2 rounded-lg bg-amm-black border border-gray-700 text-white text-sm focus:border-amm-red outline-none"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Au</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="px-3 py-2 rounded-lg bg-amm-black border border-gray-700 text-white text-sm focus:border-amm-red outline-none"
            />
          </div>
          {(dateFrom || dateTo) && (
            <button
              onClick={() => {
                setDateFrom("");
                setDateTo("");
              }}
              className="mt-5 px-3 py-2 rounded-lg border border-gray-700 text-gray-400 hover:text-white text-sm transition-colors"
            >
              Réinitialiser
            </button>
          )}
        </div>
        <span className="sm:ml-auto text-gray-500 text-sm">
          {filteredLeads.length} résultat{filteredLeads.length > 1 ? "s" : ""}
        </span>
      </motion.div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
            className="p-5 rounded-xl bg-amm-black-card border border-gray-800/50"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-400 text-sm">{stat.label}</span>
              <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="p-6 rounded-xl bg-amm-black-card border border-gray-800/50"
        >
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-amm-red" />
            <h2 className="text-white font-semibold">Volume mensuel</h2>
          </div>
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="month" stroke="#888" fontSize={12} />
                <YAxis stroke="#888" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1A1A1A",
                    border: "1px solid #333",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Legend />
                <Bar dataKey="achat" name="Achat" fill="#D92323" radius={[4, 4, 0, 0]} />
                <Bar dataKey="fournisseur" name="Fournisseur" fill="#E84545" radius={[4, 4, 0, 0]} />
                <Bar dataKey="emploi" name="Emploi" fill="#888888" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-600 text-sm">
              Aucune donnée pour cette période
            </div>
          )}
        </motion.div>

        {/* Pie chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="p-6 rounded-xl bg-amm-black-card border border-gray-800/50"
        >
          <div className="flex items-center gap-2 mb-6">
            <Users className="w-5 h-5 text-amm-red" />
            <h2 className="text-white font-semibold">Répartition</h2>
          </div>
          {total > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend
                  formatter={(value: string) => (
                    <span className="text-gray-300 text-sm">{value}</span>
                  )}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1A1A1A",
                    border: "1px solid #333",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-600 text-sm">
              Aucune donnée pour cette période
            </div>
          )}
        </motion.div>
      </div>

      {/* Recent leads */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mt-6 p-6 rounded-xl bg-amm-black-card border border-gray-800/50"
      >
        <h2 className="text-white font-semibold mb-4">Derniers leads</h2>
        {filteredLeads.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Date</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Nom</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Société</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Type</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Email</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.slice(0, 10).map((lead) => (
                  <tr
                    key={lead.id}
                    className="border-b border-gray-800/50 hover:bg-white/[0.02]"
                  >
                    <td className="py-3 px-4 text-gray-400">
                      {new Date(lead.created_at).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="py-3 px-4 text-white">{lead.full_name}</td>
                    <td className="py-3 px-4 text-gray-400">{lead.company || "—"}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-md text-xs font-medium ${
                          lead.type === "achat"
                            ? "bg-amm-red/10 text-amm-red"
                            : lead.type === "fournisseur"
                            ? "bg-amm-red-light/10 text-amm-red-light"
                            : "bg-white/5 text-amm-gray"
                        }`}
                      >
                        {lead.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-400">{lead.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600 text-sm text-center py-8">
            Aucun lead pour la période sélectionnée
          </p>
        )}
      </motion.div>
    </div>
  );
}
