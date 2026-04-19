"use client";

import { ProductGrid } from "@/components/shop/ProductGrid";
import { useEffect, useState } from "react";
import { getAllNewArrivals } from "../actions/getAll.action";

export function NewArrivalsFeatured() {
  const [arrivals, setArrivals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const res = await getAllNewArrivals({ limit: "8" });
        const activeArrivals = (res.data || [])
          .filter((a: any) => a.isActive)
          // Sort: Featured items first, then by creation date
          .sort((a: any, b: any) => {
            if (a.isFeatured && !b.isFeatured) return -1;
            if (!a.isFeatured && b.isFeatured) return 1;
            return 0;
          })
          .map((a: any) => {
            const effectivePrice = (a.price || 0) - (a.discount || 0);
            const hasDiscount = (a.discount || 0) > 0;

            return {
              id: a.productId || a.id,
              title: a.name || "New Arrival",
              description: a.description || "",
              price: effectivePrice,
              originalPrice: hasDiscount ? a.price : undefined,
              image: a.image || (a.images && a.images.length > 0 ? a.images[0] : ""),
              category: a.category || "New Arrival",
              rating: 5.0,
              reviews: 0,
              isNew: true,
              isSale: hasDiscount,
            };
          });

        setArrivals(activeArrivals);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

  if (loading) return <div className="py-20 text-center">Loading new arrivals...</div>;
  if (arrivals.length === 0) return null;

  return (
    <section className="py-32">
      <div className="content-container">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20 px-2">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-heading font-black tracking-tighter italic uppercase">New Arrivals.</h2>
            <p className="text-muted-foreground font-medium text-lg italic">The latest pieces added to our collection.</p>
          </div>
        </div>

        <ProductGrid products={arrivals} />
      </div>
    </section>
  );
}
