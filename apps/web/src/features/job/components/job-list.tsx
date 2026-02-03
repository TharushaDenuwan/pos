"use client";
import { Card, CardContent } from "@repo/ui/components/card";
import { useEffect, useState } from "react";
import { JobCard } from "./job-card";
import { JobPagination } from "./job-pagination";

const STATUS_OPTIONS = [
  { label: "All", value: "__all__" },
  { label: "Initiated", value: "Initiated" },
  { label: "Quotation", value: "Quotation" },
  { label: "Approved", value: "Approved" },
  { label: "In Progress", value: "In Progress" },
  { label: "Completed", value: "Completed" },
  { label: "Invoiced", value: "Invoiced" },
];

export interface JobPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  // other props if any
}

export function JobsList() {
  const [status, setStatus] = useState("__all__");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function fetchJobs() {
      setLoading(true);
      const url =
        status && status !== "__all__"
          ? `/api/job/by-status?status=${encodeURIComponent(status)}&page=${currentPage}`
          : `/api/job/by-status?page=${currentPage}`;
      const res = await fetch(url);
      const data = await res.json();
      setJobs(data.data || []);
      setTotalPages(data.meta?.totalPages || 1);
      setLoading(false);
    }
    fetchJobs();
  }, [status, currentPage]);

  return (
    <div className="space-y-6">
      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="w-full overflow-x-auto">
          <div className="flex gap-2">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  setStatus(opt.value);
                  setCurrentPage(1);
                }}
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
        </div>
        <div className="text-sm text-muted-foreground">
          {jobs.length} {jobs.length === 1 ? "listing" : "listings"} found
        </div>
      </div>

      {/* Job List */}
      {loading ? (
        <div>Loading...</div>
      ) : jobs.length === 0 ? (
        <Card className="bg-cyan-50 border-none">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-cyan-100 p-3 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-cyan-600"
              >
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No listings found
            </h3>
            <p className="text-muted-foreground max-w-sm">
              Create a new listing to get started.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {jobs.map((job: any) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}

      {/* Pagination */}
      <JobPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
