"use client";

import { Button } from "@repo/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/card";
import { IconHistory, IconShoppingCart, IconTruck } from "@tabler/icons-react";

export default function OrdersPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-foreground font-heading italic uppercase">Order Manifest.</h2>
        <Button shadow="sm" variant="outline" className="rounded-2xl h-12 px-6 border-black/5">
          <IconHistory className="mr-2 h-5 w-5" /> View Logic Logs
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="rounded-[32px] border-none shadow-sm bg-neutral-900 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Total Sales</CardTitle>
            <IconShoppingCart className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-heading font-black italic">$142,890</div>
            <p className="text-xs font-bold text-primary mt-2">ATH: $12k Today</p>
          </CardContent>
        </Card>

        <Card className="rounded-[32px] border-none shadow-sm bg-white/80 backdrop-blur-md ring-1 ring-black/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Pending Shipment</CardTitle>
            <IconTruck className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-heading font-black italic">14</div>
            <p className="text-xs font-bold text-rose-500 mt-2">Urgent Processing Required</p>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-[48px] border-none shadow-[0_20px_50px_rgba(0,0,0,0.02)] bg-white/80 backdrop-blur-md ring-1 ring-black/5 min-h-[500px] flex items-center justify-center">
        <div className="text-center space-y-8">
          <div className="relative inline-flex">
            <div className="absolute inset-0 bg-secondary rounded-full blur-3xl opacity-50" />
            <div className="relative h-24 w-24 rounded-[32px] bg-secondary flex items-center justify-center text-primary shadow-inner">
               <IconShoppingCart className="h-12 w-12" />
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="text-2xl font-heading font-black italic text-foreground uppercase tracking-tight">System standby.</h3>
            <p className="text-muted-foreground font-medium max-w-sm mx-auto italic">All orders have been fulfilled. The warehouse is currently idle.</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
