"use client";
import { formatDistanceToNow } from "date-fns";
import {
  ExternalLinkIcon,
  HomeIcon,
  MapPinIcon,
  TrashIcon,
} from "lucide-react";
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
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/avatar";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { Card } from "@repo/ui/components/card";
import Link from "next/link";
import { useId } from "react";
import { deleteJob } from "../actions/delete.action";
import type { Job } from "../schemas";
import { EditJobDialog } from "./edit-job-dialog";

type Props = {
  job: Job;
};

export function JobCard({ job }: Props) {
  const id = useId();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Default image if none provided
  const displayImage =
    Array.isArray(job.photos) && job.photos.length > 0 ? job.photos[0] : "";

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteJob(String(job.id));
      toast.success("Job listing deleted successfully");
    } catch (error) {
      console.error("Failed to delete job:", error);
      toast.error("Failed to delete job listing");
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
            <AvatarImage
              src={displayImage}
              alt={job.jobTitle}
              className="size-16"
            />
            <AvatarFallback className="bg-cyan-50 text-cyan-700">
              <HomeIcon className="h-6 w-6" />
            </AvatarFallback>
          </Avatar>

          {/* Main content section */}
          <div className="flex-grow">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
              <div>
                <h3 className="font-semibold line-clamp-1">{job.jobTitle}</h3>
                {job.createdAt && (
                  <p className="text-xs text-muted-foreground">
                    Added {formatDistanceToNow(new Date(job.createdAt))} ago
                  </p>
                )}
              </div>
            </div>

            {/* Info with separators */}
            <div className="flex flex-wrap items-center gap-2 text-sm mt-2">
              {job.address?.formattedAddress && (
                <div className="flex items-center gap-1">
                  <MapPinIcon className="h-3.5 w-3.5 text-cyan-500" />
                  <span className="text-sm truncate max-w-[180px]">
                    {job.address.formattedAddress}
                  </span>
                </div>
              )}
              {typeof job.address?.latitude === "number" && (
                <span className="text-xs text-muted-foreground">
                  | Lat: {job.address.latitude}
                </span>
              )}
              {typeof job.address?.longitude === "number" && (
                <span className="text-xs text-muted-foreground">
                  | Lng: {job.address.longitude}
                </span>
              )}
              {job.jobNumber && (
                <>
                  <div className="text-gray-300 text-sm px-1">|</div>
                  <span>Job #: {job.jobNumber}</span>
                </>
              )}
              {job.dueDate && (
                <>
                  <div className="text-gray-300 text-sm px-1">|</div>
                  <span>Due: {new Date(job.dueDate).toLocaleDateString()}</span>
                </>
              )}
              {typeof job.estimatedHours === "number" && (
                <>
                  <div className="text-gray-300 text-sm px-1">|</div>
                  <span>Est. {job.estimatedHours} hrs</span>
                </>
              )}
              {job.contactDetails?.phoneNumber && (
                <>
                  <div className="text-gray-300 text-sm px-1">|</div>
                  <span>Contact: {job.contactDetails.phoneNumber}</span>
                </>
              )}
              {job.contactDetails?.email && (
                <>
                  <div className="text-gray-300 text-sm px-1">|</div>
                  <span>Email: {job.contactDetails.email}</span>
                </>
              )}
            </div>
          </div>

          {/* Actions section */}
          <div className="flex items-center gap-2 ml-2 shrink-0">
            <Badge
              variant="outline"
              className="bg-cyan-50 text-cyan-700 border-cyan-200 text-xs w-fit"
            >
              {job.status || "Initiated"}
            </Badge>

            {/* Add Edit button */}
            <EditJobDialog job={job} />

            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowDeleteDialog(true)}
              disabled={isDeleting}
              className="h-8 px-2"
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" asChild className="h-8 px-2">
              <Link href={`/dashboard/job/${job.id}`}>
                <ExternalLinkIcon className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the job listing "{job.jobTitle}
              ". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete Listing"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
