"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/card";
import { IconMessage2, IconStar } from "@tabler/icons-react";

export default function ReviewsPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-foreground font-heading italic">REVIEWS & FEEDBACK.</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="rounded-[32px] border-none shadow-sm bg-white/80 backdrop-blur-md ring-1 ring-black/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Average Rating</CardTitle>
            <div className="h-10 w-10 rounded-xl bg-amber-500/5 flex items-center justify-center text-amber-500">
               <IconStar className="h-5 w-5 fill-current" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-heading font-black italic">4.92</div>
            <p className="text-sm font-bold text-amber-600 mt-2">Based on 1.2k reviews</p>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-[48px] border-none shadow-sm bg-white/80 backdrop-blur-md ring-1 ring-black/5 min-h-[500px] flex items-center justify-center border-dashed border-2 border-primary/10">
        <div className="text-center space-y-8">
          <div className="h-24 w-24 rounded-full bg-secondary flex items-center justify-center text-primary mx-auto animate-bounce duration-1000">
             <IconMessage2 className="h-10 w-10" />
          </div>
          <div className="space-y-3">
            <h3 className="text-2xl font-heading font-black italic text-foreground uppercase">Everything looks perfect.</h3>
            <p className="text-muted-foreground font-medium max-w-sm mx-auto italic leading-relaxed">No new reviews to moderate. Your customers are satisfied with the current collection.</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
