"use client";

import { Product } from "@/lib/shop-data";
import { ProductCard } from "./ProductCard";

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
      {products.length === 0 ? (
        <div className="col-span-full py-32 text-center space-y-4">
          <div className="inline-flex w-20 h-20 bg-secondary rounded-full items-center justify-center text-muted-foreground animate-pulse">
            <span className="text-3xl font-black">?</span>
          </div>
          <p className="text-muted-foreground font-bold italic">No products found for this selection.</p>
        </div>
      ) : (
        products.map((p) => (
          <ProductCard key={p.id} p={p} />
        ))
      )}
    </div>
  );
}
