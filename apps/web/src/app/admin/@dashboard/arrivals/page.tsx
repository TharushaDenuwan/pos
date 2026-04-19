"use client";

import { NewArrivalDialog } from "@/features/new-arrivals/components/new-arrival-dialog";
import { NewArrivalList } from "@/features/new-arrivals/components/new-arrival-list";
import { Button } from "@repo/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/card";
import { IconPackage, IconPlus } from "@tabler/icons-react";
import { useState } from "react";

export default function ArrivalsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">New Arrivals</h2>
        <div className="flex items-center space-x-2">
          <Button shadow="sm" className="rounded-xl" onClick={() => setIsDialogOpen(true)}>
            <IconPlus className="mr-2 h-4 w-4" /> Add New Arrival
          </Button>
        </div>
      </div>

      <NewArrivalDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Mock Stats */}
        <Card className="rounded-[24px] border-none shadow-sm bg-white/50 backdrop-blur-xl ring-1 ring-black/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Arrivals Count</CardTitle>
            <IconPackage className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {/* This could be dynamic later */}
            <div className="text-2xl font-bold">...</div>
            <p className="text-xs text-muted-foreground">Active promotions</p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white/50 backdrop-blur-xl rounded-[32px] p-6 ring-1 ring-black/5 shadow-sm">
        <NewArrivalList />
      </div>
    </div>
  );
}
