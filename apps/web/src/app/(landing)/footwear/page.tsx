"use client";

import { PageHeader } from "@/components/shop/PageHeader";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { MOCK_PRODUCTS } from "@/lib/shop-data";
import { useMemo } from "react";

export default function FootwearPage() {
  const filtered = useMemo(() => {
    return MOCK_PRODUCTS.filter(p => p.category === "Footwear");
  }, []);

  return (
    <div className="bg-white min-h-screen">
      <PageHeader
        title="FOOTWEAR"
        description="Engineered for agility. Crafted for the streets. Step into the future of performance footwear."
        badge="Elite Series"
        image="https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2000&auto=format&fit=crop"
      />

      <section className="py-24">
        <div className="content-container">
          <ProductGrid products={filtered} />
        </div>
      </section>
    </div>
  );
}
