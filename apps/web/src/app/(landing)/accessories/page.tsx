"use client";

import { PageHeader } from "@/components/shop/PageHeader";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { MOCK_PRODUCTS } from "@/lib/shop-data";
import { useMemo } from "react";

export default function AccessoriesPage() {
  const filtered = useMemo(() => {
    return MOCK_PRODUCTS.filter(p => p.category === "Accessories");
  }, []);

  return (
    <div className="bg-white min-h-screen">
      <PageHeader
        title="ACCESSORIES"
        description="The finishing details of a visionary. Handcrafted essentials for your daily journey."
        badge="Essentials"
        image="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=2000&auto=format&fit=crop"
      />

      <section className="py-24">
        <div className="content-container">
          <ProductGrid products={filtered} />
        </div>
      </section>
    </div>
  );
}
