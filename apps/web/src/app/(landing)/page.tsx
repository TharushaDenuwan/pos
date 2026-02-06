"use client";

import { ProductGrid } from "@/components/shop/ProductGrid";
import { CATEGORIES, MOCK_PRODUCTS } from "@/lib/shop-data";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { ArrowRight, RotateCcw, ShieldCheck, Star, Truck } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

export default function Homepage() {
  const [activeCategory, setActiveCategory] = useState<string | "all">("all");

  const filtered = useMemo(() => {
    return MOCK_PRODUCTS.filter((p) => {
      const matchesCategory =
        activeCategory === "all" ? true : p.category === activeCategory;
      return matchesCategory;
    });
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-primary/10 selection:text-primary">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2000&auto=format&fit=crop"
            alt="Hero Background"
            className="w-full h-full object-cover object-top scale-105 animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/40 to-transparent" />
        </div>

        <div className="content-container relative z-10">
          <div className="max-w-2xl space-y-8">
            <Badge className="px-4 py-2 bg-primary/10 text-primary border-primary/20 text-xs font-black tracking-[0.2em] rounded-full uppercase">
              Limited Edition Drops
            </Badge>
            <h1 className="text-6xl md:text-8xl font-heading font-black tracking-tighter leading-[0.9] italic">
              ELEVATE YOUR <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-600">DAILY FLOW.</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground font-medium max-w-lg leading-relaxed italic">
              Curated collections for the modern visionary. Experience the fusion of high-fashion and functionality.
            </p>
            <div className="flex flex-wrap items-center gap-6 pt-6">
              <Button size="lg" className="h-16 px-10 rounded-2xl text-lg font-bold group shadow-2xl shadow-primary/30">
                Explore Shop
                <ArrowRight className="ml-2 w-6 h-6 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button size="lg" variant="outline" className="h-16 px-10 rounded-2xl text-lg font-bold border-black/5 hover:bg-secondary transition-all">
                View Lookbook
              </Button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce hidden md:block">
          <div className="w-6 h-10 border-2 border-black/10 rounded-full flex justify-center p-1">
            <div className="w-1.5 h-1.5 bg-black/30 rounded-full" />
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-20 border-b border-black/5">
        <div className="content-container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { icon: Truck, title: "EXPRESS SHIPPING", desc: "Delivery in 48 hours" },
              { icon: ShieldCheck, title: "SECURE CHECKOUT", desc: "Verified transactions" },
              { icon: RotateCcw, title: "GLOBAL RETURNS", desc: "30-day window" },
              { icon: Star, title: "PREMIUM FINISH", desc: "Handcrafted quality" },
            ].map((feature, idx) => (
              <div key={idx} className="flex flex-col items-center lg:items-start text-center lg:text-left gap-4 group">
                <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all transform group-hover:rotate-3 shadow-sm">
                  <feature.icon className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-black text-[10px] tracking-[0.2em] uppercase text-muted-foreground/60">{feature.title}</h3>
                  <p className="text-sm font-bold text-foreground">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Grid */}
      <section className="py-32">
        <div className="content-container">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 px-2">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-heading font-black tracking-tighter italic">THE COLLECTIONS.</h2>
              <p className="text-muted-foreground font-medium text-lg italic">Select your workspace. Style your reality.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                href={`/${cat.slug}`}
                className="group relative h-[450px] rounded-[40px] overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-700 ring-1 ring-black/5"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 p-10 w-full flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-white/50 tracking-[0.3em] uppercase">Department</p>
                    <h3 className="text-3xl font-heading font-black text-white italic">{cat.name.toUpperCase()}</h3>
                  </div>
                  <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-black transform transition-all group-hover:rotate-[-45deg] shadow-2xl">
                    <ArrowRight className="w-7 h-7 -rotate-45 group-hover:rotate-0 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="py-32 bg-secondary/20">
        <div className="content-container">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20 px-2">
            <div className="space-y-4">
              <div className="flex items-center gap-6">
                <h2 className="text-4xl md:text-5xl font-heading font-black tracking-tighter italic">TRENDING NOW.</h2>
                {activeCategory !== "all" && (
                  <Badge variant="outline" className="px-4 py-2 cursor-pointer font-black border-primary bg-primary/5 text-primary rounded-full hover:bg-primary hover:text-white transition-all" onClick={() => setActiveCategory("all")}>
                    {activeCategory.toUpperCase()} ×
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground font-medium text-lg italic">Hot drops that are defining the season's landscape.</p>
            </div>
          </div>

          <ProductGrid products={filtered} />

          <div className="mt-24 text-center">
            <Button size="lg" variant="outline" className="h-16 px-12 rounded-2xl text-lg font-bold border-black/5 hover:bg-white hover:shadow-xl transition-all">
              View All Masterpieces
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
