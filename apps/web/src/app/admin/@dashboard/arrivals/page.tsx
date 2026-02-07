"use client";

import { Button } from "@repo/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/card";
import { IconPackage, IconPlus } from "@tabler/icons-react";

export default function ArrivalsPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">New Arrivals</h2>
        <div className="flex items-center space-x-2">
          <Button shadow="sm" className="rounded-xl">
            <IconPlus className="mr-2 h-4 w-4" /> Add New Arrival
          </Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Mock Stats */}
        <Card className="rounded-[24px] border-none shadow-sm bg-white/50 backdrop-blur-xl ring-1 ring-black/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <IconPackage className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,284</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
      </div>
      <Card className="rounded-[32px] border-none shadow-sm bg-white/50 backdrop-blur-xl ring-1 ring-black/5 min-h-[400px] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
             <IconPackage className="h-10 w-10 text-primary" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold">No Arrivals Yet</h3>
            <p className="text-muted-foreground max-w-sm mx-auto">Start adding new arrivals to your store to show them here.</p>
          </div>
          <Button variant="outline" className="rounded-xl border-black/5 hover:bg-secondary">
            Import Products
          </Button>
        </div>
      </Card>
    </div>
  );
}
