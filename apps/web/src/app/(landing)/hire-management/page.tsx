"use client";

import { Pencil, RefreshCw, Search, Trash2, X, FileText, Download } from "lucide-react";
import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function HireManagementPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [editingRecord, setEditingRecord] = useState<any | null>(null);

  // Filters
  const [typeFilter, setTypeFilter] = useState<"all" | "KDH" | "CHR" | "AQUA">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // PDF Search State
  const [pdfMonth, setPdfMonth] = useState("");

  // New Record Form State (for auto-calculation)
  const [newRecord, setNewRecord] = useState({
    pickupDate: "",
    returnDate: "",
    costPerDay: 0,
    totalCost: 0,
  });

  // Calculate total cost for new record
  useEffect(() => {
    if (newRecord.pickupDate && newRecord.returnDate && newRecord.costPerDay) {
      const start = new Date(newRecord.pickupDate);
      const end = new Date(newRecord.returnDate);
      const diffTime = Math.max(0, end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1; // Minimum 1 day
      setNewRecord(prev => ({ ...prev, totalCost: diffDays * prev.costPerDay }));
    }
  }, [newRecord.pickupDate, newRecord.returnDate, newRecord.costPerDay]);

  // Edit Record Auto-calculation
  useEffect(() => {
    if (editingRecord) {
      const start = new Date(editingRecord.pickupDate);
      const end = new Date(editingRecord.returnDate);
      const diffTime = Math.max(0, end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
      const expectedTotal = diffDays * (editingRecord.costPerDay || 0);
      if (editingRecord.totalCost !== expectedTotal) {
        setEditingRecord({ ...editingRecord, totalCost: expectedTotal });
      }
    }
  }, [editingRecord?.pickupDate, editingRecord?.returnDate, editingRecord?.costPerDay]);

  const fetchRecords = async () => {
    setFetching(true);
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
      const res = await fetch(`${backendUrl}/api/hire-management?limit=100`);
      if (res.ok) {
        const json = await res.json();
        setRecords(json.data || []);
      }
    } catch (e) {
      console.error("Failed to fetch records", e);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const filteredRecords = records.filter(record => {
    const matchesType = typeFilter === "all" || record.vehicleType === typeFilter;
    const matchesSearch = !searchQuery ||
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
      costPerDay: Number(formData.get("costPerDay")) || 0,
      totalCost: Number(formData.get("totalCost")) || 0,
    };

    console.log("Submitting hire-management record:", data);

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
      const response = await fetch(`${backendUrl}/api/hire-management`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        e.currentTarget.reset();
        setNewRecord({ pickupDate: "", returnDate: "", costPerDay: 0, totalCost: 0 }); // Reset state
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
      costPerDay: Number(formData.get("costPerDay")) || 0,
      totalCost: Number(formData.get("totalCost")) || 0,
      status: formData.get("status"),
    };

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
      const response = await fetch(`${backendUrl}/api/hire-management/${editingRecord.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

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
    
    const reportRecords = records.filter(record => {
      const pDate = new Date(record.pickupDate);
      return pDate.getFullYear() === parseInt(year) && (pDate.getMonth() + 1) === parseInt(month);
    });

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
    const monthName = new Date(parseInt(year), parseInt(month) - 1).toLocaleString('default', { month: 'long' });
    doc.text(`Report Period: ${monthName} ${year}`, 14, 38);
    doc.text(`Generated On: ${new Date().toLocaleString()}`, 14, 44);

    const tableData = reportRecords.map(r => [
      new Date(r.pickupDate).toLocaleDateString(),
      new Date(r.returnDate).toLocaleDateString(),
      r.customerName,
      r.phoneNumber,
      r.vehicleType,
      `Rs. ${r.costPerDay?.toLocaleString()}`,
      `Rs. ${r.totalCost?.toLocaleString()}`
    ]);

    autoTable(doc, {
      startY: 50,
      head: [['Pickup', 'Return', 'Customer', 'Phone', 'Type', 'Cost/Day', 'Total']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: 'bold' },
      styles: { fontSize: 8 },
      alternateRowStyles: { fillColor: [245, 247, 255] }
    });

    doc.save(`Hire_Monthly_Report_${pdfMonth}.pdf`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this record?")) return;
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
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
    <div className="min-h-screen bg-gray-50 p-6 lg:p-12 font-sans">
      <div className="max-w-[1600px] mx-auto bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="p-8 border-b border-gray-100 bg-white flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-gray-900 uppercase italic border-b-4 border-blue-600 inline-block">
              HIRE MANAGEMENT SYSTEM
            </h1>
            <p className="text-gray-500 mt-2 font-medium">Coordinate vehicle rentals, track costs, and manage returns.</p>
          </div>
          <div className="flex items-center gap-4">
           <div className="flex bg-gray-50 border border-gray-100 p-2 px-4 rounded-2xl items-center gap-4 shadow-inner">
               <div className="flex flex-col gap-0.5">
                 <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest pl-1">Monthly Report System</span>
                 <div className="flex items-center gap-3">
                   <input type="month" value={pdfMonth} onChange={e => setPdfMonth(e.target.value)} className="text-[11px] font-extrabold bg-white border border-gray-200 rounded-lg px-2 py-1 focus:ring-2 focus:ring-blue-500 outline-none" />
                   <button onClick={handleDownloadMonthlyPDF} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl transition-all shadow-lg shadow-indigo-500/20 active:scale-95" title="Generate Monthly PDF">
                     <Download className="w-4 h-4" />
                     <span className="text-[10px] font-black uppercase tracking-widest">Get Monthly PDF</span>
                   </button>
                 </div>
               </div>
            </div>
            <button 
              onClick={fetchRecords} 
              className="p-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors flex items-center justify-center shrink-0"
              title="Refresh Data"
            >
              <RefreshCw className={`w-5 h-5 ${fetching ? 'animate-spin text-blue-500' : ''}`} />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="px-8 py-6 bg-gray-50/50 border-b border-gray-100 flex flex-wrap items-center gap-8">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Vehicle Type</span>
            <div className="flex bg-gray-200/50 p-1 rounded-xl w-fit">
              {(["all", "KDH", "CHR", "AQUA"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={`px-5 py-2 rounded-lg text-[11px] font-extrabold uppercase tracking-tight transition-all ${
                    typeFilter === t
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>


          <div className="flex flex-col gap-2 flex-grow max-w-sm">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Search Customer / Phone</span>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Name or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="ml-auto text-[11px] font-black text-gray-400 bg-white px-5 py-3 rounded-2xl border border-gray-100 shadow-sm">
            Hires: <span className="text-blue-600">{filteredRecords.length}</span> <span className="mx-2 opacity-20">|</span> Total: {records.length}
          </div>
        </div>

        {/* Table */}
        <div className="w-full overflow-x-auto">
          <form onSubmit={handleSubmit}>
            <table className="w-full text-left border-collapse min-w-[1400px]">
              <thead>
                <tr className="bg-gray-50/80 text-gray-500 text-[10px] uppercase tracking-widest font-black border-b border-gray-200">
                  <th className="p-4 w-[11%]">Pickup Date</th>
                  <th className="p-4 w-[11%]">Return Date</th>
                  <th className="p-4 w-[11%]">Phone</th>
                  <th className="p-4 w-[12%]">Name</th>
                  <th className="p-4 w-[8%]">Type</th>
                  <th className="p-4 w-[15%]">Description</th>
                  <th className="p-4 w-[10%] text-right">Cost/Day (Rs)</th>
                  <th className="p-4 w-[10%] text-right font-bold text-gray-900">Total (Rs)</th>
                  <th className="p-4 w-[8%] text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {/* Insert Row */}
                <tr className="bg-blue-50/30">
                  <td className="p-2 align-top">
                    <input
                      required
                      name="pickupDate"
                      type="date"
                      value={newRecord.pickupDate}
                      onChange={(e) => setNewRecord({ ...newRecord, pickupDate: e.target.value })}
                      className="w-full px-2 py-2.5 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-500 outline-none text-xs"
                    />
                  </td>
                  <td className="p-2 align-top">
                    <input
                      required
                      name="returnDate"
                      type="date"
                      value={newRecord.returnDate}
                      onChange={(e) => setNewRecord({ ...newRecord, returnDate: e.target.value })}
                      className="w-full px-2 py-2.5 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-500 outline-none text-xs"
                    />
                  </td>
                  <td className="p-2 align-top"><input required name="phoneNumber" type="text" placeholder="077..." className="w-full px-2 py-2.5 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-500 outline-none text-xs" /></td>
                  <td className="p-2 align-top"><input required name="customerName" type="text" placeholder="Name..." className="w-full px-2 py-2.5 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-500 outline-none text-xs" /></td>
                  <td className="p-2 align-top">
                    <select name="vehicleType" className="w-full px-2 py-2.5 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-500 outline-none text-xs font-bold uppercase">
                      <option value="KDH">KDH</option>
                      <option value="CHR">CHR</option>
                      <option value="AQUA">AQUA</option>
                    </select>
                  </td>
                  <td className="p-2 align-top"><input name="description" type="text" placeholder="Details..." className="w-full px-2 py-2.5 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-500 outline-none text-xs" /></td>
                  <td className="p-2 align-top">
                    <input
                      required
                      name="costPerDay"
                      type="number"
                      placeholder="0"
                      value={newRecord.costPerDay || ""}
                      onChange={(e) => setNewRecord({ ...newRecord, costPerDay: Number(e.target.value) })}
                      className="w-full px-2 py-2.5 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-500 outline-none text-xs text-right"
                    />
                  </td>
                  <td className="p-2 align-top">
                    <input
                      required
                      name="totalCost"
                      type="number"
                      value={newRecord.totalCost}
                      readOnly
                      className="w-full px-2 py-2.5 rounded-lg border border-blue-100 bg-blue-100/30 text-xs text-right font-black text-blue-700 outline-none cursor-not-allowed"
                    />
                  </td>
                  <td className="p-2 align-top text-center pt-3">
                    <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-[10px] font-black uppercase hover:bg-blue-700 shadow-md transition-all active:scale-95 disabled:opacity-50">
                      {loading ? "..." : "Add Hire"}
                    </button>
                  </td>
                </tr>

                {/* List Data */}
                {fetching && records.length === 0 ? (
                  <tr><td colSpan={9} className="p-12 text-center text-gray-400 font-bold uppercase tracking-widest text-xs italic">Syncing with database...</td></tr>
                ) : filteredRecords.length === 0 ? (
                  <tr><td colSpan={9} className="p-12 text-center text-gray-400 font-bold uppercase tracking-widest text-xs italic">No matching hire records found.</td></tr>
                ) : (
                  filteredRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50/80 transition-colors group text-xs">
                      <td className="p-4 text-gray-500 align-middle">
                        {record.pickupDate ? new Date(record.pickupDate).toLocaleDateString() : "-"}
                      </td>
                      <td className="p-4 text-gray-500 align-middle">
                        {record.returnDate ? new Date(record.returnDate).toLocaleDateString() : "-"}
                      </td>
                      <td className="p-4 text-gray-900 font-medium align-middle">{record.phoneNumber}</td>
                      <td className="p-4 text-gray-900 font-bold align-middle uppercase">{record.customerName}</td>
                      <td className="p-4 align-middle">
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md font-black text-[10px] uppercase border border-gray-200 tracking-tighter">
                          {record.vehicleType}
                        </span>
                      </td>
                      <td className="p-4 text-gray-500 truncate max-w-[150px] align-middle" title={record.description}>{record.description || "-"}</td>
                      <td className="p-4 text-gray-700 text-right align-middle">Rs. {record.costPerDay?.toLocaleString()}</td>
                      <td className="p-4 text-blue-600 font-black text-right align-middle">Rs. {record.totalCost?.toLocaleString()}</td>
                      <td className="p-4 text-center align-middle">
                        <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => setEditingRecord(record)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-md border border-transparent hover:border-blue-100"><Pencil className="w-3.5 h-3.5" /></button>
                          <button onClick={() => handleDelete(record.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-md border border-transparent hover:border-red-100"><Trash2 className="w-3.5 h-3.5" /></button>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden border border-white/20 animate-in slide-in-from-bottom-8 duration-300">
            <div className="px-8 py-6 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black italic uppercase tracking-tight">Edit Hire</h2>
                <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest">Update existing vehicle rental details</p>
              </div>
              <button onClick={() => setEditingRecord(null)} className="p-2 hover:bg-white rounded-full transition-colors text-gray-400 hover:text-gray-900 border border-transparent hover:border-gray-100"><X className="w-6 h-6" /></button>
            </div>

            <form onSubmit={handleUpdate} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Pickup Date</label>
                  <input name="pickupDate" type="date" value={editingRecord.pickupDate ? (typeof editingRecord.pickupDate === 'string' ? editingRecord.pickupDate.split('T')[0] : new Date(editingRecord.pickupDate).toISOString().split('T')[0]) : ""} onChange={(e) => setEditingRecord({...editingRecord, pickupDate: e.target.value})} className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-blue-500 outline-none font-bold text-sm bg-gray-50/30" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Return Date</label>
                  <input name="returnDate" type="date" value={editingRecord.returnDate ? (typeof editingRecord.returnDate === 'string' ? editingRecord.returnDate.split('T')[0] : new Date(editingRecord.returnDate).toISOString().split('T')[0]) : ""} onChange={(e) => setEditingRecord({...editingRecord, returnDate: e.target.value})} className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-blue-500 outline-none font-bold text-sm bg-gray-50/30" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Customer Name</label>
                  <input required name="customerName" defaultValue={editingRecord.customerName} type="text" className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-blue-500 outline-none font-bold text-sm bg-gray-50/30" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Phone Number</label>
                  <input required name="phoneNumber" defaultValue={editingRecord.phoneNumber} type="text" className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-blue-500 outline-none font-bold text-sm bg-gray-50/30" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Vehicle Type</label>
                  <select name="vehicleType" defaultValue={editingRecord.vehicleType} className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-blue-500 outline-none font-bold text-sm bg-gray-50/30 appearance-none uppercase">
                    <option value="KDH">KDH</option>
                    <option value="CHR">CHR</option>
                    <option value="AQUA">AQUA</option>
                  </select>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Description</label>
                  <textarea name="description" defaultValue={editingRecord.description} rows={2} className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-blue-500 outline-none font-bold text-sm bg-gray-50/30 resize-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Cost Per Day</label>
                  <input name="costPerDay" value={editingRecord.costPerDay || ""} type="number" onChange={(e) => setEditingRecord({...editingRecord, costPerDay: Number(e.target.value)})} className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-blue-500 outline-none font-bold text-sm bg-gray-50/30" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Total Cost (RS)</label>
                  <input name="totalCost" value={editingRecord.totalCost || 0} type="number" readOnly className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 bg-blue-50/50 text-blue-700 outline-none font-black text-sm cursor-not-allowed" />
                </div>
              </div>

              <div className="pt-6 flex justify-end gap-4">
                <button type="button" onClick={() => setEditingRecord(null)} className="px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-gray-500 hover:bg-gray-100 transition-all">Cancel</button>
                <button type="submit" disabled={loading} className="px-8 py-3 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50">
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
