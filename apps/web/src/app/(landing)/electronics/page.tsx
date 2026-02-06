"use client";

import { PageHeader } from "@/components/shop/PageHeader";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { MOCK_PRODUCTS } from "@/lib/shop-data";
import { useMemo } from "react";

export default function ElectronicsPage() {
  const filtered = useMemo(() => {
    return MOCK_PRODUCTS.filter(p => p.category === "Electronics");
  }, []);

  return (
    <div className="bg-white min-h-screen">
      <PageHeader
        title="ELECTRONICS"
        description="Next-gen hardware for the digital nomad. Performance engineering in every detail."
        badge="Future Tech"
        image="https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=2000&auto=format&fit=crop"
      />

      <section className="py-24">
        <div className="content-container">
          <ProductGrid products={filtered} />
        </div>
      </section>
    </div>
  );
}
