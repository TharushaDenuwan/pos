"use client";

import {
  Activity,
  Banknote,
  Car,
  ChevronRight,
  RefreshCw,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

const VEHICLE_TYPES = ["all", "KDH", "CHR", "AQUA"] as const;
const MAINTENANCE_TYPES = ["KDH", "CHR", "AQUA"] as const;
type VehicleType = (typeof VEHICLE_TYPES)[number];
type MaintenanceVehicleType = (typeof MAINTENANCE_TYPES)[number];

const VEHICLE_COLORS: Record<
  MaintenanceVehicleType,
  { bg: string; border: string; text: string; glow: string; badge: string }
> = {
  KDH: {
    bg: "bg-violet-500/10",
    border: "border-violet-500/30",
    text: "text-violet-400",
    glow: "shadow-violet-500/20",
    badge: "bg-violet-500",
  },
  CHR: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    text: "text-emerald-400",
    glow: "shadow-emerald-500/20",
    badge: "bg-emerald-500",
  },
  AQUA: {
    bg: "bg-sky-500/10",
    border: "border-sky-500/30",
    text: "text-sky-400",
    glow: "shadow-sky-500/20",
    badge: "bg-sky-500",
  },
};

export default function AdminDashboardPage() {
  const [hireRecords, setHireRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [vehicleFilter, setVehicleFilter] = useState<VehicleType>("all");
  const [refreshing, setRefreshing] = useState(false);

  const fetchHires = async () => {
    setRefreshing(true);
    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
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

  useEffect(() => {
    fetchHires();
  }, []);

  const hireRecordsOnly = hireRecords.filter(
    (r) => r.hireType !== "maintenance" && r.hireType !== "oil_change",
  );
  const maintenanceRecords = hireRecords.filter(
    (r) => r.hireType === "maintenance",
  );
  const oilChangeRecords = hireRecords.filter(
    (r) => r.hireType === "oil_change",
  );

  const totalMaintenanceCost = maintenanceRecords.reduce(
    (s, r) => s + (r.maintenanceCost || 0),
    0,
  );

  const totalRevenue =
    hireRecordsOnly.reduce((s, r) => s + (r.totalCost || 0), 0) -
    totalMaintenanceCost;

  const totalHires = hireRecordsOnly.length;
  const totalDriverSalary = hireRecordsOnly.reduce(
    (s, r) => s + (r.maintenanceCost || 0),
    0,
  );

  const vehicleBreakdown = (["KDH", "CHR", "AQUA"] as const).map(
    (type) => {
      const recs = hireRecordsOnly.filter((r) => r.vehicleType === type);
      const maintRecs = maintenanceRecords.filter(
        (r) => r.vehicleType === type,
      );
      const maintTotal = maintRecs.reduce(
        (s, r) => s + (r.maintenanceCost || 0),
        0,
      );
      return {
        type,
        count: recs.length,
        total: recs.reduce((s, r) => s + (r.totalCost || 0), 0) - maintTotal,
      };
    },
  );

  const filteredRecords =
    vehicleFilter === "all"
      ? hireRecordsOnly
      : hireRecordsOnly.filter((r) => r.vehicleType === vehicleFilter);

  const filteredMaintenanceRecords =
    vehicleFilter === "all"
      ? maintenanceRecords
      : maintenanceRecords.filter((r) => r.vehicleType === vehicleFilter);

  const filteredTotal =
    filteredRecords.reduce((s, r) => s + (r.totalCost || 0), 0) -
    filteredMaintenanceRecords.reduce(
      (s, r) => s + (r.maintenanceCost || 0),
      0,
    );

  const filteredCount = filteredRecords.length;

  const maintenanceByType = (["KDH", "CHR", "AQUA"] as const).map((type) => {
    const recs = filteredMaintenanceRecords.filter(
      (r) => r.vehicleType === type,
    );
    return {
      type,
      count: recs.length,
      total: recs.reduce((sum, r) => sum + (r.maintenanceCost || 0), 0),
    };
  });

  const oilChangeByType = (["KDH", "CHR", "AQUA"] as const).map((type) => {
    const recs = oilChangeRecords.filter(
      (r) => r.vehicleType === type,
    );
    return {
      type,
      count: recs.length,
    };
  });
  const fmt = (n: number) => `Rs. ${n.toLocaleString()}`;
  const vehicleLabel = (type: string) => type;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f] p-6 lg:p-10 space-y-8">
      {/* ── PAGE HEADER ── */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 dark:text-blue-400 mb-1">
            Admin Panel
          </p>
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
          <RefreshCw
            className={`w-4 h-4 ${refreshing ? "animate-spin text-blue-500" : ""}`}
          />
          Refresh
        </button>
      </div>

      {/* ── TOP KPI CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {/* Total Revenue */}
        <div className="col-span-1 sm:col-span-2 xl:col-span-1 relative bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 overflow-hidden shadow-xl shadow-blue-500/20">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.15),transparent_60%)]" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-200">
                Total Revenue
              </span>
              <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
                <Banknote className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="text-4xl font-black text-white tracking-tight">
              {loading ? (
                <span className="opacity-40">...</span>
              ) : (
                fmt(totalRevenue)
              )}
            </div>
            <p className="text-blue-200 text-xs font-medium mt-2">
              From all vehicle hires combined
            </p>
          </div>
        </div>

        {/* Total Hires */}
        <div className="bg-white dark:bg-gray-900/60 border border-gray-100 dark:border-white/5 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400">
              Total Hires
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
              <Car className="w-5 h-5 text-emerald-500" />
            </div>
          </div>
          <div className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
            {loading ? <span className="opacity-30">...</span> : totalHires}
          </div>
          <p className="text-gray-400 text-xs font-medium mt-2">
            Vehicle hire records
          </p>
        </div>

        {/* Driver Salary */}
        <div className="bg-white dark:bg-gray-900/60 border border-gray-100 dark:border-white/5 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400">
              Driver Salary
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-amber-500" />
            </div>
          </div>
          <div className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
            {loading ? (
              <span className="opacity-30">...</span>
            ) : (
              fmt(totalDriverSalary)
            )}
          </div>
          <p className="text-gray-400 text-xs font-medium mt-2">
            Total driver salary from hire records
          </p>
        </div>

        {/* Total Maintenance Cost */}
        <div className="bg-white dark:bg-gray-900/60 border border-gray-100 dark:border-white/5 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400">
              Total Maintenance Cost
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center">
              <Activity className="w-5 h-5 text-amber-500" />
            </div>
          </div>
          <div className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
            {loading ? (
              <span className="opacity-30">...</span>
            ) : (
              fmt(totalMaintenanceCost)
            )}
          </div>
          <p className="text-gray-400 text-xs font-medium mt-2">
            Cost from maintenance-only entries
          </p>
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
              <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wide">
                Vehicle Revenue Filter
              </h2>
              <p className="text-[10px] text-gray-400 font-medium mt-0.5">
                Select a vehicle type to see breakdown
              </p>
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
                {type === "all" ? "All Vehicles" : vehicleLabel(type)}
              </button>
            ))}
          </div>

          {/* Result Display */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Big Result */}
            <div className="md:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 dark:from-blue-950 dark:to-slate-900 rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl" />
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40 mb-2">
                {vehicleFilter === "all"
                  ? "All Vehicles"
                  : `${vehicleLabel(vehicleFilter)} Only`}
              </p>
              <div className="text-3xl font-black text-white tracking-tight">
                {loading ? "..." : fmt(filteredTotal)}
              </div>
              <div className="flex items-center gap-2 mt-3">
                <span className="text-xs font-bold text-white/50">
                  {filteredCount} hire{filteredCount !== 1 ? "s" : ""}
                </span>
                {vehicleFilter !== "all" && filteredTotal > 0 && (
                  <span className="text-xs font-bold text-blue-400">
                    · {Math.round((filteredTotal / totalRevenue) * 100)}% of
                    total
                  </span>
                )}
              </div>
            </div>

            {/* Per-Vehicle Breakdown Cards */}
            <div className="md:col-span-3 grid grid-cols-3 gap-3">
              {vehicleBreakdown.map(({ type, count, total }) => {
                const c = VEHICLE_COLORS[type];
                const pct =
                  totalRevenue > 0
                    ? Math.round((total / totalRevenue) * 100)
                    : 0;
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
                      <span
                        className={`text-[9px] font-black uppercase tracking-widest ${vehicleFilter === type ? c.text : "text-gray-400"}`}
                      >
                        {vehicleLabel(type)}
                      </span>
                      <ChevronRight
                        className={`w-3 h-3 ${vehicleFilter === type ? c.text : "text-gray-300 dark:text-gray-600"}`}
                      />
                    </div>
                    <div className="text-xl font-black text-gray-900 dark:text-white">
                      {loading ? "..." : `Rs. ${(total / 1000).toFixed(0)}K`}
                    </div>
                    <div className="mt-2 space-y-1">
                      <div className="w-full h-1 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                        <svg
                          className="w-full h-full"
                          viewBox="0 0 100 100"
                          preserveAspectRatio="none"
                        >
                          <rect
                            x="0"
                            y="0"
                            width={`${pct}%`}
                            height="100"
                            rx="999"
                            className={`transition-all duration-700 ${c.badge}`}
                          />
                        </svg>
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

      {/* ── EXTRA MAINTENANCE BREAKDOWN (READ-ONLY OVERVIEW) ── */}
      <div className="bg-white dark:bg-gray-900/60 border border-gray-100 dark:border-white/5 rounded-3xl overflow-hidden shadow-sm mt-8">
        <div className="px-7 py-5 border-b border-gray-100 dark:border-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wide">
              Extra Maintenance Overview
            </h2>
            <p className="text-[10px] text-gray-400 font-medium mt-0.5">
              Summary of maintenance costs by vehicle type.
            </p>
          </div>

        </div>
        <div className="p-7 space-y-6">

          <div className="overflow-x-auto rounded-3xl border border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-gray-950">
            <table className="min-w-full text-left text-sm text-slate-800 dark:text-slate-200">
              <thead className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-white/5">
                <tr>
                  <th className="px-5 py-3 uppercase tracking-widest text-[10px] text-slate-500 dark:text-slate-400">
                    Vehicle Type
                  </th>
                  <th className="px-5 py-3 uppercase tracking-widest text-[10px] text-slate-500 dark:text-slate-400">
                    Maintenance Count
                  </th>
                  <th className="px-5 py-3 uppercase tracking-widest text-[10px] text-slate-500 dark:text-slate-400">
                    Total Cost
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {maintenanceByType.map((item) => (
                  <tr key={item.type}>
                    <td className="px-5 py-4 font-black uppercase tracking-tight text-slate-900 dark:text-white">
                      {item.type}
                    </td>
                    <td className="px-5 py-4">{item.count}</td>
                    <td className="px-5 py-4 font-black">{fmt(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── OIL CHANGE TRACKER (READ-ONLY OVERVIEW) ── */}
      <div className="bg-white dark:bg-gray-900/60 border border-gray-100 dark:border-white/5 rounded-3xl overflow-hidden shadow-sm mt-8">
        <div className="px-7 py-5 border-b border-gray-100 dark:border-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wide">
              Oil Change Tracker Overview
            </h2>
            <p className="text-[10px] text-gray-400 font-medium mt-0.5">
              View vehicle oil changes by date and mileage.
            </p>
          </div>

        </div>
        <div className="p-7 space-y-6">

          <div className="overflow-x-auto rounded-3xl border border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-gray-950">
            <table className="min-w-full text-left text-sm text-slate-800 dark:text-slate-200">
              <thead className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-white/5">
                <tr>
                  <th className="px-5 py-3 uppercase tracking-widest text-[10px] text-slate-500 dark:text-slate-400">
                    Vehicle Type
                  </th>
                  <th className="px-5 py-3 uppercase tracking-widest text-[10px] text-slate-500 dark:text-slate-400">
                    Date
                  </th>
                  <th className="px-5 py-3 uppercase tracking-widest text-[10px] text-slate-500 dark:text-slate-400">
                    Mileage (KM)
                  </th>
                  <th className="px-5 py-3 uppercase tracking-widest text-[10px] text-slate-500 dark:text-slate-400">
                    Next Change (+5000 KM)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {oilChangeRecords.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-5 py-8 text-center text-sm text-slate-500 dark:text-slate-400"
                    >
                      No oil change records found.
                    </td>
                  </tr>
                ) : (
                  oilChangeRecords.map((record) => (
                    <tr key={record.id}>
                      <td className="px-5 py-4 font-black uppercase tracking-tight text-slate-900 dark:text-white">
                        {record.vehicleType}
                      </td>
                      <td className="px-5 py-4">
                        {new Date(record.pickupDate).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-4 font-black">
                        {record.distance?.toLocaleString()} km
                      </td>
                      <td className="px-5 py-4 font-black text-amber-500">
                        {record.distance ? (record.distance + 5000).toLocaleString() : 0} km
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
}
