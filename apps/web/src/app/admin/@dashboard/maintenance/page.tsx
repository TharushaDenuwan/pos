"use client";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  Activity,
  Pencil,
  Trash2,
  X,
  RefreshCw,
  Download,
} from "lucide-react";
import { FormEvent, useEffect, useState } from "react";

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

export default function MaintenancePage() {
  const [hireRecords, setHireRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [vehicleFilter, setVehicleFilter] = useState<VehicleType>("all");

  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [maintenanceVehicleType, setMaintenanceVehicleType] =
    useState<MaintenanceVehicleType>("KDH");
  const [maintenanceReason, setMaintenanceReason] = useState("");
  const [maintenanceCost, setMaintenanceCost] = useState(0);
  const [maintenanceSubmitting, setMaintenanceSubmitting] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState<string | null>(
    null,
  );

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

  const filteredRecords =
    vehicleFilter === "all"
      ? hireRecordsOnly
      : hireRecordsOnly.filter((r) => r.vehicleType === vehicleFilter);

  const filteredMaintenanceRecords =
    vehicleFilter === "all"
      ? maintenanceRecords
      : maintenanceRecords.filter((r) => r.vehicleType === vehicleFilter);

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

  const fmt = (n: number) => `Rs. ${n.toLocaleString()}`;
  const vehicleLabel = (type: string) => type;

  const handleMaintenanceSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!maintenanceReason.trim() || maintenanceCost <= 0) {
      setMaintenanceMessage("Please enter a reason and a positive cost.");
      return;
    }

    setMaintenanceSubmitting(true);
    setMaintenanceMessage(null);

    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
      const response = await fetch(`${backendUrl}/api/hire-management`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pickupDate: new Date().toISOString(),
          returnDate: new Date().toISOString(),
          phoneNumber: "N/A",
          customerName: "Maintenance Entry",
          vehicleType: maintenanceVehicleType,
          description: maintenanceReason,
          hireType: "maintenance",
          distance: 0,
          pricePerKm: 0,
          isWithDriver: "no",
          maintenanceCost,
          fuelCost: 0,
          costPerDay: 0,
          totalCost: 0,
          status: "maintenance",
        }),
      });

      if (response.ok) {
        setShowMaintenanceModal(false);
        setMaintenanceReason("");
        setMaintenanceCost(0);
        await fetchHires();
      } else {
        const errorResponse = await response.json().catch(() => null);
        setMaintenanceMessage(
          `Unable to save maintenance entry. ${errorResponse?.message || "Please try again."}`,
        );
      }
    } catch (error) {
      console.error(error);
      setMaintenanceMessage("Network error while saving maintenance entry.");
    } finally {
      setMaintenanceSubmitting(false);
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(22);
    doc.setTextColor(245, 158, 11); // Amber-500
    doc.text("Nimesh Business Management", 14, 20);

    doc.setFontSize(16);
    doc.setTextColor(100);
    doc.text("Vehicle Maintenance Report", 14, 30);

    doc.setFontSize(10);
    doc.text(`Generated On: ${new Date().toLocaleString()}`, 14, 38);

    const tableData = maintenanceRecords.map((r) => [
      new Date(r.pickupDate).toLocaleDateString(),
      r.vehicleType,
      r.description || "N/A",
      `Rs. ${r.maintenanceCost?.toLocaleString() || 0}`,
    ]);

    autoTable(doc, {
      startY: 45,
      head: [
        [
          "Date",
          "Vehicle Type",
          "Description",
          "Cost",
        ],
      ],
      body: tableData,
      theme: "grid",
      headStyles: {
        fillColor: [245, 158, 11],
        textColor: 255,
        fontStyle: "bold",
      },
      styles: { fontSize: 9 },
      alternateRowStyles: { fillColor: [255, 251, 235] },
    });

    const total = maintenanceRecords.reduce(
      (sum, r) => sum + (r.maintenanceCost || 0),
      0,
    );

    const finalY = (doc as any).lastAutoTable?.finalY || 45;
    doc.setFontSize(12);
    doc.setTextColor(245, 158, 11);
    doc.text(
      `Total Maintenance Cost: Rs. ${total.toLocaleString()}`,
      14,
      finalY + 10,
    );

    doc.save("Maintenance_Report.pdf");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f] p-6 lg:p-10 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 dark:text-blue-400 mb-1">
            Admin Panel
          </p>
          <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-gray-900 dark:text-white">
            Vehicle Maintenance
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">
            Manage extra maintenance records.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 border border-amber-600 rounded-xl text-xs font-bold text-white shadow-sm transition-all active:scale-95"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </button>
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
      </div>

      {/* ── EXTRA MAINTENANCE BREAKDOWN ── */}
      <div className="bg-white dark:bg-gray-900/60 border border-gray-100 dark:border-white/5 rounded-3xl overflow-hidden shadow-sm">
        <div className="px-7 py-5 border-b border-gray-100 dark:border-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wide">
              Extra Maintenance Breakdown
            </h2>
            <p className="text-[10px] text-gray-400 font-medium mt-0.5">
              A deeper view into maintenance costs by vehicle type.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setShowMaintenanceModal(true);
                setMaintenanceMessage(null);
              }}
              className="inline-flex items-center justify-center rounded-full bg-amber-500 px-4 py-2 text-[11px] font-black uppercase tracking-[0.25em] text-white shadow-lg shadow-amber-500/20 transition hover:bg-amber-600"
            >
              Add Maintenance
            </button>
          </div>
        </div>
        <div className="p-7 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {maintenanceByType.map((item) => (
              <div
                key={item.type}
                className="rounded-3xl border border-gray-100 dark:border-white/5 bg-slate-50 dark:bg-slate-950 p-5"
              >
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
                  {item.type}
                </p>
                <p className="mt-3 text-2xl font-black text-slate-900 dark:text-white">
                  {item.count}
                </p>
                <p className="text-xs text-slate-400 mt-2">
                  maintenance records
                </p>
                <p className="mt-4 text-sm font-black text-amber-600 dark:text-amber-400">
                  {fmt(item.total)}
                </p>
                <p className="text-xs text-slate-400">maintenance cost</p>
              </div>
            ))}
          </div>

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

      {showMaintenanceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-[32px] border border-white/10 bg-white dark:bg-gray-950 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100 dark:border-white/5">
              <div>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white">
                  Add Maintenance Entry
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Enter vehicle type, reason, and cost for a maintenance log.
                </p>
              </div>
              <button
                onClick={() => setShowMaintenanceModal(false)}
                title="Close modal"
                className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form
              onSubmit={handleMaintenanceSubmit}
              className="p-8 space-y-6 text-gray-900 dark:text-white"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label
                    htmlFor="maintenanceVehicleType"
                    className="block text-xs font-black uppercase tracking-[0.3em] text-gray-500 dark:text-gray-400"
                  >
                    Vehicle Type
                  </label>
                  <select
                    id="maintenanceVehicleType"
                    value={maintenanceVehicleType}
                    onChange={(e) =>
                      setMaintenanceVehicleType(
                        e.target.value as MaintenanceVehicleType,
                      )
                    }
                    className="w-full rounded-3xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-gray-900 px-4 py-3 text-sm font-bold text-gray-900 dark:text-white outline-none transition"
                  >
                    {MAINTENANCE_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {vehicleLabel(type)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-3">
                  <label
                    htmlFor="maintenanceCost"
                    className="block text-xs font-black uppercase tracking-[0.3em] text-gray-500 dark:text-gray-400"
                  >
                    Maintenance Cost
                  </label>
                  <input
                    id="maintenanceCost"
                    type="number"
                    min={0}
                    step={1}
                    value={maintenanceCost}
                    onChange={(e) => setMaintenanceCost(Number(e.target.value))}
                    className="w-full rounded-3xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-gray-900 px-4 py-3 text-sm font-bold text-gray-900 dark:text-white outline-none transition"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label
                  htmlFor="maintenanceReason"
                  className="block text-xs font-black uppercase tracking-[0.3em] text-gray-500 dark:text-gray-400"
                >
                  Reason / Description
                </label>
                <textarea
                  id="maintenanceReason"
                  value={maintenanceReason}
                  onChange={(e) => setMaintenanceReason(e.target.value)}
                  rows={4}
                  className="w-full rounded-3xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-gray-900 px-4 py-3 text-sm font-bold text-gray-900 dark:text-white outline-none transition resize-none"
                />
              </div>
              <div className="rounded-3xl border border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-gray-900/80 p-4">
                <p className="text-xs uppercase tracking-[0.3em] font-black text-gray-500 dark:text-gray-400">
                  Current Maintenance Summary
                </p>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                  <div className="rounded-3xl bg-white dark:bg-gray-950 p-4 border border-gray-100 dark:border-white/5">
                    <p className="text-2xl font-black text-gray-900 dark:text-white">
                      {filteredMaintenanceRecords.length}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-xs">
                      Filtered records
                    </p>
                  </div>
                  <div className="rounded-3xl bg-white dark:bg-gray-950 p-4 border border-gray-100 dark:border-white/5">
                    <p className="text-2xl font-black text-gray-900 dark:text-white">
                      {fmt(
                        filteredMaintenanceRecords.reduce(
                          (sum, r) => sum + (r.maintenanceCost || 0),
                          0,
                        ),
                      )}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-xs">
                      Filtered maintenance total
                    </p>
                  </div>
                  <div className="rounded-3xl bg-white dark:bg-gray-950 p-4 border border-gray-100 dark:border-white/5">
                    <p className="text-2xl font-black text-gray-900 dark:text-white">
                      {filteredCount}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-xs">
                      Current vehicle entries
                    </p>
                  </div>
                </div>
              </div>
              {maintenanceMessage && (
                <div className="rounded-3xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-600 p-4 text-sm text-red-700 dark:text-red-200">
                  {maintenanceMessage}
                </div>
              )}
              <div className="flex flex-wrap items-center gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowMaintenanceModal(false)}
                  className="px-6 py-3 rounded-3xl border border-gray-200 dark:border-white/10 text-sm font-black uppercase tracking-[0.25em] text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={maintenanceSubmitting}
                  className="px-6 py-3 rounded-3xl bg-blue-600 text-sm font-black uppercase tracking-[0.25em] text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700 disabled:opacity-60"
                >
                  {maintenanceSubmitting ? "Saving..." : "Save Maintenance"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
