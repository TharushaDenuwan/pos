"use client";

import { Button } from "@repo/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/card";
import { IconId, IconShieldLock, IconUserPlus } from "@tabler/icons-react";

export default function StaffPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-foreground font-heading italic uppercase">Staff Operations.</h2>
        <Button shadow="sm" className="rounded-2xl h-12 px-6 bg-neutral-900 hover:bg-black text-white border-none">
          <IconUserPlus className="mr-2 h-5 w-5" /> Add Staff Member
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="rounded-[32px] border-none shadow-sm bg-white/80 backdrop-blur-md ring-1 ring-black/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">Total Active Staff</CardTitle>
            <div className="h-10 w-10 rounded-xl bg-indigo-500/5 flex items-center justify-center text-indigo-500">
               <IconId className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-heading font-black italic text-foreground">12</div>
            <p className="text-sm font-bold text-muted-foreground mt-2 italic italic">4 Administrators, 8 Moderators</p>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-[48px] border-none shadow-[0_20px_50px_rgba(0,0,0,0.02)] bg-white/80 backdrop-blur-md ring-1 ring-black/5 min-h-[500px] flex items-center justify-center overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[100px] -ml-32 -mb-32" />

        <div className="text-center space-y-8 relative z-10 p-12">
          <div className="h-24 w-24 rounded-[32px] bg-neutral-900 flex items-center justify-center text-primary shadow-2xl mx-auto rotate-[-8deg]">
             <IconShieldLock className="h-12 w-12" />
          </div>
          <div className="space-y-3">
            <h3 className="text-3xl font-heading font-black italic text-foreground uppercase tracking-tight">Access Restricted.</h3>
            <p className="text-muted-foreground font-medium max-w-sm mx-auto italic leading-relaxed">
              Only primary administrators can manage staff roles and permissions. Please verify your identity to continue.
            </p>
          </div>
          <div className="flex justify-center gap-4">
            <Button size="lg" className="rounded-2xl h-14 px-10 font-bold transition-all hover:scale-105 active:scale-95 shadow-xl shadow-primary/20">
              Verify Identity
            </Button>
            <Button size="lg" variant="ghost" className="rounded-2xl h-14 px-10 font-bold italic text-muted-foreground/60">
              Request Higher Permissions
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
