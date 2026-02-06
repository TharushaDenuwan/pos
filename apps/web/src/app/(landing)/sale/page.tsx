"use client";

import { PageHeader } from "@/components/shop/PageHeader";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { MOCK_PRODUCTS } from "@/lib/shop-data";
import { useMemo } from "react";

export default function SalePage() {
  const filtered = useMemo(() => {
    return MOCK_PRODUCTS.filter(p => p.isSale);
  }, []);

  return (
    <div className="bg-white min-h-screen">
      <PageHeader
        title="THE SALE"
        description="Exceptional value on seasonal masterpieces. Limited quantities available."
        badge="Up to 50% Off"
        image="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2000&auto=format&fit=crop"
      />

      <section className="py-24">
        <div className="content-container">
          <ProductGrid products={filtered} />
        </div>
      </section>
    </div>
  );
}
