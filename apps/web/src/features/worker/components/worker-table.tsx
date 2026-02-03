"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@repo/ui/components/alert-dialog";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { ArrowUpDownIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { deleteWorker } from "../actions/delete.action";
import type { Worker } from "../schemas";
import { EditWorkerDialog } from "./edit-worker-dialog";
import { WorkerPagination } from "./worker-pagination";

interface WorkerTableProps {
  workers: Worker[];
  currentPage: number;
  totalPages: number;
}

export function WorkerTable({
  workers,
  currentPage,
  totalPages,
}: WorkerTableProps) {
  const [sortBy, setSortBy] = useState<
    "name" | "email" | "availability" | "status"
  >("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState<string | null>(null);

  // Sorting logic
  const safeWorkers: Worker[] = Array.isArray(workers) ? workers : [];
  const sortedWorkers = [...safeWorkers].sort((a, b) => {
    let aVal: string = "";
    let bVal: string = "";
    if (sortBy === "status") {
      aVal = ((a as any).status || "").toString().toLowerCase();
      bVal = ((b as any).status || "").toString().toLowerCase();
    } else {
      aVal = (a[sortBy as keyof typeof a] || "").toString().toLowerCase();
      bVal = (b[sortBy as keyof typeof b] || "").toString().toLowerCase();
    }
    if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  // Status badge color
  const getStatusBadge = (status?: string) => {
    if (!status || status === "active")
      return (
        <Badge className="bg-green-100 text-green-700 border-green-200">
          Active
        </Badge>
      );
    if (status === "pending")
      return (
        <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
          Pending
        </Badge>
      );
    if (status === "rejected")
      return (
        <Badge className="bg-red-100 text-red-700 border-red-200">
          Rejected
        </Badge>
      );
    return (
      <Badge className="bg-gray-100 text-gray-700 border-gray-200">
        {status}
      </Badge>
    );
  };

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(id);
      await deleteWorker(id);
      // Optionally trigger a refresh or callback
    } catch (error) {
      // Handle error
    } finally {
      setIsDeleting(null);
      setShowDeleteDialog(null);
    }
  };

  return (
    <div className="overflow-x-auto w-full">
      <table className="min-w-full divide-y divide-gray-200 bg-white rounded-lg shadow-sm">
        <thead className="bg-gray-50">
          <tr>
            <th
              className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer select-none"
              onClick={() => {
                setSortBy("name");
                setSortDir(
                  sortBy === "name" && sortDir === "asc" ? "desc" : "asc"
                );
              }}
            >
              <div className="flex items-center gap-1">
                Name
                <ArrowUpDownIcon className="h-4 w-4 text-gray-400" />
              </div>
            </th>
            <th
              className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer select-none"
              onClick={() => {
                setSortBy("email");
                setSortDir(
                  sortBy === "email" && sortDir === "asc" ? "desc" : "asc"
                );
              }}
            >
              <div className="flex items-center gap-1">
                Email
                <ArrowUpDownIcon className="h-4 w-4 text-gray-400" />
              </div>
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Phone
            </th>
            <th
              className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer select-none"
              onClick={() => {
                setSortBy("availability");
                setSortDir(
                  sortBy === "availability" && sortDir === "asc"
                    ? "desc"
                    : "asc"
                );
              }}
            >
              <div className="flex items-center gap-1">
                Availability
                <ArrowUpDownIcon className="h-4 w-4 text-gray-400" />
              </div>
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Notes
            </th>
            <th
              className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer select-none"
              onClick={() => {
                setSortBy("status");
                setSortDir(
                  sortBy === "status" && sortDir === "asc" ? "desc" : "asc"
                );
              }}
            >
              <div className="flex items-center gap-1">
                Status
                <ArrowUpDownIcon className="h-4 w-4 text-gray-400" />
              </div>
            </th>
            <th className="px-4 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider text-center">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {sortedWorkers.map((worker) => (
            <tr key={worker.id} className="hover:bg-cyan-50 transition group">
              <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900">
                {worker.name}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-gray-700">
                {worker.email}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-gray-700">
                {worker.phoneNumber}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-gray-700">
                {worker.availability}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-gray-700 max-w-xs truncate">
                {worker.notes}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                {getStatusBadge((worker as any).status)}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-center">
                <div className="flex items-center gap-2 justify-center">
                  <EditWorkerDialog worker={worker} />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="hover:bg-red-100 hover:text-red-600"
                    onClick={() => setShowDeleteDialog(String(worker.id))}
                    disabled={isDeleting === String(worker.id)}
                    aria-label="Delete"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                  <AlertDialog
                    open={showDeleteDialog === String(worker.id)}
                    onOpenChange={() => setShowDeleteDialog(null)}
                  >
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete the worker "{worker.name}
                          ". This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel
                          disabled={isDeleting === String(worker.id)}
                        >
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(String(worker.id))}
                          disabled={isDeleting === String(worker.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          {isDeleting === String(worker.id)
                            ? "Deleting..."
                            : "Delete Worker"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4">
        <WorkerPagination currentPage={currentPage} totalPages={totalPages} />
      </div>
    </div>
  );
}
