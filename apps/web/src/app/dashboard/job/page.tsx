"use client";

import { deleteJob } from "@/features/job/actions/delete.action";
import { EditJobDialog } from "@/features/job/components/edit-job-dialog";
import { JobsList } from "@/features/job/components/job-list";
import { JobMapView } from "@/features/job/components/job-map-view";
import { NewJob } from "@/features/job/components/new-job";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// Dummy fetch for jobs (replace with your real API call)
async function fetchJobs(page: string, search: string, status?: string) {
  const url =
    status && status !== "__all__"
      ? `/api/job/by-status?status=${encodeURIComponent(status)}&page=${page}&search=${encodeURIComponent(search)}`
      : `/api/job/by-status?page=${page}&search=${encodeURIComponent(search)}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.data || [];
}

function JobsTable({ page, search, jobs, setJobs, loading }: any) {
  const STATUS_OPTIONS = [
    { label: "All", value: "__all__" },
    { label: "Initiated", value: "Initiated" },
    { label: "Quotation", value: "Quotation" },
    { label: "Approved", value: "Approved" },
    { label: "In Progress", value: "In Progress" },
    { label: "Completed", value: "Completed" },
    { label: "Invoiced", value: "Invoiced" },
  ];

  const [status, setStatus] = useState("__all__");
  const router = useRouter();

  useEffect(() => {
    setJobs([]);
    fetchJobs(page, search, status).then(setJobs);
    // eslint-disable-next-line
  }, [status, page, search]);

  // Delete handler
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await deleteJob(id);
      setJobs((prev: any[]) => prev.filter((job) => job.id !== id));
      toast.success("Job deleted");
    } catch (e) {
      toast.error("Failed to delete job");
    }
  };

  // Update handler: after editing, update the job in the table
  const handleUpdate = (updatedJob: any) => {
    setJobs((prev: any[]) =>
      prev.map((job) => (job.id === updatedJob.id ? updatedJob : job))
    );
  };

  return (
    <div className="border rounded bg-white p-4">
      {/* Status Filter Tabs */}
      <div className="flex gap-2 mb-4">
        {STATUS_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setStatus(opt.value)}
            className={
              (status === opt.value
                ? "bg-cyan-600 text-white"
                : "bg-cyan-100 text-cyan-700 hover:bg-cyan-200") +
              " px-4 py-2 rounded-full font-medium transition-colors"
            }
            style={{ minWidth: 80 }}
          >
            {opt.label}
          </button>
        ))}
      </div>
      {/* Table header */}
      <div className="grid grid-cols-6 font-semibold border-b pb-2 mb-2">
        <div>Job Title</div>
        <div>Job Number</div>
        <div>Status</div>
        <div>Priority</div>
        <div>Due Date</div>
        <div>Actions</div>
      </div>
      {/* Table rows */}
      {loading ? (
        <div className="text-center text-muted-foreground py-8 col-span-6">
          Loading...
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center text-muted-foreground py-8 col-span-6">
          No jobs found.
        </div>
      ) : (
        jobs.map((job: any) => (
          <div
            key={job.id}
            className="grid grid-cols-6 items-center border-b py-2"
          >
            <div>
              <span className="font-medium">{job.jobTitle}</span>
              <div className="text-xs text-muted-foreground">
                {job.address?.formattedAddress}
              </div>
            </div>
            <div>{job.jobNumber}</div>
            <div>{job.status}</div>
            <div>{job.priority}</div>
            <div>
              {job.dueDate ? new Date(job.dueDate).toLocaleDateString() : "-"}
            </div>
            <div>
              <div className="flex gap-2">
                <EditJobDialog job={job} onUpdate={handleUpdate} />
                <button
                  className="px-2 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200 transition"
                  onClick={() => handleDelete(job.id)}
                  title="Delete"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

interface PageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
  }>;
}

export default async function JobPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const { page = "1", search = "" } = resolvedSearchParams;
  const [view, setView] = useState<"card" | "table" | "map">("card");
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchJobs(page, search).then((data) => {
      setJobs(data);
      setLoading(false);
    });
  }, [page, search]);

  return (
    <div className="container mx-auto py-8 px-3 max-w-5xl">
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Job Listings</h1>
          <p className="text-muted-foreground mt-1">
            Manage all the job listings
          </p>
        </div>
        <NewJob />
      </div>

      {/* View Switcher - now aligned left */}
      <div className="flex gap-2 mb-6 justify-start">
        <button
          className={`px-4 py-2 rounded font-medium border transition ${
            view === "card"
              ? "bg-cyan-600 text-white border-cyan-600"
              : "bg-white text-cyan-700 border-cyan-200 hover:bg-cyan-50"
          }`}
          onClick={() => setView("card")}
        >
          Card View
        </button>
        <button
          className={`px-4 py-2 rounded font-medium border transition ${
            view === "table"
              ? "bg-cyan-600 text-white border-cyan-600"
              : "bg-white text-cyan-700 border-cyan-200 hover:bg-cyan-50"
          }`}
          onClick={() => setView("table")}
        >
          Table View
        </button>
        <button
          className={`px-4 py-2 rounded font-medium border transition ${
            view === "map"
              ? "bg-cyan-600 text-white border-cyan-600"
              : "bg-white text-cyan-700 border-cyan-200 hover:bg-cyan-50"
          }`}
          onClick={() => setView("map")}
        >
          Map View
        </button>
      </div>

      {view === "card" ? (
        <JobsList page={page} search={search} />
      ) : view === "table" ? (
        <JobsTable
          page={page}
          search={search}
          jobs={jobs}
          setJobs={setJobs}
          loading={loading}
        />
      ) : (
        <JobMapView jobs={jobs} />
      )}
    </div>
  );
}
