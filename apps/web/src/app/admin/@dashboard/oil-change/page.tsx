"use client";

import {
  Activity,
  Pencil,
  Trash2,
  X,
  RefreshCw,
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

export default function OilChangePage() {
  const [hireRecords, setHireRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [showOilChangeModal, setShowOilChangeModal] = useState(false);
  const [editingOilChangeId, setEditingOilChangeId] = useState<string | null>(
    null,
  );
  const [oilVehicleType, setOilVehicleType] =
    useState<MaintenanceVehicleType>("KDH");
  const [oilKm, setOilKm] = useState(0);
  const [oilDate, setOilDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [oilSubmitting, setOilSubmitting] = useState(false);
  const [oilMessage, setOilMessage] = useState<string | null>(null);

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
  const oilChangeRecords = hireRecords.filter(
    (r) => r.hireType === "oil_change",
  );

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

  const handleOilChangeSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (oilKm <= 0 || !oilDate) {
      setOilMessage("Please enter valid date and km.");
      return;
    }

    setOilSubmitting(true);
    setOilMessage(null);

    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
      const isEdit = !!editingOilChangeId;
      const url = isEdit
        ? `${backendUrl}/api/hire-management/${editingOilChangeId}`
        : `${backendUrl}/api/hire-management`;
      const response = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pickupDate: new Date(oilDate).toISOString(),
          returnDate: new Date(oilDate).toISOString(),
          phoneNumber: "N/A",
          customerName: "Oil Change Entry",
          vehicleType: oilVehicleType,
          description: "Oil Change (5000-6000km)",
          hireType: "oil_change",
          distance: oilKm,
          pricePerKm: 0,
          isWithDriver: "no",
          maintenanceCost: 0,
          fuelCost: 0,
          costPerDay: 0,
          totalCost: 0,
          status: "maintenance",
        }),
      });

      if (response.ok) {
        setShowOilChangeModal(false);
        setEditingOilChangeId(null);
        setOilKm(0);
        setOilDate(new Date().toISOString().split("T")[0]);
        await fetchHires();
      } else {
        const errorResponse = await response.json().catch(() => null);
        setOilMessage(
          `Unable to save oil change entry. ${errorResponse?.message || "Please try again."}`,
        );
      }
    } catch (error) {
      console.error(error);
      setOilMessage("Network error while saving oil change entry.");
    } finally {
      setOilSubmitting(false);
    }
  };

  const handleDeleteOilChange = async (id: string) => {
    if (!confirm("Are you sure you want to delete this oil change entry?"))
      return;
    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
      const response = await fetch(`${backendUrl}/api/hire-management/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        await fetchHires();
      } else {
        alert("Failed to delete entry.");
      }
    } catch (e) {
      console.error(e);
      alert("Network error while deleting entry.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f] p-6 lg:p-10 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 dark:text-blue-400 mb-1">
            Admin Panel
          </p>
          <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-gray-900 dark:text-white">
            Oil Change Tracker
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">
            Keep track of vehicle oil changes by date and mileage.
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


      {/* ── OIL CHANGE TRACKER ── */}
      <div className="bg-white dark:bg-gray-900/60 border border-gray-100 dark:border-white/5 rounded-3xl overflow-hidden shadow-sm">
        <div className="px-7 py-5 border-b border-gray-100 dark:border-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wide">
              Oil Change Tracker (5000-6000km)
            </h2>
            <p className="text-[10px] text-gray-400 font-medium mt-0.5">
              Keep track of vehicle oil changes by date and mileage.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setEditingOilChangeId(null);
                setOilVehicleType("KDH");
                setOilKm(0);
                setOilDate(new Date().toISOString().split("T")[0]);
                setShowOilChangeModal(true);
                setOilMessage(null);
              }}
              className="inline-flex items-center justify-center rounded-full bg-blue-500 px-4 py-2 text-[11px] font-black uppercase tracking-[0.25em] text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-600"
            >
              Log Oil Change
            </button>
          </div>
        </div>
        <div className="p-7 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {oilChangeByType.map((item) => (
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
                  oil change records
                </p>
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
                    Date
                  </th>
                  <th className="px-5 py-3 uppercase tracking-widest text-[10px] text-slate-500 dark:text-slate-400">
                    Mileage (KM)
                  </th>
                  <th className="px-5 py-3 uppercase tracking-widest text-[10px] text-slate-500 dark:text-slate-400">
                    Next Change (+5000 KM)
                  </th>
                  <th className="px-5 py-3 uppercase tracking-widest text-[10px] text-slate-500 dark:text-slate-400 text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {oilChangeRecords.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
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
                      <td className="px-5 py-4 text-right space-x-2">
                        <button
                          onClick={() => {
                            setEditingOilChangeId(record.id);
                            setOilVehicleType(record.vehicleType);
                            setOilDate(
                              new Date(record.pickupDate)
                                .toISOString()
                                .split("T")[0],
                            );
                            setOilKm(record.distance || 0);
                            setOilMessage(null);
                            setShowOilChangeModal(true);
                          }}
                          className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteOilChange(record.id)}
                          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>


      {showOilChangeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-[32px] border border-white/10 bg-white dark:bg-gray-950 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100 dark:border-white/5">
              <div>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white">
                  {editingOilChangeId
                    ? "Edit Oil Change Entry"
                    : "Add Oil Change Entry"}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Log a new oil change with vehicle type, date, and mileage.
                </p>
              </div>
              <button
                onClick={() => setShowOilChangeModal(false)}
                title="Close modal"
                className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form
              onSubmit={handleOilChangeSubmit}
              className="p-8 space-y-6 text-gray-900 dark:text-white"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label
                    htmlFor="oilVehicleType"
                    className="block text-xs font-black uppercase tracking-[0.3em] text-gray-500 dark:text-gray-400"
                  >
                    Vehicle Type
                  </label>
                  <select
                    id="oilVehicleType"
                    value={oilVehicleType}
                    onChange={(e) =>
                      setOilVehicleType(
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
                    htmlFor="oilDate"
                    className="block text-xs font-black uppercase tracking-[0.3em] text-gray-500 dark:text-gray-400"
                  >
                    Date
                  </label>
                  <input
                    id="oilDate"
                    type="date"
                    value={oilDate}
                    onChange={(e) => setOilDate(e.target.value)}
                    className="w-full rounded-3xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-gray-900 px-4 py-3 text-sm font-bold text-gray-900 dark:text-white outline-none transition"
                  />
                </div>

                <div className="space-y-3">
                  <label
                    htmlFor="oilKm"
                    className="block text-xs font-black uppercase tracking-[0.3em] text-gray-500 dark:text-gray-400"
                  >
                    Mileage (KM)
                  </label>
                  <input
                    id="oilKm"
                    type="number"
                    min={0}
                    step={1}
                    value={oilKm}
                    onChange={(e) => setOilKm(Number(e.target.value))}
                    className="w-full rounded-3xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-gray-900 px-4 py-3 text-sm font-bold text-gray-900 dark:text-white outline-none transition"
                  />
                </div>
              </div>

              {oilMessage && (
                <div className="rounded-3xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-600 p-4 text-sm text-red-700 dark:text-red-200">
                  {oilMessage}
                </div>
              )}
              <div className="flex flex-wrap items-center gap-3 justify-end mt-4">
                <button
                  type="button"
                  onClick={() => setShowOilChangeModal(false)}
                  className="px-6 py-3 rounded-3xl border border-gray-200 dark:border-white/10 text-sm font-black uppercase tracking-[0.25em] text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={oilSubmitting}
                  className="px-6 py-3 rounded-3xl bg-blue-600 text-sm font-black uppercase tracking-[0.25em] text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700 disabled:opacity-60"
                >
                  {oilSubmitting ? "Saving..." : "Save Oil Change"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
