"use client";
import { TrashIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

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
import { Avatar, AvatarFallback } from "@repo/ui/components/avatar";
import { Button } from "@repo/ui/components/button";
import { Card } from "@repo/ui/components/card";
import { useId } from "react";
import { deleteWorker } from "../actions/delete.action";
import type { Worker } from "../schemas";
import { EditWorkerDialog } from "./edit-worker-dialog";

type Props = {
  worker: Worker;
};

export function WorkerCard({ worker }: Props) {
  const id = useId();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Default avatar fallback (no image field in worker schema)
  const displayName = worker.name || "Worker";

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteWorker(String(worker.id));
      toast.success("Worker listing deleted successfully");
    } catch (error) {
      console.error("Failed to delete worker:", error);
      toast.error("Failed to delete worker listing");
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <>
      <Card
        key={id}
        className="transition-all hover:shadow-lg border-l-4 border-l-cyan-500 p-4"
      >
        <div className="flex items-center gap-4">
          {/* Avatar section */}
          <Avatar className="h-16 w-16 rounded-full border">
            <AvatarFallback className="bg-cyan-50 text-cyan-700">
              {displayName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          {/* Main content section */}
          <div className="flex-grow">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
              <div>
                <h3 className="font-semibold line-clamp-1">{worker.name}</h3>
                {worker.email && (
                  <p className="text-xs text-muted-foreground">
                    {worker.email}
                  </p>
                )}
              </div>
            </div>

            {/* Info with separators */}
            <div className="flex flex-wrap items-center gap-2 text-sm mt-2">
              {worker.phoneNumber && (
                <span className="text-xs text-muted-foreground">
                  Phone: {worker.phoneNumber}
                </span>
              )}
              {worker.availability && (
                <>
                  <div className="text-gray-300 text-sm px-1">|</div>
                  <span>Availability: {worker.availability}</span>
                </>
              )}
              {worker.notes && (
                <>
                  <div className="text-gray-300 text-sm px-1">|</div>
                  <span>Notes: {worker.notes}</span>
                </>
              )}
            </div>
          </div>

          {/* Actions section */}
          <div className="flex items-center gap-2 ml-2 shrink-0">
            <EditWorkerDialog worker={worker} />

            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowDeleteDialog(true)}
              disabled={isDeleting}
              className="h-8 px-2"
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the worker "{worker.name}". This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete Worker"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
