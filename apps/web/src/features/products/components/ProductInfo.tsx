"use client";

import { useCartStore } from "@/features/cart/store/useCartStore";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { Minus, Plus, RotateCcw, ShieldCheck, ShoppingBag, Star, Truck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ProductInfoProps {
  product: any;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  const discountedPrice = product.price - (product.discount || 0);
  const hasDiscount = (product.discount || 0) > 0;

  const handleAddToCart = () => {
    addItem(product, quantity);
    toast.success(`${product.name} added to cart`, {
      description: `Quantity: ${quantity}`,
      action: {
        label: "View Cart",
        onClick: () => (window.location.href = "/cart"),
      },
    });
  };

  return (
    <div className="space-y-10">
      <div className="space-y-4">
        <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] font-black tracking-widest uppercase px-4 py-1.5 rounded-full">
          {product.category}
        </Badge>
        <h1 className="text-5xl md:text-6xl font-heading font-black tracking-tighter italic">
          {product.name.toUpperCase()}
        </h1>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "w-5 h-5",
                  i < Math.floor(product.rating || 5)
                    ? "fill-primary text-primary"
                    : "text-muted-foreground/30"
                )}
              />
            ))}
            <span className="ml-2 font-bold text-sm italic">
              {product.rating || "5.0"} ({product.reviewCount || 0} reviews)
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-baseline gap-4">
          <span className="text-5xl font-black text-primary">
            {formatPrice(discountedPrice)}
          </span>
          {hasDiscount && (
            <span className="text-2xl font-bold text-muted-foreground/40 line-through italic">
              {formatPrice(product.price)}
            </span>
          )}
        </div>
        {hasDiscount && (
          <p className="text-primary font-black text-sm tracking-tight italic">
            SAVE {formatPrice(product.discount)} TODAY
          </p>
        )}
      </div>

      <p className="text-xl text-muted-foreground leading-relaxed font-medium italic max-w-xl">
        {product.description || "The definitive statement piece for your daily rotation. Engineered for excellence, designed for the visionary."}
      </p>

      <div className="space-y-6 pt-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center p-2 bg-secondary/50 rounded-2xl ring-1 ring-black/5">
            <Button
              variant="ghost"
              size="icon"
              className="h-12 w-12 rounded-xl hover:bg-white shadow-sm transition-all"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <Minus className="w-5 h-5" />
            </Button>
            <span className="w-16 text-center font-black text-xl">{quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-12 w-12 rounded-xl hover:bg-white shadow-sm transition-all"
              onClick={() => setQuantity(quantity + 1)}
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            size="lg"
            className="h-20 flex-1 rounded-[24px] text-xl font-black italic group shadow-2xl shadow-primary/20"
            onClick={handleAddToCart}
          >
            ADD TO CART
            <ShoppingBag className="ml-3 w-6 h-6 transition-transform group-hover:scale-110" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-black/5">
        <div className="flex items-center gap-4 group">
          <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <p className="font-black text-[10px] tracking-widest text-muted-foreground/60 uppercase">Shipping</p>
            <p className="text-xs font-bold">Fast Global Delivery</p>
          </div>
        </div>
        <div className="flex items-center gap-4 group">
          <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="font-black text-[10px] tracking-widest text-muted-foreground/60 uppercase">Safe</p>
            <p className="text-xs font-bold">Secure Checkout</p>
          </div>
        </div>
        <div className="flex items-center gap-4 group">
          <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
            <RotateCcw className="w-6 h-6" />
          </div>
          <div>
            <p className="font-black text-[10px] tracking-widest text-muted-foreground/60 uppercase">Returns</p>
            <p className="text-xs font-bold">30-Day Window</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Importing cn since it's used in the Star map
import { cn } from "@/lib/utils";
