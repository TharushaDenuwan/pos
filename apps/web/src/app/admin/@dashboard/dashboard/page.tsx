"use client";

import { useEffect, useState } from "react";
import { Car, TrendingUp, Banknote, Activity, RefreshCw, ChevronRight } from "lucide-react";

const VEHICLE_TYPES = ["all", "KDH", "CHR", "AQUA"] as const;
type VehicleType = typeof VEHICLE_TYPES[number];

const VEHICLE_COLORS: Record<string, { bg: string; border: string; text: string; glow: string; badge: string }> = {
  KDH:  { bg: "bg-violet-500/10",  border: "border-violet-500/30",  text: "text-violet-400",  glow: "shadow-violet-500/20",  badge: "bg-violet-500" },
  CHR:  { bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-400", glow: "shadow-emerald-500/20", badge: "bg-emerald-500" },
  AQUA: { bg: "bg-sky-500/10",     border: "border-sky-500/30",     text: "text-sky-400",     glow: "shadow-sky-500/20",     badge: "bg-sky-500" },
};

export default function AdminDashboardPage() {
  const [hireRecords, setHireRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [vehicleFilter, setVehicleFilter] = useState<VehicleType>("all");
  const [refreshing, setRefreshing] = useState(false);

  const fetchHires = async () => {
    setRefreshing(true);
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
      const res = await fetch(`${backendUrl}/api/hire-management?limit=1000`);
      if (res.ok) {
        const json = await res.json();
        setHireRecords(json.data || []);
      }
    } catch (e) {
      console.error("Failed to fetch hire records", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchHires(); }, []);

  const totalRevenue = hireRecords.reduce((s, r) => s + (r.totalCost || 0), 0);
  const totalHires = hireRecords.length;

  const vehicleBreakdown = (["KDH", "CHR", "AQUA"] as const).map((type) => {
    const recs = hireRecords.filter((r) => r.vehicleType === type);
    return { type, count: recs.length, total: recs.reduce((s, r) => s + (r.totalCost || 0), 0) };
  });

  const filteredRecords = vehicleFilter === "all" ? hireRecords : hireRecords.filter((r) => r.vehicleType === vehicleFilter);
  const filteredTotal = filteredRecords.reduce((s, r) => s + (r.totalCost || 0), 0);
  const filteredCount = filteredRecords.length;

  const fmt = (n: number) => `Rs. ${n.toLocaleString()}`;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f] p-6 lg:p-10 space-y-8">

      {/* ── PAGE HEADER ── */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 dark:text-blue-400 mb-1">Admin Panel</p>
          <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-gray-900 dark:text-white">
            Business Dashboard
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">
            Real-time overview of your hire operations.
          </p>
        </div>
        <button
          onClick={fetchHires}
          className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/10 shadow-sm transition-all active:scale-95"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin text-blue-500" : ""}`} />
          Refresh
        </button>
      </div>

      {/* ── TOP KPI CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Total Revenue */}
        <div className="col-span-1 sm:col-span-2 lg:col-span-1 relative bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 overflow-hidden shadow-xl shadow-blue-500/20">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.15),transparent_60%)]" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-200">Total Revenue</span>
              <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
                <Banknote className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="text-4xl font-black text-white tracking-tight">
              {loading ? <span className="opacity-40">...</span> : fmt(totalRevenue)}
            </div>
            <p className="text-blue-200 text-xs font-medium mt-2">From all vehicle hires combined</p>
          </div>
        </div>

        {/* Total Hires */}
        <div className="bg-white dark:bg-gray-900/60 border border-gray-100 dark:border-white/5 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400">Total Hires</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
              <Car className="w-5 h-5 text-emerald-500" />
            </div>
          </div>
          <div className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
            {loading ? <span className="opacity-30">...</span> : totalHires}
          </div>
          <p className="text-gray-400 text-xs font-medium mt-2">Vehicle hire records</p>
        </div>

        {/* Active Rate */}
        <div className="bg-white dark:bg-gray-900/60 border border-gray-100 dark:border-white/5 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400">Avg. Per Hire</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-amber-500" />
            </div>
          </div>
          <div className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
            {loading ? <span className="opacity-30">...</span> : totalHires > 0 ? fmt(Math.round(totalRevenue / totalHires)) : "Rs. 0"}
          </div>
          <p className="text-gray-400 text-xs font-medium mt-2">Average revenue per hire</p>
        </div>
      </div>

      {/* ── VEHICLE TYPE FILTER ── */}
      <div className="bg-white dark:bg-gray-900/60 border border-gray-100 dark:border-white/5 rounded-3xl overflow-hidden shadow-sm">
        {/* Section Header */}
        <div className="px-7 py-5 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
              <Activity className="w-4 h-4 text-blue-500" />
            </div>
            <div>
              <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wide">Vehicle Revenue Filter</h2>
              <p className="text-[10px] text-gray-400 font-medium mt-0.5">Select a vehicle type to see breakdown</p>
            </div>
          </div>
        </div>

        <div className="p-7 space-y-6">
          {/* Filter Toggle Buttons */}
          <div className="flex flex-wrap gap-2">
            {VEHICLE_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => setVehicleFilter(type)}
                className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 ${
                  vehicleFilter === type
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
                    : "bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10"
                }`}
              >
                {type === "all" ? "All Vehicles" : type}
              </button>
            ))}
          </div>

          {/* Result Display */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Big Result */}
            <div className="md:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 dark:from-blue-950 dark:to-slate-900 rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl" />
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40 mb-2">
                {vehicleFilter === "all" ? "All Vehicles" : `${vehicleFilter} Only`}
              </p>
              <div className="text-3xl font-black text-white tracking-tight">
                {loading ? "..." : fmt(filteredTotal)}
              </div>
              <div className="flex items-center gap-2 mt-3">
                <span className="text-xs font-bold text-white/50">{filteredCount} hire{filteredCount !== 1 ? "s" : ""}</span>
                {vehicleFilter !== "all" && filteredTotal > 0 && (
                  <span className="text-xs font-bold text-blue-400">
                    · {Math.round((filteredTotal / totalRevenue) * 100)}% of total
                  </span>
                )}
              </div>
            </div>

            {/* Per-Vehicle Breakdown Cards */}
            <div className="md:col-span-3 grid grid-cols-3 gap-3">
              {vehicleBreakdown.map(({ type, count, total }) => {
                const c = VEHICLE_COLORS[type];
                const pct = totalRevenue > 0 ? Math.round((total / totalRevenue) * 100) : 0;
                return (
                  <button
                    key={type}
                    onClick={() => setVehicleFilter(type as VehicleType)}
                    className={`flex flex-col p-4 rounded-2xl border-2 transition-all hover:scale-[1.03] active:scale-95 text-left ${
                      vehicleFilter === type
                        ? `${c.bg} ${c.border} shadow-lg ${c.glow}`
                        : "border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 hover:border-gray-200 dark:hover:border-white/10"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-[9px] font-black uppercase tracking-widest ${vehicleFilter === type ? c.text : "text-gray-400"}`}>{type}</span>
                      <ChevronRight className={`w-3 h-3 ${vehicleFilter === type ? c.text : "text-gray-300 dark:text-gray-600"}`} />
                    </div>
                    <div className="text-xl font-black text-gray-900 dark:text-white">
                      {loading ? "..." : `Rs. ${(total / 1000).toFixed(0)}K`}
                    </div>
                    <div className="mt-2 space-y-1">
                      <div className="w-full h-1 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${c.badge}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[9px] font-bold text-gray-400">
                        <span>{count} hires</span>
                        <span>{pct}%</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── RECENT ACTIVITY FEED ── */}
      <div className="bg-white dark:bg-gray-900/60 border border-gray-100 dark:border-white/5 rounded-3xl overflow-hidden shadow-sm">
        <div className="px-7 py-5 border-b border-gray-100 dark:border-white/5">
          <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wide">System Feed</h2>
          <p className="text-[10px] text-gray-400 font-medium mt-0.5">Live operational updates</p>
        </div>
        <div className="p-7">
          <div className="space-y-4">
            {[
              { label: "Dashboard synced successfully", tag: "SYSTEM", time: "Just now", dot: "bg-blue-500" },
              { label: `${totalHires} active hire records in system`, tag: "HIRE", time: "2m ago", dot: "bg-emerald-500" },
              { label: `Total revenue tracked at ${fmt(totalRevenue)}`, tag: "FINANCE", time: "14m ago", dot: "bg-amber-500" },
              { label: "Maintenance check pending for 3 vehicles", tag: "ALERT", time: "3h ago", dot: "bg-rose-500" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 py-3 border-b border-gray-50 dark:border-white/5 last:border-0">
                <div className={`w-2 h-2 rounded-full shrink-0 ${item.dot} shadow-lg`} />
                <p className="flex-1 text-sm font-medium text-gray-700 dark:text-gray-300">{item.label}</p>
                <span className="text-[9px] font-black uppercase tracking-widest text-gray-300 dark:text-gray-600 px-2 py-1 bg-gray-50 dark:bg-white/5 rounded-lg">
                  {item.tag}
                </span>
                <span className="text-[10px] text-gray-300 dark:text-gray-600 font-medium shrink-0">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
