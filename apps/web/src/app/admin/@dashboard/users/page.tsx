"use client";

import { Button } from "@repo/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/card";
import { IconUserPlus, IconUsers } from "@tabler/icons-react";

export default function UsersPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-foreground font-heading italic">USER MANAGEMENT.</h2>
        <div className="flex items-center space-x-2">
          <Button shadow="sm" className="rounded-2xl h-12 px-6">
            <IconUserPlus className="mr-2 h-5 w-5" /> Invite User
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="rounded-[32px] border-none shadow-[0_20px_50px_rgba(0,0,0,0.02)] bg-white/80 backdrop-blur-md ring-1 ring-black/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Active Users</CardTitle>
            <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
               <IconUsers className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-heading font-black italic">8,249</div>
            <p className="text-sm font-bold text-emerald-500 mt-2">+24% growth</p>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-[48px] border-none shadow-[0_20px_50px_rgba(0,0,0,0.02)] bg-white/80 backdrop-blur-md ring-1 ring-black/5 min-h-[500px] flex items-center justify-center">
        <div className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="relative inline-flex">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
            <div className="relative h-24 w-24 rounded-3xl bg-primary flex items-center justify-center text-white rotate-6 hover:rotate-0 transition-transform shadow-2xl">
               <IconUsers className="h-12 w-12" />
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="text-2xl font-heading font-black italic text-foreground uppercase tracking-tight">The community is quiet.</h3>
            <p className="text-muted-foreground font-medium max-w-sm mx-auto">No users have joined your platform yet. Start promoting your shop to find visionaries.</p>
          </div>
          <Button variant="outline" className="rounded-2xl h-14 px-10 border-black/5 hover:bg-secondary font-bold text-lg transition-all">
            Open Registrations
          </Button>
        </div>
      </Card>
    </div>
  );
}
