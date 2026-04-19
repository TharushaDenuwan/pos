"use client";

import { DataTable } from "@/components/table/data-table";
import { DataTableSkeleton } from "@/components/table/data-table-skeleton";
import { useGetStaff } from "../api/use-get-staff";
import { columns, StaffMember } from "./staff-table/columns";

export function StaffList() {
  const { data, isLoading, isError } = useGetStaff();

  if (isLoading) {
    return <DataTableSkeleton columnCount={columns.length} rowCount={5} />;
  }

  if (isError) {
    return <div className="p-8 text-center text-red-500 font-bold">Failed to load staff data.</div>;
  }

  const staffData = (data?.data || []) as unknown as StaffMember[];

  return (
    <div className="rounded-3xl border bg-white/50 backdrop-blur-sm overflow-hidden shadow-sm">
      <DataTable
        columns={columns}
        data={staffData}
        totalItems={data?.meta?.totalCount || staffData.length}
      />
    </div>
  );
}
