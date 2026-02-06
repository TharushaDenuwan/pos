"use client";

import { PageHeader } from "@/components/shop/PageHeader";
import { CATEGORIES } from "@/lib/shop-data";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CollectionsPage() {
  return (
    <div className="bg-white min-h-screen">
      <PageHeader
        title="COLLECTIONS"
        description="Our thematic universes curated for every lifestyle. Find your perfect coordinate."
        badge="The Core Catalog"
      />

      <section className="py-24">
        <div className="content-container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                href={`/${cat.slug}`}
                className="group relative h-[600px] rounded-[48px] overflow-hidden cursor-pointer shadow-xl transition-all duration-700 hover:-translate-y-4"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-16 w-full space-y-4">
                  <p className="text-xs font-black text-white/50 tracking-[0.4em] uppercase">Limited Edition</p>
                  <div className="flex items-center justify-between">
                    <h3 className="text-5xl font-heading font-black text-white italic">{cat.name.toUpperCase()}</h3>
                    <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-black transform transition-all group-hover:rotate-[-45deg]">
                      <ArrowRight className="w-8 h-8 -rotate-45 group-hover:rotate-0 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
