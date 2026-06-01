"use client";

import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import { format } from "date-fns";
import { Edit, PiggyBank, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { createSaving } from "../actions/create.action";
import { deleteSaving } from "../actions/delete.action";
import { getAllSavings } from "../actions/getAll.action";
import { updateSaving } from "../actions/update.action";

export function SavingsBankList() {
  const [savings, setSavings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [vehicleType, setVehicleType] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const normalizeVehicleType = (value: any) =>
    typeof value === "string" ? value.trim().toUpperCase() : "";

  const fetchSavings = async () => {
    setLoading(true);
    try {
      const res = await getAllSavings();
      setSavings(res.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch savings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavings();
  }, []);

  const handleCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) {
      toast.error("Amount is required");
      return;
    }
    if (!vehicleType) {
      toast.error("Vehicle type is required");
      return;
    }

    setIsSaving(true);
    try {
      if (editingId) {
        await updateSaving(editingId, {
          amount: parseInt(amount, 10),
          date: new Date(date).toISOString(),
          vehicleType: normalizeVehicleType(vehicleType),
        });
        toast.success("Saving updated successfully");
      } else {
        await createSaving({
          amount: parseInt(amount, 10),
          date: new Date(date).toISOString(),
          vehicleType: normalizeVehicleType(vehicleType),
        });
        toast.success("Saving recorded successfully");
      }
      setAmount("");
      setVehicleType("");
      setDate(new Date().toISOString().slice(0, 10));
      setEditingId(null);
      fetchSavings();
    } catch (error) {
      toast.error(`Failed to ${editingId ? "update" : "record"} saving`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditClick = (saving: any) => {
    setEditingId(saving.id);
    setAmount(saving.amount.toString());
    setVehicleType(normalizeVehicleType(saving.vehicleType));
    if (saving.date) setDate(new Date(saving.date).toISOString().slice(0, 10));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this record?")) return;
    try {
      await deleteSaving(id);
      toast.success("Record deleted");
      if (editingId === id) {
        setEditingId(null);
        setAmount("");
        setVehicleType("");
      }
      fetchSavings();
    } catch (error) {
      toast.error("Failed to delete record");
    }
  };

  if (loading && savings.length === 0) {
    return (
      <div className="p-12 text-center animate-pulse italic font-bold text-muted-foreground uppercase tracking-widest">
        Loading savings...
      </div>
    );
  }

  const filteredSavings =
    filterType === "all"
      ? savings
      : savings.filter(
          (s) =>
            normalizeVehicleType(s.vehicleType) ===
            normalizeVehicleType(filterType),
        );
  const totalSavings = filteredSavings.reduce(
    (acc, curr) => acc + (curr.amount || 0),
    0,
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f] p-6 lg:p-10 space-y-8">
      {/* ── TOTAL + FORM (horizontal) ── */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Total Card */}
        <div className="relative bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-7 overflow-hidden shadow-xl shadow-emerald-500/20 lg:w-72 shrink-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.15),transparent_60%)]" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-200">
                Total Savings
              </span>
              <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
                <PiggyBank className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="text-4xl font-black text-white tracking-tight">
              Rs. {totalSavings.toLocaleString()}
            </div>
            <p className="text-emerald-200 text-xs font-medium mt-2">
              {filterType === "all" ? "All vehicles" : filterType}
            </p>
          </div>
        </div>

        {/* Add/Edit Form */}
        <div className="flex-1 bg-white dark:bg-gray-900/60 border border-gray-100 dark:border-white/5 rounded-3xl p-7 shadow-sm">
          <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wide mb-5">
            {editingId ? "Edit Saving Record" : "Add Saving Record"}
          </h2>
          <form
            onSubmit={handleCreateOrUpdate}
            className="flex flex-col md:flex-row items-end gap-4"
          >
            <div className="flex-1 space-y-1.5 w-full">
              <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Amount (Rs.)
              </Label>
              <Input
                type="number"
                placeholder="e.g. 5000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="rounded-xl"
              />
            </div>
            <div className="flex-1 space-y-1.5 w-full">
              <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Vehicle
              </Label>
              <Select
                value={vehicleType}
                onValueChange={setVehicleType}
                required
              >
                <SelectTrigger className="w-full rounded-xl">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CHR">CHR</SelectItem>
                  <SelectItem value="AQUA">Aqua</SelectItem>
                  <SelectItem value="KDH">KDH</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 space-y-1.5 w-full">
              <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Date
              </Label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="rounded-xl"
              />
            </div>
            <div className="flex gap-2 shrink-0">
              <Button
                type="submit"
                disabled={isSaving}
                className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-500/25 active:scale-95 transition-all"
              >
                {isSaving ? "Saving..." : editingId ? "Update" : "Save"}
              </Button>
              {editingId && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingId(null);
                    setAmount("");
                    setVehicleType("");
                  }}
                  className="rounded-xl"
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* ── RECORDS TABLE ── */}
      <div className="bg-white dark:bg-gray-900/60 border border-gray-100 dark:border-white/5 rounded-3xl overflow-hidden shadow-sm">
        <div className="px-7 py-5 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
          <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wide">
            Savings History
          </h2>
          <div className="w-[160px]">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="rounded-xl text-xs font-bold">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Vehicles</SelectItem>
                <SelectItem value="CHR">CHR</SelectItem>
                <SelectItem value="AQUA">Aqua</SelectItem>
                <SelectItem value="KDH">KDH</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-gray-950 border-b border-gray-100 dark:border-white/5">
              <tr>
                <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Vehicle
                </th>
                <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Amount
                </th>
                <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Date
                </th>
                <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {filteredSavings.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-12 text-center text-sm text-gray-400"
                  >
                    No savings recorded yet.
                  </td>
                </tr>
              ) : (
                filteredSavings.map((saving) => (
                  <tr
                    key={saving.id}
                    className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-6 py-4 font-black uppercase tracking-tight text-gray-900 dark:text-white">
                      {saving.vehicleType}
                    </td>
                    <td className="px-6 py-4 font-black text-emerald-600">
                      + Rs. {saving.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {saving.date
                        ? format(new Date(saving.date), "MMM dd, yyyy")
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex gap-1">
                        <button
                          onClick={() => handleEditClick(saving)}
                          className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(saving.id)}
                          className="p-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
