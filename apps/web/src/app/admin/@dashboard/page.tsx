// "use client";

// import { ProductGrid } from "@/components/shop/ProductGrid";
// import { MOCK_PRODUCTS } from "@/lib/shop-data";
// import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/card";
// import { IconChartBar, IconMessage2, IconShoppingCart, IconTrendingUp, IconUsers } from "@tabler/icons-react";

// export default function AdminDashboardPage() {
//   const recentProducts = MOCK_PRODUCTS.slice(0, 4);

//   return (
//     <div className="flex-1 space-y-8 p-8 pt-6">
//       <div className="flex items-center justify-between space-y-2">
//         <div className="space-y-1">
//           <h2 className="text-4xl font-heading font-black tracking-tighter italic uppercase">Master Control.</h2>
//           <p className="text-muted-foreground font-medium italic">Welcome back, Administrator. Here's your shop's heartbeat.</p>
//         </div>
//       </div>

//       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
//         {[
//           { title: "Total Revenue", value: "$452,231", icon: IconChartBar, trend: "+12.5%", color: "text-emerald-500" },
//           { title: "Active Visionaries", value: "24,562", icon: IconUsers, trend: "+18%", color: "text-blue-500" },
//           { title: "Pending Orders", value: "42", icon: IconShoppingCart, trend: "-4%", color: "text-amber-500" },
//           { title: "Positive Signal", value: "98.2%", icon: IconMessage2, trend: "+2.1%", color: "text-rose-500" },
//         ].map((stat, i) => (
//           <Card key={i} className="rounded-[32px] border-none shadow-[0_20px_50px_rgba(0,0,0,0.02)] bg-white/80 backdrop-blur-md ring-1 ring-black/5 hover:scale-[1.02] transition-all cursor-default group">
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
//               <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">{stat.title}</CardTitle>
//               <div className={`h-10 w-10 rounded-xl bg-secondary flex items-center justify-center ${stat.color} group-hover:rotate-12 transition-transform`}>
//                  <stat.icon className="h-5 w-5" />
//               </div>
//             </CardHeader>
//             <CardContent>
//               <div className="text-3xl font-heading font-black italic">{stat.value}</div>
//               <p className={`text-xs font-bold mt-2 ${stat.trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
//                 {stat.trend} <span className="text-muted-foreground/60 font-medium">from last cycle</span>
//               </p>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       <div className="grid gap-8 md:grid-cols-7">
//         <Card className="col-span-4 rounded-[40px] border-none shadow-[0_20px_50px_rgba(0,0,0,0.02)] bg-white/80 backdrop-blur-md ring-1 ring-black/5 p-8">
//            <div className="flex items-center justify-between mb-8">
//               <div className="space-y-1">
//                 <h3 className="text-xl font-heading font-black italic uppercase tracking-tight">Performance Velocity.</h3>
//                 <p className="text-sm text-muted-foreground italic">Market engagement over the last 30 days.</p>
//               </div>
//               <div className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-full">
//                 <IconTrendingUp className="w-4 h-4 text-emerald-500" />
//                 <span className="text-xs font-black">STABLE</span>
//               </div>
//            </div>
//            {/* Mock area for a chart */}
//            <div className="h-[300px] w-full bg-secondary/30 rounded-[32px] border-2 border-dashed border-black/5 flex items-center justify-center text-muted-foreground font-bold italic">
//               Quantum Chart Synthesis in Progress...
//            </div>
//         </Card>

//         <Card className="col-span-3 rounded-[40px] border-none shadow-[0_20px_50px_rgba(0,0,0,0.02)] bg-neutral-900 text-white p-8">
//            <div className="space-y-1 mb-8">
//               <h3 className="text-xl font-heading font-black italic uppercase tracking-tight text-primary">System Feed.</h3>
//               <p className="text-sm text-white/40 italic">Real-time operational updates.</p>
//            </div>
//            <div className="space-y-6">
//               {[
//                 { type: "ORDER", msg: "New order #8241 from Tokyo, JP", time: "2m ago" },
//                 { type: "SYSTEM", msg: "AI model optimization complete", time: "14m ago" },
//                 { type: "USER", msg: "New staff member assigned to Logistics", time: "1h ago" },
//                 { type: "ALERT", msg: "Stock low on 'Oxide' Collection", time: "3h ago" },
//               ].map((log, i) => (
//                 <div key={i} className="flex items-start gap-4 group cursor-help">
//                    <div className="h-2 w-2 rounded-full bg-primary mt-2 group-hover:scale-150 transition-all" />
//                    <div className="space-y-1">
//                       <p className="text-sm font-bold text-white/90">{log.msg}</p>
//                       <div className="flex items-center gap-2">
//                         <span className="text-[10px] font-black text-white/30 tracking-widest uppercase">{log.type}</span>
//                         <span className="text-[10px] text-white/20">•</span>
//                         <span className="text-[10px] text-white/20 font-medium">{log.time}</span>
//                       </div>
//                    </div>
//                 </div>
//               ))}
//            </div>
//         </Card>
//       </div>

//       <div className="space-y-6">
//          <div className="flex items-center justify-between px-2">
//             <h3 className="text-2xl font-heading font-black italic uppercase tracking-tight">Newest Inventory.</h3>
//             <span className="text-xs font-bold text-primary cursor-pointer hover:underline">Manage All Inventory →</span>
//          </div>
//          <ProductGrid products={recentProducts} />
//       </div>
//     </div>
//   );
// }


"use client";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Calendar, Download, Pencil, Plus, RefreshCw, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function MaterialManagementPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [statusFilter, setStatusFilter] = useState<"all" | "complete" | "incomplete">("all");
  const [searchDate, setSearchDate] = useState("");
  const [editingRecord, setEditingRecord] = useState<any | null>(null);

  // PDF Search Month
  const [pdfMonth, setPdfMonth] = useState("");

  const filteredRecords = records.filter(record => {
    const matchesStatus = statusFilter === "all" || record.status === statusFilter;

    // Check if the YYYY-MM-DD input matches the local date string
    const matchesDate = !searchDate || (record.date && new Date(record.date).toISOString().split('T')[0] === searchDate);

    return matchesStatus && matchesDate;
  });

  const fetchRecords = async () => {
    setFetching(true);
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
      const res = await fetch(`${backendUrl}/api/matirial-management?limit=100`);
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      location: formData.get("location"),
      description: formData.get("description"),
      advance: Number(formData.get("advance")) || 0,
      total: Number(formData.get("total")) || 0,
      status: formData.get("status") || "incomplete",
    };

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
      const response = await fetch(`${backendUrl}/api/matirial-management`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        e.currentTarget.reset();
        await fetchRecords(); // Refresh the list
        window.location.reload(); // Auto refresh page as requested
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("Add failed:", response.status, errorData);
        alert(`Failed to add record: ${response.status}. ${JSON.stringify(errorData)}`);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Network error. Please ensure the API (Port 8000) is running and CORS is allowed.");
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
    const reportDate = new Date(parseInt(year), parseInt(month) - 1);

    const reportRecords = records.filter(record => {
      const rDate = new Date(record.date);
      return rDate.getFullYear() === reportDate.getFullYear() && rDate.getMonth() === reportDate.getMonth();
    });

    if (reportRecords.length === 0) {
      alert(`No records found for the month: ${pdfMonth}`);
      return;
    }

    const doc = new jsPDF();

    // Header
    doc.setFontSize(22);
    doc.setTextColor(37, 99, 235);
    doc.text("Nimesh Business Management", 14, 20);

    doc.setFontSize(16);
    doc.setTextColor(100);
    doc.text("Building Material Monthly Report", 14, 30);

    doc.setFontSize(10);
    const monthName = reportDate.toLocaleString('default', { month: 'long' });
    doc.text(`Report Period: ${monthName} ${year}`, 14, 38);
    doc.text(`Generated On: ${new Date().toLocaleString()}`, 14, 44);

    const tableData = reportRecords.map(r => [
      new Date(r.date).toLocaleDateString(),
      r.location || "-",
      r.description || "-",
      `Rs. ${r.advance?.toLocaleString() || "0"}`,
      `Rs. ${r.total?.toLocaleString() || "0"}`,
      r.status.toUpperCase()
    ]);

    autoTable(doc, {
      startY: 50,
      head: [['Date', 'Location', 'Description', 'Advance', 'Total', 'Status']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: 'bold' },
      styles: { fontSize: 7 },
      alternateRowStyles: { fillColor: [245, 247, 255] }
    });

    doc.save(`Material_Monthly_Report_${pdfMonth}.pdf`);
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingRecord) return;
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const updates = {
      date: formData.get("date"),
      location: formData.get("location"),
      description: formData.get("description"),
      advance: Number(formData.get("advance")) || 0,
      total: Number(formData.get("total")) || 0,
      status: formData.get("status"),
    };

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
      const response = await fetch(`${backendUrl}/api/matirial-management/${editingRecord.id}`, {
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

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this record?")) return;
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
      const response = await fetch(`${backendUrl}/api/matirial-management/${id}`, {
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
      <div className="max-w-[1400px] mx-auto bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-white/5 overflow-hidden">
        {/* Header */}
        <div className="p-8 border-b border-gray-100 dark:border-white/5 bg-white dark:bg-gray-900 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white uppercase">
              BUILDING MATERIAL MANAGEMENT
            </h1>
            <p className="text-gray-500 mt-1 font-medium">Quickly add and track material orders here.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 p-2 px-4 rounded-2xl items-center gap-4 shadow-inner">
               <div className="flex flex-col gap-0.5">
                 <span className="text-[9px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest pl-1">Monthly Report System</span>
                 <div className="flex items-center gap-3">
                   <input type="month" value={pdfMonth} onChange={e => setPdfMonth(e.target.value)} className="text-[11px] font-extrabold bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 rounded-lg px-2 py-1 focus:ring-2 focus:ring-blue-500 outline-none" />
                   <button onClick={handleDownloadMonthlyPDF} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl transition-all shadow-lg shadow-indigo-500/20 active:scale-95" title="Generate Monthly PDF">
                     <Download className="w-4 h-4" />
                   </button>
                 </div>
               </div>
            </div>
            <button
              onClick={fetchRecords}
              className="p-3 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-white rounded-full transition-colors flex items-center justify-center shrink-0"
              title="Refresh Data"
            >
              <RefreshCw className={`w-5 h-5 ${fetching ? 'animate-spin text-blue-500' : ''}`} />
            </button>
          </div>
        </div>
        {/* Filtering & Search Section */}
        <div className="px-8 py-6 bg-gray-50/50 dark:bg-gray-800/20 border-b border-gray-100 dark:border-white/5 flex flex-wrap items-center gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-1">Status Filter</span>
            <div className="flex bg-gray-200/50 dark:bg-white/5 p-1 rounded-xl w-fit">
              {(["all", "complete", "incomplete"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-5 py-2 rounded-lg text-[11px] font-extrabold uppercase tracking-tight transition-all ${
                    statusFilter === s
                      ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm"
                      : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="h-10 w-px bg-gray-200 dark:bg-white/10 self-end mb-1 mx-2 hidden lg:block" />

          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-1">Filter By Date</span>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="date"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                className="pl-9 pr-4 py-2.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="ml-auto flex items-end h-full pt-6">
            <div className="text-[11px] font-bold text-gray-400 dark:text-gray-500 bg-white dark:bg-gray-800 px-4 py-2 rounded-full border border-gray-100 dark:border-white/5 shadow-sm">
              RESULTS: <span className="text-blue-600 dark:text-blue-400 font-black ml-1">{filteredRecords.length}</span> <span className="mx-1 opacity-20">/</span> {records.length}
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="w-full overflow-x-auto">
          <form onSubmit={handleSubmit}>
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-gray-50/80 dark:bg-white/5 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider font-bold border-b border-gray-200 dark:border-white/5">
                  <th className="p-4 w-[15%]">Date</th>
                  <th className="p-4 w-[15%]">Location</th>
                  <th className="p-4 w-[25%]">Description</th>
                  <th className="p-4 w-[12%]">Advance (Rs)</th>
                  <th className="p-4 w-[12%]">Total (Rs) *</th>
                  <th className="p-4 w-[12%]">Status</th>
                  <th className="p-4 w-[8%] text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {/* INLINE INSERT ROW */}
                <tr className="bg-blue-50/40 dark:bg-blue-900/10">
                  <td className="p-3 align-top italic text-gray-400 dark:text-gray-600 text-xs text-center py-5">
                    Auto
                  </td>
                  <td className="p-3 align-top">
                    <input name="location" type="text" placeholder="Location..." className="w-full px-3 py-2.5 rounded-lg border border-blue-200 dark:border-blue-900/30 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                  </td>
                  <td className="p-3 align-top">
                    <input name="description" type="text" placeholder="Details..." className="w-full px-3 py-2.5 rounded-lg border border-blue-200 dark:border-blue-900/30 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                  </td>
                  <td className="p-3 align-top">
                    <input name="advance" type="number" placeholder="0" className="w-full px-3 py-2.5 rounded-lg border border-blue-200 dark:border-blue-900/30 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                  </td>
                  <td className="p-3 align-top">
                    <input required name="total" type="number" placeholder="0" className="w-full px-3 py-2.5 rounded-lg border border-blue-200 dark:border-blue-900/30 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                  </td>
                  <td className="p-3 align-top">
                    <select name="status" className="w-full px-3 py-2.5 rounded-lg border border-blue-200 dark:border-blue-900/30 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium">
                      <option value="incomplete">Incomplete</option>
                      <option value="complete">Complete</option>
                    </select>
                  </td>
                  <td className="p-3 align-top text-right">
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex w-full items-center justify-center px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 shadow-sm"
                    >
                      {loading ? "..." : <><Plus className="w-4 h-4 mr-1" /> Add</>}
                    </button>
                  </td>
                </tr>

                  {fetching && records.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-12 text-center text-gray-400 dark:text-gray-600 font-medium tracking-wide">Loading records...</td>
                  </tr>
                ) : filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-12 text-center text-gray-400 dark:text-gray-600 font-medium tracking-wide">
                      {records.length === 0 ? "No records found. Add your first record above." : `No ${statusFilter} records found.`}
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group text-sm">
                      <td className="p-4 text-gray-500 dark:text-gray-400 align-middle">
                        {record.date ? new Date(record.date).toLocaleDateString() : "-"}
                      </td>
                      <td className="p-4 text-gray-600 dark:text-gray-300 align-middle">
                        {record.location || "-"}
                      </td>
                      <td className="p-4 text-gray-600 dark:text-gray-300 max-w-[200px] truncate align-middle" title={record.description}>
                        {record.description || "-"}
                      </td>
                      <td className="p-4 text-gray-800 dark:text-gray-200 font-medium align-middle">
                        {record.advance ? `Rs. ${record.advance.toLocaleString()}` : "-"}
                      </td>
                      <td className="p-4 text-gray-900 dark:text-white font-bold align-middle">
                        Rs. {record.total?.toLocaleString() || "0"}
                      </td>
                      <td className="p-4 align-middle">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          record.status === 'complete'
                            ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
                            : 'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                        }`}>
                          {record.status}
                        </span>
                      </td>
                      <td className="p-4 text-right align-middle">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={() => setEditingRecord(record)}
                            className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 rounded-lg transition-colors border border-transparent hover:border-blue-100 dark:hover:border-blue-800"
                            title="Edit Record"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(record.id)}
                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 rounded-lg transition-colors border border-transparent hover:border-red-100 dark:hover:border-red-800"
                            title="Delete Record"
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
          </form>
        </div>
      </div>

      {/* EDIT MODAL */}
      {editingRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden border border-white/20 dark:border-white/5 animate-in slide-in-from-bottom-8 duration-300">
            <div className="px-8 py-6 bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black italic uppercase tracking-tight text-gray-900 dark:text-white">Edit Record</h2>
                <p className="text-xs font-bold text-gray-400 dark:text-gray-500 mt-1 uppercase tracking-widest">Update material management details</p>
              </div>
              <button
                onClick={() => setEditingRecord(null)}
                className="p-2 hover:bg-white dark:hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-gray-900 dark:hover:text-white shadow-sm border border-transparent hover:border-gray-100 dark:hover:border-white/10"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="p-8 space-y-6 text-gray-900 dark:text-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-1">Location</label>
                  <input name="location" defaultValue={editingRecord.location} type="text" className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 dark:border-white/10 focus:border-blue-500 outline-none font-bold text-sm bg-gray-50/30 dark:bg-white/5" />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-1">Description</label>
                  <textarea name="description" defaultValue={editingRecord.description} rows={3} className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 dark:border-white/10 focus:border-blue-500 outline-none font-bold text-sm bg-gray-50/30 dark:bg-white/5 resize-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-1">Advance Amount</label>
                  <input name="advance" defaultValue={editingRecord.advance} type="number" className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 dark:border-white/10 focus:border-blue-500 outline-none font-bold text-sm bg-gray-50/30 dark:bg-white/5" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-1">Total Amount</label>
                  <input required name="total" defaultValue={editingRecord.total} type="number" className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 dark:border-white/10 focus:border-blue-500 outline-none font-bold text-sm bg-gray-50/30 dark:bg-white/5" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-1">Record Date</label>
                  <input name="date" defaultValue={editingRecord.date ? new Date(editingRecord.date).toISOString().split('T')[0] : ""} type="date" className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 dark:border-white/10 focus:border-blue-500 outline-none font-bold text-sm bg-gray-50/30 dark:bg-white/5" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-1">Status</label>
                  <select name="status" defaultValue={editingRecord.status} className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 dark:border-white/10 focus:border-blue-500 outline-none font-bold text-sm bg-gray-50/30 dark:bg-white/5 appearance-none">
                    <option value="incomplete">INCOMPLETE</option>
                    <option value="complete">COMPLETE</option>
                  </select>
                </div>
              </div>

              <div className="pt-6 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setEditingRecord(null)}
                  className="px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-gray-500 hover:bg-gray-100 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50"
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
