"use client";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Download, Pencil, RefreshCw, Search, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function HireManagementPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [editingRecord, setEditingRecord] = useState<any | null>(null);

  // Filters
  const [typeFilter, setTypeFilter] = useState<"all" | "KDH" | "CHR" | "AQUA">(
    "all",
  );
  const [searchQuery, setSearchQuery] = useState("");

  // PDF Search State
  const [pdfMonth, setPdfMonth] = useState("");
  const [pdfYear, setPdfYear] = useState("");

  useEffect(() => {
    setPdfYear(new Date().getFullYear().toString());
  }, []);

  // New Record Form State (for auto-calculation)
  const [newRecord, setNewRecord] = useState({
    pickupDate: "",
    returnDate: "",
    hireType: "daily", // daily, distance, discuss
    costPerDay: 0,
    distance: 0,
    pricePerKm: 0,
    maintenanceCost: 0,
    fuelCost: 0,
    totalCost: 0,
    isWithDriver: "no",
  });

  // Calculate total cost for new record
  useEffect(() => {
    let basePrice = 0;

    if (newRecord.hireType === "daily") {
      if (newRecord.pickupDate && newRecord.returnDate) {
        const start = new Date(newRecord.pickupDate);
        const end = new Date(newRecord.returnDate);
        const diffTime = Math.max(0, end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
        basePrice = diffDays * (newRecord.costPerDay || 0);
      }
    } else if (newRecord.hireType === "distance") {
      basePrice = (newRecord.distance || 0) * (newRecord.pricePerKm || 0);
    } else if (newRecord.hireType === "discuss") {
      basePrice = newRecord.costPerDay || 0; // Custom price entered in costPerDay field
    }

    const total =
      basePrice -
      ((newRecord.maintenanceCost || 0) + (newRecord.fuelCost || 0));
    setNewRecord((prev) => ({ ...prev, totalCost: total }));
  }, [
    newRecord.pickupDate,
    newRecord.returnDate,
    newRecord.costPerDay,
    newRecord.hireType,
    newRecord.distance,
    newRecord.pricePerKm,
    newRecord.maintenanceCost,
    newRecord.fuelCost,
  ]);

  // Edit Record Auto-calculation
  useEffect(() => {
    if (editingRecord) {
      let basePrice = 0;

      if (editingRecord.hireType === "daily") {
        const start = new Date(editingRecord.pickupDate);
        const end = new Date(editingRecord.returnDate);
        const diffTime = Math.max(0, end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
        basePrice = diffDays * (editingRecord.costPerDay || 0);
      } else if (editingRecord.hireType === "distance") {
        basePrice =
          (editingRecord.distance || 0) * (editingRecord.pricePerKm || 0);
      } else if (editingRecord.hireType === "discuss") {
        basePrice = editingRecord.costPerDay || 0;
      }

      const total =
        basePrice -
        ((Number(editingRecord.maintenanceCost) || 0) +
          (Number(editingRecord.fuelCost) || 0));
      if (editingRecord.totalCost !== total) {
        setEditingRecord({ ...editingRecord, totalCost: total });
      }
    }
  }, [
    editingRecord?.pickupDate,
    editingRecord?.returnDate,
    editingRecord?.costPerDay,
    editingRecord?.hireType,
    editingRecord?.distance,
    editingRecord?.pricePerKm,
    editingRecord?.maintenanceCost,
    editingRecord?.fuelCost,
  ]);

  const fetchRecords = async () => {
    setFetching(true);
    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
      const res = await fetch(`${backendUrl}/api/hire-management?limit=100`);
      if (res.ok) {
        const json = await res.json();
        setRecords((json.data || []).filter((r: any) => r.hireType !== "oil_change"));
      }
    } catch (e) {
      console.error("Failed to fetch records", e);
    } finally {
      setFetching(false);
    }
  };

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    fetchRecords();
  }, []);

  if (!mounted) return null;

  const filteredRecords = records.filter((record) => {
    const matchesType =
      typeFilter === "all" || record.vehicleType === typeFilter;
    const matchesSearch =
      !searchQuery ||
      record.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.phoneNumber?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesType && matchesSearch;
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const pDate = formData.get("pickupDate") as string;
    const rDate = formData.get("returnDate") as string;

    const data = {
      pickupDate: pDate ? new Date(pDate).toISOString() : null,
      returnDate: rDate ? new Date(rDate).toISOString() : null,
      phoneNumber: formData.get("phoneNumber"),
      customerName: formData.get("customerName"),
      vehicleType: formData.get("vehicleType"),
      description: formData.get("description"),
      hireType: formData.get("hireType"),
      distance: Number(formData.get("distance")) || 0,
      pricePerKm: Number(formData.get("pricePerKm")) || 0,
      isWithDriver: formData.get("isWithDriver"),
      maintenanceCost: Number(formData.get("maintenanceCost")) || 0,
      fuelCost: Number(formData.get("fuelCost")) || 0,
      costPerDay: Number(formData.get("costPerDay")) || 0,
      totalCost: Number(formData.get("totalCost")) || 0,
    };

    console.log("Submitting hire-management record:", data);

    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
      const response = await fetch(`${backendUrl}/api/hire-management`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        e.currentTarget.reset();
        setNewRecord({
          pickupDate: "",
          returnDate: "",
          hireType: "daily",
          costPerDay: 0,
          distance: 0,
          pricePerKm: 0,
          maintenanceCost: 0,
          fuelCost: 0,
          totalCost: 0,
          isWithDriver: "no",
        }); // Reset state
        await fetchRecords();
        window.location.reload();
      } else {
        const err = await response.json().catch(() => ({}));
        console.error("Add failed:", err);
        alert(`Failed to add record: ${JSON.stringify(err)}`);
      }
    } catch (error) {
      console.error(error);
      alert("Network error.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingRecord) return;
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const updates = {
      pickupDate: formData.get("pickupDate"),
      returnDate: formData.get("returnDate"),
      phoneNumber: formData.get("phoneNumber"),
      customerName: formData.get("customerName"),
      vehicleType: formData.get("vehicleType"),
      description: formData.get("description"),
      hireType: formData.get("hireType"),
      distance: Number(formData.get("distance")) || 0,
      pricePerKm: Number(formData.get("pricePerKm")) || 0,
      isWithDriver: formData.get("isWithDriver"),
      maintenanceCost: Number(formData.get("maintenanceCost")) || 0,
      fuelCost: Number(formData.get("fuelCost")) || 0,
      costPerDay: Number(formData.get("costPerDay")) || 0,
      totalCost: Number(formData.get("totalCost")) || 0,
      status: formData.get("status"),
    };

    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
      const response = await fetch(
        `${backendUrl}/api/hire-management/${editingRecord.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        },
      );

      if (response.ok) {
        setEditingRecord(null);
        await fetchRecords();
        window.location.reload();
      } else {
        alert("Failed to update record.");
      }
    } catch (e) {
      console.error(e);
      alert("Network error.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadMonthlyPDF = () => {
    if (!pdfMonth) {
      alert("Please select a month for the PDF report.");
      return;
    }

    const [year, month] = pdfMonth.split("-");

    const allMonthRecords = records.filter((record) => {
      const pDate = new Date(record.pickupDate);
      return (
        pDate.getFullYear() === parseInt(year || "0") &&
        pDate.getMonth() + 1 === parseInt(month || "0")
      );
    });

    const reportRecords = allMonthRecords.filter(
      (r) => r.hireType !== "maintenance"
    );
    const monthMaintenanceRecords = allMonthRecords.filter(
      (r) => r.hireType === "maintenance"
    );

    if (reportRecords.length === 0) {
      alert(`No records found for the month: ${pdfMonth}`);
      return;
    }

    const doc = new jsPDF();

    // Header
    doc.setFontSize(22);
    doc.setTextColor(37, 99, 235); // Blue-600
    doc.text("Nimesh Business Management", 14, 20);

    doc.setFontSize(16);
    doc.setTextColor(100);
    doc.text("Hire Monthly Report", 14, 30);

    doc.setFontSize(10);
    const monthName = new Date(
      parseInt(year || "0"),
      parseInt(month || "0") - 1,
    ).toLocaleString("default", { month: "long" });
    doc.text(`Report Period: ${monthName} ${year}`, 14, 38);
    doc.text(`Generated On: ${new Date().toLocaleString()}`, 14, 44);

    const tableData = reportRecords.map((r) => [
      new Date(r.pickupDate).toLocaleDateString(),
      new Date(r.returnDate).toLocaleDateString(),
      r.customerName,
      r.phoneNumber,
      r.vehicleType,
      `Rs. ${r.costPerDay?.toLocaleString() || 0}`,
      `Rs. ${r.maintenanceCost?.toLocaleString() || 0}`,
      `Rs. ${r.fuelCost?.toLocaleString() || 0}`,
      `Rs. ${r.totalCost?.toLocaleString() || 0}`,
    ]);

    autoTable(doc, {
      startY: 50,
      head: [
        [
          "Pickup",
          "Return",
          "Driver Name",
          "Driver Phone",
          "V Type",
          "Cost/Day",
          "DriverSalary",
          "Fuel",
          "Total",
        ],
      ],
      body: tableData,
      theme: "grid",
      headStyles: {
        fillColor: [37, 99, 235],
        textColor: 255,
        fontStyle: "bold",
      },
      styles: { fontSize: 8 },
      alternateRowStyles: { fillColor: [245, 247, 255] },
    });

    // Monthly net revenue summary
    const monthTotalRevenue = reportRecords.reduce(
      (sum, r) => sum + (r.totalCost || 0),
      0,
    );
    const monthMaintenanceCost = monthMaintenanceRecords.reduce(
      (sum, r) => sum + (r.maintenanceCost || 0),
      0,
    );
    const monthNetRevenue = monthTotalRevenue - monthMaintenanceCost;

    const finalY = (doc as any).lastAutoTable?.finalY || 50;
    doc.setFontSize(11);
    doc.setTextColor(37, 99, 235);
    doc.text(
      `Net Total Revenue: Rs. ${monthNetRevenue.toLocaleString()}`,
      14,
      finalY + 10,
    );

    // Maintenance Breakdown Table
    if (monthMaintenanceRecords.length > 0) {
      doc.addPage();
      doc.setFontSize(18);
      doc.setTextColor(245, 158, 11); // Amber-500
      doc.text("Maintenance Breakdown", 14, 20);

      const maintenanceTableData = monthMaintenanceRecords.map((r) => [
        new Date(r.pickupDate).toLocaleDateString(),
        r.vehicleType,
        r.description || "N/A",
        `Rs. ${r.maintenanceCost?.toLocaleString() || 0}`,
      ]);

      autoTable(doc, {
        startY: 30,
        head: [["Date", "Vehicle Type", "Description", "Cost"]],
        body: maintenanceTableData,
        theme: "grid",
        headStyles: {
          fillColor: [245, 158, 11],
          textColor: 255,
          fontStyle: "bold",
        },
        styles: { fontSize: 8 },
        alternateRowStyles: { fillColor: [255, 251, 235] },
      });

      const totalMaint = monthMaintenanceRecords.reduce(
        (sum, r) => sum + (r.maintenanceCost || 0),
        0
      );
      const mFinalY = (doc as any).lastAutoTable?.finalY || 30;
      doc.setFontSize(11);
      doc.setTextColor(245, 158, 11);
      doc.text(
        `Total Maintenance Cost: Rs. ${totalMaint.toLocaleString()}`,
        14,
        mFinalY + 10
      );
    }

    doc.save(`Hire_Monthly_Report_${pdfMonth}.pdf`);
  };

  const handleDownloadYearlyPDF = () => {
    if (!pdfYear) {
      alert("Please enter a year for the PDF report.");
      return;
    }

    const allYearRecords = records.filter((record) => {
      const pDate = new Date(record.pickupDate);
      return pDate.getFullYear() === parseInt(pdfYear);
    });

    // Separate hire records from maintenance records (mirrors dashboard logic)
    const reportRecords = allYearRecords.filter(
      (r) => r.hireType !== "maintenance"
    );
    const yearMaintenanceRecords = allYearRecords.filter(
      (r) => r.hireType === "maintenance"
    );

    if (reportRecords.length === 0) {
      alert(`No records found for the year: ${pdfYear}`);
      return;
    }

    const doc = new jsPDF();

    // Header
    doc.setFontSize(22);
    doc.setTextColor(37, 99, 235); // Blue-600
    doc.text("Nimesh Business Management", 14, 20);

    doc.setFontSize(16);
    doc.setTextColor(100);
    doc.text("Hire Yearly Summary Report", 14, 30);

    doc.setFontSize(10);
    doc.text(`Report Period: Year ${pdfYear}`, 14, 38);
    doc.text(`Generated On: ${new Date().toLocaleString()}`, 14, 44);

    // Calculate yearly totals — matching dashboard logic exactly
    const totalHireRevenue = reportRecords.reduce(
      (sum, r) => sum + (r.totalCost || 0),
      0,
    );
    const totalMaintenanceCost = yearMaintenanceRecords.reduce(
      (sum, r) => sum + (r.maintenanceCost || 0),
      0,
    );
    const netTotalRevenue = totalHireRevenue - totalMaintenanceCost;
    const totalSalary = reportRecords.reduce(
      (sum, r) => sum + (r.maintenanceCost || 0),
      0,
    );
    const totalFuel = reportRecords.reduce(
      (sum, r) => sum + (r.fuelCost || 0),
      0,
    );

    doc.setFontSize(12);
    doc.setTextColor(37, 99, 235);
    doc.text(`Yearly Summary:`, 14, 52);
    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.text(`Total Hires: ${reportRecords.length}`, 14, 58);
    doc.text(
      `Total Driver Salary: Rs. ${totalSalary.toLocaleString()}`,
      14,
      64,
    );
    doc.text(`Total Fuel Cost: Rs. ${totalFuel.toLocaleString()}`, 14, 70);
    doc.text(`Total Maintenance Cost: Rs. ${totalMaintenanceCost.toLocaleString()}`, 14, 76);
    doc.text(`Net Total Revenue: Rs. ${netTotalRevenue.toLocaleString()}`, 14, 82);

    const tableData = reportRecords.map((r) => [
      new Date(r.pickupDate).toLocaleDateString(),
      r.customerName,
      r.vehicleType,
      `Rs. ${r.costPerDay?.toLocaleString() || 0}`,
      `Rs. ${r.maintenanceCost?.toLocaleString() || 0}`,
      `Rs. ${r.fuelCost?.toLocaleString() || 0}`,
      `Rs. ${r.totalCost?.toLocaleString() || 0}`,
    ]);

    autoTable(doc, {
      startY: 90,
      head: [
        [
          "Date",
          "Driver/Customer",
          "V Type",
          "Base Cost",
          "DriverSalary",
          "Fuel",
          "Net Revenue",
        ],
      ],
      body: tableData,
      theme: "striped",
      headStyles: {
        fillColor: [37, 99, 235],
        textColor: 255,
        fontStyle: "bold",
      },
      styles: { fontSize: 7 },
      margin: { top: 86 },
    });

    // Maintenance Breakdown Table
    if (yearMaintenanceRecords.length > 0) {
      doc.addPage();
      doc.setFontSize(18);
      doc.setTextColor(245, 158, 11); // Amber-500
      doc.text("Yearly Maintenance Breakdown", 14, 20);

      const maintenanceTableData = yearMaintenanceRecords.map((r) => [
        new Date(r.pickupDate).toLocaleDateString(),
        r.vehicleType,
        r.description || "N/A",
        `Rs. ${r.maintenanceCost?.toLocaleString() || 0}`,
      ]);

      autoTable(doc, {
        startY: 30,
        head: [["Date", "Vehicle Type", "Description", "Cost"]],
        body: maintenanceTableData,
        theme: "grid",
        headStyles: {
          fillColor: [245, 158, 11],
          textColor: 255,
          fontStyle: "bold",
        },
        styles: { fontSize: 8 },
        alternateRowStyles: { fillColor: [255, 251, 235] },
      });

      const totalMaint = yearMaintenanceRecords.reduce(
        (sum, r) => sum + (r.maintenanceCost || 0),
        0
      );
      const mFinalY = (doc as any).lastAutoTable?.finalY || 30;
      doc.setFontSize(11);
      doc.setTextColor(245, 158, 11);
      doc.text(
        `Total Maintenance Cost: Rs. ${totalMaint.toLocaleString()}`,
        14,
        mFinalY + 10
      );
    }

    doc.save(`Hire_Yearly_Report_${pdfYear}.pdf`);
  };

  const handleDownloadMaintenancePDF = () => {
    if (!pdfMonth) {
      alert("Please select a month for the Maintenance PDF report.");
      return;
    }

    const [year, month] = pdfMonth.split("-");

    const maintenanceRecords = records.filter((record) => {
      const pDate = new Date(record.pickupDate);
      return (
        record.hireType === "maintenance" &&
        pDate.getFullYear() === parseInt(year || "0") &&
        pDate.getMonth() + 1 === parseInt(month || "0")
      );
    });

    if (maintenanceRecords.length === 0) {
      alert(`No maintenance records found for the month: ${pdfMonth}`);
      return;
    }

    const doc = new jsPDF();

    // Header
    doc.setFontSize(22);
    doc.setTextColor(245, 158, 11); // Amber-600
    doc.text("Nimesh Business Management", 14, 20);

    doc.setFontSize(16);
    doc.setTextColor(100);
    doc.text("Vehicle Maintenance Report", 14, 30);

    doc.setFontSize(10);
    const monthName = new Date(
      parseInt(year || "0"),
      parseInt(month || "0") - 1,
    ).toLocaleString("default", { month: "long" });
    doc.text(`Report Period: ${monthName} ${year}`, 14, 38);
    doc.text(`Generated On: ${new Date().toLocaleString()}`, 14, 44);

    const tableData = maintenanceRecords.map((r) => [
      new Date(r.pickupDate).toLocaleDateString(),
      r.vehicleType,
      r.description || "N/A",
      `Rs. ${r.maintenanceCost?.toLocaleString() || 0}`,
    ]);

    autoTable(doc, {
      startY: 50,
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

    const totalCost = maintenanceRecords.reduce(
      (sum, r) => sum + (r.maintenanceCost || 0),
      0,
    );

    const finalY = (doc as any).lastAutoTable?.finalY || 50;
    doc.setFontSize(12);
    doc.setTextColor(245, 158, 11);
    doc.text(
      `Total Maintenance Cost: Rs. ${totalCost.toLocaleString()}`,
      14,
      finalY + 10,
    );

    doc.save(`Maintenance_Report_${pdfMonth}.pdf`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this record?")) return;
    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
      const response = await fetch(`${backendUrl}/api/hire-management/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        await fetchRecords();
        window.location.reload();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black p-6 lg:p-12 font-sans transition-colors duration-300">
      <div className="max-w-[1600px] mx-auto bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-white/5 overflow-hidden">
        {/* Header */}
        <div className="p-8 border-b border-gray-100 dark:border-white/5 bg-white dark:bg-gray-900 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black italic tracking-tighter text-gray-900 dark:text-white uppercase leading-none">
              HIRE MANAGEMENT SYSTEM
            </h1>
            <p className="text-gray-500 mt-2 font-medium">
              Coordinate vehicle rentals, track costs, and manage returns.
            </p>
          </div>
          <div className="flex items-center gap-6">
            {/* Monthly Report */}
            <div className="flex bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 p-2 px-4 rounded-2xl items-center gap-3 shadow-inner">
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest pl-1">
                  Monthly
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="month"
                    value={pdfMonth}
                    onChange={(e) => setPdfMonth(e.target.value)}
                    className="text-[11px] font-extrabold bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 rounded-lg px-2 py-1 outline-none"
                  />
                  <button
                    onClick={handleDownloadMonthlyPDF}
                    className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all shadow-lg active:scale-95"
                    title="Monthly PDF"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Yearly Report */}
            <div className="flex bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 p-2 px-4 rounded-2xl items-center gap-3 shadow-inner">
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest pl-1">
                  Yearly
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="2020"
                    max="2100"
                    value={pdfYear}
                    onChange={(e) => setPdfYear(e.target.value)}
                    className="w-20 text-[11px] font-extrabold bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 rounded-lg px-2 py-1 outline-none"
                  />
                  <button
                    onClick={handleDownloadYearlyPDF}
                    className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all shadow-lg active:scale-95"
                    title="Yearly PDF"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Maintenance Report */}
            <div className="flex bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 p-2 px-4 rounded-2xl items-center gap-3 shadow-inner">
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest pl-1">
                  Maintenance
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="month"
                    value={pdfMonth}
                    onChange={(e) => setPdfMonth(e.target.value)}
                    className="text-[11px] font-extrabold bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 rounded-lg px-2 py-1 outline-none"
                  />
                  <button
                    onClick={handleDownloadMaintenancePDF}
                    className="p-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-all shadow-lg active:scale-95"
                    title="Maintenance PDF"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={fetchRecords}
              className="p-3 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-white rounded-full transition-colors flex items-center justify-center shrink-0 shadow-sm border border-transparent"
            >
              <RefreshCw
                className={`w-5 h-5 ${fetching ? "animate-spin text-blue-500" : ""}`}
              />
            </button>
          </div>
        </div>
        {/* Filtering & Search Section */}
        <div className="px-8 py-6 bg-gray-50/50 dark:bg-gray-800/20 border-b border-gray-100 dark:border-white/5 flex flex-wrap items-center gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-1">
              Search Database
            </span>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search customer, vehicle..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all w-64 shadow-sm"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-1">
              Vehicle Type
            </span>
            <div className="flex bg-gray-200/50 dark:bg-white/5 p-1 rounded-xl w-fit border border-transparent dark:border-white/5">
              {(["all", "KDH", "CHR", "AQUA"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={`px-5 py-2 rounded-lg text-[11px] font-extrabold uppercase tracking-tight transition-all ${
                    typeFilter === t
                      ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm"
                      : "text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="ml-auto flex items-end h-full pt-6">
            <div className="text-[11px] font-bold text-gray-400 dark:text-gray-500 bg-white dark:bg-gray-800 px-4 py-2 rounded-full border border-gray-100 dark:border-white/5 shadow-sm">
              TOTAL ENTRIES:{" "}
              <span className="text-blue-600 dark:text-blue-400 font-black ml-1">
                {filteredRecords.length}
              </span>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="w-full">
          <form onSubmit={handleSubmit}>
            <table className="w-full text-left border-collapse table-fixed">
              <thead>
                <tr className="bg-gray-50/80 dark:bg-white/5 text-gray-400 dark:text-gray-500 text-[10px] uppercase tracking-widest font-black border-b border-gray-100 dark:border-white/5">
                  <th className="p-4 w-[10%]">Type</th>
                  <th className="p-4 w-[12%]">Period</th>
                  <th className="p-4 w-[18%]">Driver Details</th>
                  <th className="p-4 w-[15%]">Vehicle & Options</th>
                  <th className="p-4 w-[15%]">Pricing Info</th>
                  <th className="p-4 w-[12%] text-right">
                    DRIVER SALARY / FUEL
                  </th>
                  <th className="p-4 w-[10%] text-right">Total (RS)</th>
                  <th className="p-4 w-[8%] text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {/* Inline Add Form */}
                <tr className="bg-blue-50/30 dark:bg-blue-900/10">
                  <td className="p-2 align-top">
                    <select
                      name="hireType"
                      value={newRecord.hireType}
                      onChange={(e) =>
                        setNewRecord({ ...newRecord, hireType: e.target.value })
                      }
                      className="w-full px-2 py-2.5 rounded-lg border border-blue-200 dark:border-blue-900/30 focus:ring-2 focus:ring-blue-500 outline-none text-[10px] font-bold uppercase bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="daily">Daily Price</option>
                      <option value="distance">Distance Price</option>
                      <option value="discuss">Discuss</option>
                    </select>
                  </td>
                  <td className="p-2 align-top space-y-1">
                    <input
                      required
                      name="pickupDate"
                      type="date"
                      value={newRecord.pickupDate}
                      onChange={(e) =>
                        setNewRecord({
                          ...newRecord,
                          pickupDate: e.target.value,
                        })
                      }
                      className="w-full px-2 py-2 rounded-lg border border-blue-200 dark:border-blue-900/30 text-[10px] bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                    <input
                      required
                      name="returnDate"
                      type="date"
                      value={newRecord.returnDate}
                      onChange={(e) =>
                        setNewRecord({
                          ...newRecord,
                          returnDate: e.target.value,
                        })
                      }
                      className="w-full px-2 py-2 rounded-lg border border-blue-200 dark:border-blue-900/30 text-[10px] bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </td>
                  <td className="p-2 align-top space-y-1">
                    <input
                      required
                      name="customerName"
                      type="text"
                      placeholder="Name..."
                      className="w-full px-2 py-2 rounded-lg border border-blue-200 dark:border-blue-900/30 text-[10px] bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                    <input
                      required
                      name="phoneNumber"
                      type="text"
                      placeholder="Phone..."
                      className="w-full px-2 py-2 rounded-lg border border-blue-200 dark:border-blue-900/30 text-[10px] bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </td>
                  <td className="p-2 align-top space-y-1">
                    <select
                      name="vehicleType"
                      className="w-full px-2 py-2 rounded-lg border border-blue-200 dark:border-blue-900/30 text-[10px] font-bold uppercase bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="KDH">KDH</option>
                      <option value="CHR">CHR</option>
                      <option value="AQUA">AQUA</option>
                    </select>
                    <select
                      name="isWithDriver"
                      value={newRecord.isWithDriver}
                      onChange={(e) =>
                        setNewRecord({
                          ...newRecord,
                          isWithDriver: e.target.value,
                        })
                      }
                      className="w-full px-2 py-2 rounded-lg border border-blue-200 dark:border-blue-900/30 text-[10px] font-bold uppercase text-blue-600 bg-white dark:bg-gray-800"
                    >
                      <option value="no">Self Drive</option>
                      <option value="yes">With Driver</option>
                    </select>
                  </td>
                  <td className="p-2 align-top">
                    {newRecord.hireType === "distance" ? (
                      <div className="space-y-1">
                        <input
                          name="distance"
                          type="number"
                          placeholder="Distance (km)"
                          value={newRecord.distance || ""}
                          onChange={(e) =>
                            setNewRecord({
                              ...newRecord,
                              distance: Number(e.target.value),
                            })
                          }
                          className="w-full px-2 py-2 rounded-lg border border-blue-500 text-[10px] bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-bold"
                        />
                        <input
                          name="pricePerKm"
                          type="number"
                          placeholder="Price per km"
                          value={newRecord.pricePerKm || ""}
                          onChange={(e) =>
                            setNewRecord({
                              ...newRecord,
                              pricePerKm: Number(e.target.value),
                            })
                          }
                          className="w-full px-2 py-2 rounded-lg border border-blue-500 text-[10px] bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-bold"
                        />
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <input
                          name="costPerDay"
                          type="number"
                          placeholder={
                            newRecord.hireType === "discuss"
                              ? "Agreed Price"
                              : "Cost of trip"
                          }
                          value={newRecord.costPerDay || ""}
                          onChange={(e) =>
                            setNewRecord({
                              ...newRecord,
                              costPerDay: Number(e.target.value),
                            })
                          }
                          className="w-full px-2 py-2 rounded-lg border border-blue-500 text-[10px] bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-bold"
                        />
                        <input
                          name="description"
                          type="text"
                          placeholder="Description..."
                          className="w-full px-2 py-2 rounded-lg border border-blue-200 dark:border-blue-900/30 text-[10px] bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                      </div>
                    )}
                  </td>
                  <td className="p-2 align-top space-y-1">
                    <input
                      name="maintenanceCost"
                      type="number"
                      placeholder="Driver Salary"
                      value={newRecord.maintenanceCost || ""}
                      onChange={(e) =>
                        setNewRecord({
                          ...newRecord,
                          maintenanceCost: Number(e.target.value),
                        })
                      }
                      className="w-full px-2 py-2 rounded-lg border border-amber-200 dark:border-amber-900/30 text-[10px] bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                    <input
                      name="fuelCost"
                      type="number"
                      placeholder="Fuel"
                      value={newRecord.fuelCost || ""}
                      onChange={(e) =>
                        setNewRecord({
                          ...newRecord,
                          fuelCost: Number(e.target.value),
                        })
                      }
                      className="w-full px-2 py-2 rounded-lg border border-amber-200 dark:border-amber-900/30 text-[10px] bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </td>
                  <td className="p-2 align-top text-right">
                    <input
                      required
                      name="totalCost"
                      type="number"
                      value={newRecord.totalCost}
                      readOnly
                      className="w-full px-2 py-2.5 rounded-lg border border-blue-100 dark:border-blue-900/20 bg-blue-100/30 dark:bg-blue-900/30 text-[11px] text-right font-black text-blue-700 dark:text-blue-400 outline-none cursor-not-allowed"
                    />
                  </td>
                  <td className="p-2 align-top text-center pt-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-5 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase hover:bg-blue-700 shadow-md transition-all active:scale-95 disabled:opacity-50"
                    >
                      {loading ? "..." : "Add Hire"}
                    </button>
                  </td>
                </tr>

                {/* List Data */}
                {fetching && records.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="p-12 text-center text-gray-400 dark:text-gray-600 font-bold uppercase tracking-widest text-xs italic"
                    >
                      Syncing with database...
                    </td>
                  </tr>
                ) : filteredRecords.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="p-12 text-center text-gray-400 dark:text-gray-600 font-bold uppercase tracking-widest text-xs italic"
                    >
                      No matching hire records found.
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((record) => (
                    <tr
                      key={record.id}
                      className="hover:bg-gray-50/80 dark:hover:bg-white/5 transition-colors group text-[11px]"
                    >
                      <td className="p-4 align-middle">
                        <span
                          className={`px-2 py-1 rounded-md font-black uppercase tracking-tighter border ${
                            record.hireType === "distance"
                              ? "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border-purple-100 dark:border-purple-800"
                              : record.hireType === "discuss"
                                ? "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-800"
                                : "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800"
                          }`}
                        >
                          {record.hireType?.replace("_", " ") || "record"}
                        </span>
                      </td>
                      <td className="p-4 text-gray-500 dark:text-gray-400 align-middle">
                        <div className="flex flex-col">
                          <span>
                            {record.pickupDate
                              ? new Date(record.pickupDate).toLocaleDateString()
                              : "-"}
                          </span>
                          <span className="text-[9px] opacity-60 italic">
                            {record.returnDate
                              ? new Date(record.returnDate).toLocaleDateString()
                              : "-"}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-gray-900 dark:text-white align-middle">
                        <div className="flex flex-col">
                          <span className="font-bold uppercase tracking-tight">
                            {record.customerName}
                          </span>
                          <span className="text-[10px] text-gray-500 dark:text-gray-400">
                            {record.phoneNumber}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 align-middle">
                        <div className="flex flex-col gap-1">
                          <span className="px-2 py-0.5 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 rounded-md font-black text-[9px] uppercase border border-gray-200 dark:border-white/10 w-fit">
                            {record.vehicleType}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-md font-bold text-[8px] uppercase border w-fit ${
                              record.isWithDriver === "yes"
                                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-800"
                                : "bg-gray-50 dark:bg-white/5 text-gray-400 dark:text-gray-500 border-gray-100 dark:border-white/10"
                            }`}
                          >
                            {record.isWithDriver === "yes"
                              ? "With Driver"
                              : "Self Drive"}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-gray-600 dark:text-gray-400 align-middle">
                        {record.hireType === "distance" ? (
                          <div className="flex flex-col">
                            <span className="font-bold text-gray-900 dark:text-white">
                              {record.distance} km
                            </span>
                            <span className="text-[9px]">
                              @ Rs. {record.pricePerKm}/km
                            </span>
                          </div>
                        ) : (
                          <div className="flex flex-col">
                            <span className="font-bold text-gray-900 dark:text-white">
                              Rs. {record.costPerDay?.toLocaleString()}
                            </span>
                            <span className="text-[9px] italic line-clamp-1">
                              {record.description || "No info"}
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="p-4 text-gray-600 dark:text-gray-400 align-middle text-right">
                        <div className="flex flex-col items-end">
                          <span className="text-amber-600 dark:text-amber-400">
                            S: Rs.{" "}
                            {record.maintenanceCost?.toLocaleString() || 0}
                          </span>
                          <span className="text-blue-600 dark:text-blue-400">
                            F: Rs. {record.fuelCost?.toLocaleString() || 0}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-blue-600 dark:text-blue-400 font-black text-right align-middle text-sm">
                        Rs. {record.totalCost?.toLocaleString()}
                      </td>
                      <td className="p-4 text-center align-middle">
                        <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setEditingRecord(record)}
                            className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md border border-transparent hover:border-blue-100 dark:hover:border-blue-800 transition-all"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(record.id)}
                            className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md border border-transparent hover:border-red-100 dark:hover:border-red-800 transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </form>
        </div>
      </div>

      {/* Edit Modal */}
      {editingRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden border border-white/20 dark:border-white/5 max-h-[calc(100vh-4rem)] animate-in slide-in-from-bottom-8 duration-300">
            <div className="px-8 py-6 bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black italic uppercase tracking-tight text-gray-900 dark:text-white">
                  Edit Hire
                </h2>
                <p className="text-xs font-bold text-gray-400 dark:text-gray-500 mt-1 uppercase tracking-widest">
                  Update existing vehicle rental details
                </p>
              </div>
              <button
                onClick={() => setEditingRecord(null)}
                className="p-2 hover:bg-white dark:hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-gray-900 dark:hover:text-white border border-transparent hover:border-gray-100 dark:hover:border-white/10"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form
              onSubmit={handleUpdate}
              className="p-8 space-y-6 text-gray-900 dark:text-white overflow-y-auto max-h-[calc(100vh-18rem)]"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-1">
                    Pickup Date
                  </label>
                  <input
                    name="pickupDate"
                    type="date"
                    value={
                      editingRecord.pickupDate
                        ? typeof editingRecord.pickupDate === "string"
                          ? editingRecord.pickupDate.split("T")[0]
                          : new Date(editingRecord.pickupDate)
                              .toISOString()
                              .split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      setEditingRecord({
                        ...editingRecord,
                        pickupDate: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 dark:border-white/10 focus:border-blue-500 outline-none font-bold text-sm bg-gray-50/30 dark:bg-white/5"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-1">
                    Return Date
                  </label>
                  <input
                    name="returnDate"
                    type="date"
                    value={
                      editingRecord.returnDate
                        ? typeof editingRecord.returnDate === "string"
                          ? editingRecord.returnDate.split("T")[0]
                          : new Date(editingRecord.returnDate)
                              .toISOString()
                              .split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      setEditingRecord({
                        ...editingRecord,
                        returnDate: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 dark:border-white/10 focus:border-blue-500 outline-none font-bold text-sm bg-gray-50/30 dark:bg-white/5"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-1">
                    Customer Name
                  </label>
                  <input
                    required
                    name="customerName"
                    defaultValue={editingRecord.customerName}
                    type="text"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 dark:border-white/10 focus:border-blue-500 outline-none font-bold text-sm bg-gray-50/30 dark:bg-white/5"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-1">
                    Phone Number
                  </label>
                  <input
                    required
                    name="phoneNumber"
                    defaultValue={editingRecord.phoneNumber}
                    type="text"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 dark:border-white/10 focus:border-blue-500 outline-none font-bold text-sm bg-gray-50/30 dark:bg-white/5"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-1">
                    Vehicle Type
                  </label>
                  <select
                    name="vehicleType"
                    defaultValue={editingRecord.vehicleType}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 dark:border-white/10 focus:border-blue-500 outline-none font-bold text-sm bg-gray-50/30 dark:bg-white/5 appearance-none uppercase"
                  >
                    <option value="KDH">KDH</option>
                    <option value="CHR">CHR</option>
                    <option value="AQUA">AQUA</option>
                  </select>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    defaultValue={editingRecord.description}
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 dark:border-white/10 focus:border-blue-500 outline-none font-bold text-sm bg-gray-50/30 dark:bg-white/5 resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-1">
                    Hire Type
                  </label>
                  <select
                    name="hireType"
                    value={editingRecord.hireType}
                    onChange={(e) =>
                      setEditingRecord({
                        ...editingRecord,
                        hireType: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 dark:border-white/10 focus:border-blue-500 outline-none font-bold text-sm bg-gray-50/30 dark:bg-white/5"
                  >
                    <option value="daily">Daily Price</option>
                    <option value="distance">Distance Price</option>
                    <option value="discuss">Discuss</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-1">
                    Driver Option
                  </label>
                  <select
                    name="isWithDriver"
                    value={editingRecord.isWithDriver}
                    onChange={(e) =>
                      setEditingRecord({
                        ...editingRecord,
                        isWithDriver: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 dark:border-white/10 focus:border-blue-500 outline-none font-bold text-sm bg-gray-50/30 dark:bg-white/5"
                  >
                    <option value="no">Self Drive</option>
                    <option value="yes">With Driver</option>
                  </select>
                </div>

                {editingRecord.hireType === "distance" ? (
                  <>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-1">
                        Distance (KM)
                      </label>
                      <input
                        name="distance"
                        type="number"
                        value={editingRecord.distance || ""}
                        onChange={(e) =>
                          setEditingRecord({
                            ...editingRecord,
                            distance: Number(e.target.value),
                          })
                        }
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 dark:border-white/10 focus:border-blue-500 outline-none font-bold text-sm bg-gray-50/30 dark:bg-white/5"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-1">
                        Price Per KM
                      </label>
                      <input
                        name="pricePerKm"
                        type="number"
                        value={editingRecord.pricePerKm || ""}
                        onChange={(e) =>
                          setEditingRecord({
                            ...editingRecord,
                            pricePerKm: Number(e.target.value),
                          })
                        }
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 dark:border-white/10 focus:border-blue-500 outline-none font-bold text-sm bg-gray-50/30 dark:bg-white/5"
                      />
                    </div>
                  </>
                ) : (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-1">
                      {editingRecord.hireType === "discuss"
                        ? "Agreed Total Price"
                        : "Cost Per Day"}
                    </label>
                    <input
                      name="costPerDay"
                      value={editingRecord.costPerDay || ""}
                      type="number"
                      onChange={(e) =>
                        setEditingRecord({
                          ...editingRecord,
                          costPerDay: Number(e.target.value),
                        })
                      }
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 dark:border-white/10 focus:border-blue-500 outline-none font-bold text-sm bg-gray-50/30 dark:bg-white/5"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest pl-1">
                    Driver Salary
                  </label>
                  <input
                    name="maintenanceCost"
                    value={editingRecord.maintenanceCost || ""}
                    type="number"
                    onChange={(e) =>
                      setEditingRecord({
                        ...editingRecord,
                        maintenanceCost: Number(e.target.value),
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl border-2 border-amber-100 dark:border-amber-900/30 focus:border-amber-500 outline-none font-bold text-sm bg-amber-50/10 dark:bg-white/5"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest pl-1">
                    Fuel Cost
                  </label>
                  <input
                    name="fuelCost"
                    value={editingRecord.fuelCost || ""}
                    type="number"
                    onChange={(e) =>
                      setEditingRecord({
                        ...editingRecord,
                        fuelCost: Number(e.target.value),
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl border-2 border-blue-100 dark:border-blue-900/30 focus:border-blue-500 outline-none font-bold text-sm bg-blue-50/10 dark:bg-white/5"
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-1">
                    Final Calculated Total (RS)
                  </label>
                  <input
                    name="totalCost"
                    value={editingRecord.totalCost || 0}
                    type="number"
                    readOnly
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 dark:border-white/10 bg-blue-50/50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 outline-none font-black text-sm cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="pt-6 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setEditingRecord(null)}
                  className="px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10 transition-all leading-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50 leading-none"
                >
                  {loading ? "Updating..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
