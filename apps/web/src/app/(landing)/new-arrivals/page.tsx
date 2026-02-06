"use client";

import { PageHeader } from "@/components/shop/PageHeader";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { MOCK_PRODUCTS } from "@/lib/shop-data";
import { useMemo } from "react";

export default function NewArrivalsPage() {
  const filtered = useMemo(() => {
    return MOCK_PRODUCTS.filter(p => p.isNew);
  }, []);

  return (
    <div className="bg-white min-h-screen">
      <PageHeader
        title="NEW ARRIVALS"
        description="Fresh drops and limited releases. Stay ahead with our latest curated selections."
        badge="Just Landed"
        image="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000&auto=format&fit=crop"
      />

      <section className="py-24">
        <div className="content-container">
          <ProductGrid products={filtered} />
        </div>
      </section>
    </div>
  );
}
