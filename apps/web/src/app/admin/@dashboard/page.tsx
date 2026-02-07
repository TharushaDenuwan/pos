"use client";

import { ProductGrid } from "@/components/shop/ProductGrid";
import { MOCK_PRODUCTS } from "@/lib/shop-data";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/card";
import { IconChartBar, IconMessage2, IconShoppingCart, IconTrendingUp, IconUsers } from "@tabler/icons-react";

export default function AdminDashboardPage() {
  const recentProducts = MOCK_PRODUCTS.slice(0, 4);

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div className="space-y-1">
          <h2 className="text-4xl font-heading font-black tracking-tighter italic uppercase">Master Control.</h2>
          <p className="text-muted-foreground font-medium italic">Welcome back, Administrator. Here's your shop's heartbeat.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Total Revenue", value: "$452,231", icon: IconChartBar, trend: "+12.5%", color: "text-emerald-500" },
          { title: "Active Visionaries", value: "24,562", icon: IconUsers, trend: "+18%", color: "text-blue-500" },
          { title: "Pending Orders", value: "42", icon: IconShoppingCart, trend: "-4%", color: "text-amber-500" },
          { title: "Positive Signal", value: "98.2%", icon: IconMessage2, trend: "+2.1%", color: "text-rose-500" },
        ].map((stat, i) => (
          <Card key={i} className="rounded-[32px] border-none shadow-[0_20px_50px_rgba(0,0,0,0.02)] bg-white/80 backdrop-blur-md ring-1 ring-black/5 hover:scale-[1.02] transition-all cursor-default group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">{stat.title}</CardTitle>
              <div className={`h-10 w-10 rounded-xl bg-secondary flex items-center justify-center ${stat.color} group-hover:rotate-12 transition-transform`}>
                 <stat.icon className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-heading font-black italic">{stat.value}</div>
              <p className={`text-xs font-bold mt-2 ${stat.trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
                {stat.trend} <span className="text-muted-foreground/60 font-medium">from last cycle</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 md:grid-cols-7">
        <Card className="col-span-4 rounded-[40px] border-none shadow-[0_20px_50px_rgba(0,0,0,0.02)] bg-white/80 backdrop-blur-md ring-1 ring-black/5 p-8">
           <div className="flex items-center justify-between mb-8">
              <div className="space-y-1">
                <h3 className="text-xl font-heading font-black italic uppercase tracking-tight">Performance Velocity.</h3>
                <p className="text-sm text-muted-foreground italic">Market engagement over the last 30 days.</p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-full">
                <IconTrendingUp className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-black">STABLE</span>
              </div>
           </div>
           {/* Mock area for a chart */}
           <div className="h-[300px] w-full bg-secondary/30 rounded-[32px] border-2 border-dashed border-black/5 flex items-center justify-center text-muted-foreground font-bold italic">
              Quantum Chart Synthesis in Progress...
           </div>
        </Card>

        <Card className="col-span-3 rounded-[40px] border-none shadow-[0_20px_50px_rgba(0,0,0,0.02)] bg-neutral-900 text-white p-8">
           <div className="space-y-1 mb-8">
              <h3 className="text-xl font-heading font-black italic uppercase tracking-tight text-primary">System Feed.</h3>
              <p className="text-sm text-white/40 italic">Real-time operational updates.</p>
           </div>
           <div className="space-y-6">
              {[
                { type: "ORDER", msg: "New order #8241 from Tokyo, JP", time: "2m ago" },
                { type: "SYSTEM", msg: "AI model optimization complete", time: "14m ago" },
                { type: "USER", msg: "New staff member assigned to Logistics", time: "1h ago" },
                { type: "ALERT", msg: "Stock low on 'Oxide' Collection", time: "3h ago" },
              ].map((log, i) => (
                <div key={i} className="flex items-start gap-4 group cursor-help">
                   <div className="h-2 w-2 rounded-full bg-primary mt-2 group-hover:scale-150 transition-all" />
                   <div className="space-y-1">
                      <p className="text-sm font-bold text-white/90">{log.msg}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-white/30 tracking-widest uppercase">{log.type}</span>
                        <span className="text-[10px] text-white/20">•</span>
                        <span className="text-[10px] text-white/20 font-medium">{log.time}</span>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </Card>
      </div>

      <div className="space-y-6">
         <div className="flex items-center justify-between px-2">
            <h3 className="text-2xl font-heading font-black italic uppercase tracking-tight">Newest Inventory.</h3>
            <span className="text-xs font-bold text-primary cursor-pointer hover:underline">Manage All Inventory →</span>
         </div>
         <ProductGrid products={recentProducts} />
      </div>
    </div>
  );
}
