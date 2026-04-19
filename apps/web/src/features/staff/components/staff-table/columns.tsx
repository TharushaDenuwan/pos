"use client";

import { Badge } from "@repo/ui/components/badge";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export type StaffMember = {
  id: string; // Staff Profile ID
  userId: string;
  position: string | null;
  assignedSection: string | null;
  joinedAt: string | null;
  user?: {
    name: string;
    email: string;
    status: string | null;
  };
};

export const columns: ColumnDef<StaffMember>[] = [
  {
    accessorKey: "user.name",
    header: "Name",
    cell: ({ row }) => {
      const name = row.original.user?.name || "Unknown";
      const initials = name.slice(0, 2).toUpperCase();
      return (
        <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-xs font-black text-primary border border-primary/20">
              {initials}
            </div>
            <div>
                <p className="font-bold">{name}</p>
                <p className="text-xs text-muted-foreground">{row.original.user?.email}</p>
            </div>
        </div>
      );
    }
  },
  {
    accessorKey: "position",
    header: "Position",
    cell: ({ row }) => <span className="font-medium">{row.original.position || "N/A"}</span>
  },
  {
    accessorKey: "assignedSection",
    header: "Assigned Section",
    cell: ({ row }) => {
        const section = row.original.assignedSection;
        let color = "bg-gray-100 text-gray-800";
        if (section === "orders") color = "bg-blue-100 text-blue-800 border-blue-200";
        if (section === "reviews") color = "bg-purple-100 text-purple-800 border-purple-200";
        if (section === "storage") color = "bg-orange-100 text-orange-800 border-orange-200";

        return (
            <Badge className={`rounded-full shadow-none px-3 py-1 font-bold uppercase tracking-wide text-[10px] ${color}`}>
                {section || "Unassigned"}
            </Badge>
        )
    }
  },
  {
    accessorKey: "joinedAt",
    header: "Joined",
    cell: ({ row }) => row.original.joinedAt ? format(new Date(row.original.joinedAt), "MMM dd, yyyy") : "N/A"
  },
  {
    accessorKey: "user.status",
    header: "Status",
    cell: ({ row }) => {
        const status = row.original.user?.status;
        return (
            <Badge variant="outline" className={`rounded-xl ${status === "active" ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}`}>
                {status || "Unknown"}
            </Badge>
        )
    }
  }
];
