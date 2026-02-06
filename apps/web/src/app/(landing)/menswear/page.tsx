"use client";

import { PageHeader } from "@/components/shop/PageHeader";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { MOCK_PRODUCTS } from "@/lib/shop-data";
import { useMemo } from "react";

export default function MenswearPage() {
  const filtered = useMemo(() => {
    return MOCK_PRODUCTS.filter(p => p.category === "Menswear");
  }, []);

  return (
    <div className="bg-white min-h-screen">
      <PageHeader
        title="MENSWEAR"
        description="Precision tailoring meets urban subculture. Redefining the modern silhouette."
        badge="Ready to Wear"
        image="https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?q=80&w=2000&auto=format&fit=crop"
      />

      <section className="py-24">
        <div className="content-container">
          <ProductGrid products={filtered} />
        </div>
      </section>
    </div>
  );
}
