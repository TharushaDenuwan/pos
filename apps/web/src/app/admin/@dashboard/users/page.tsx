"use client";

import UsersListing from "@/features/users/components/users-listing";

export default function UsersPage() {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-black italic uppercase tracking-tighter">
          User Management
        </h1>
        <p className="text-muted-foreground mt-2 font-medium">
          View all registered users and manage their status
        </p>
      </div>

      <UsersListing />
    </div>
  );
}
