"use client";

import { CreateStaffDialog } from "@/features/staff/components/create-staff-dialog";
import { StaffList } from "@/features/staff/components/staff-list";
import { IconUsers } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";

export default function StaffPage() {
  const queryClient = useQueryClient();

  const handleCreateSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["staff-profiles"] });
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter">
            Staff Management
          </h1>
          <p className="text-muted-foreground mt-2 font-medium flex items-center gap-2">
            <IconUsers className="w-4 h-4" />
            Manage team access and roles
          </p>
        </div>
        <CreateStaffDialog onSuccess={handleCreateSuccess} />
      </div>

      <StaffList />
    </div>
  );
}
