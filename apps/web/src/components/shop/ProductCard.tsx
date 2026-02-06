"use client";

import { Product } from "@/lib/shop-data";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { Heart, Star } from "lucide-react";

export function ProductCard({ p }: { p: Product }) {
  return (
    <div key={p.id} className="group">
      <div className="relative aspect-[4/5] rounded-[32px] overflow-hidden bg-white shadow-sm transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 ring-1 ring-black/5">
        {p.isNew && (
          <Badge className="absolute top-5 left-5 z-10 bg-primary/90 text-primary-foreground font-black px-3 py-1 rounded-full text-[10px] tracking-widest ring-4 ring-white/10">NEW</Badge>
        )}
        {p.isSale && (
          <Badge className="absolute top-5 left-5 z-10 bg-rose-500 text-white font-black px-3 py-1 rounded-full text-[10px] tracking-widest ring-4 ring-white/10">SALE</Badge>
        )}
        <img
          src={p.image}
          alt={p.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Hover Actions */}
        <div className="absolute inset-x-0 bottom-6 px-6 translate-y-12 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 flex gap-2">
          <Button className="flex-1 h-14 rounded-2xl shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90 text-white font-bold border-none">
            Add to Cart
          </Button>
          <Button variant="secondary" size="icon" className="h-14 w-14 rounded-2xl shadow-xl bg-white/90 backdrop-blur-md hover:bg-white text-black border-none ring-1 ring-black/5">
            <Heart className="w-6 h-6" />
          </Button>
        </div>
      </div>

      <div className="mt-8 space-y-3 px-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{p.category}</span>
          <div className="flex items-center gap-1.5 bg-amber-50 px-2 py-0.5 rounded-full scale-90">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span className="text-[11px] font-black text-amber-700">{p.rating}</span>
          </div>
        </div>
        <h3 className="font-heading font-bold text-xl leading-tight group-hover:text-primary transition-colors line-clamp-1">{p.title}</h3>
        <p className="text-2xl font-heading font-black tracking-tight text-foreground">
          ${p.price}.00
        </p>
      </div>
    </div>
  );
}
