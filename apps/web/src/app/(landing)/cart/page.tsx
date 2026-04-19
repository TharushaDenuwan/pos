"use client";

import { useCartStore } from "@/features/cart/store/useCartStore";
import { formatPrice } from "@/lib/utils";
import { Button } from "@repo/ui/components/button";
import { Card } from "@repo/ui/components/card";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import Link from "next/link";

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalPrice, totalItems } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center content-container text-center space-y-8">
        <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center text-muted-foreground/30 animate-pulse">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-heading font-black tracking-tighter italic uppercase text-primary">
            Your cart is empty.
          </h1>
          <p className="text-muted-foreground font-medium italic text-xl">
            Looks like you haven't added any masterpieces yet.
          </p>
        </div>
        <Button asChild size="lg" className="h-16 px-10 rounded-2xl text-lg font-bold group shadow-2xl shadow-primary/20">
          <Link href="/">
            Go Shopping
            <ArrowRight className="ml-2 w-6 h-6 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="content-container py-20 lg:py-32">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          {/* Main Cart Items */}
          <div className="flex-1 space-y-10">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-heading font-black tracking-tighter italic uppercase">
                YOUR CART.
              </h1>
              <p className="text-muted-foreground font-medium text-lg italic">
                Review your selection before we lock it in.
              </p>
            </div>

            <div className="space-y-6">
              {items.map((item) => {
                const itemPrice = item.price - (item.discount || 0);
                return (
                  <Card
                    key={item.id}
                    className="p-8 rounded-[32px] border-2 border-black/5 hover:border-black/10 transition-all group overflow-hidden"
                  >
                    <div className="flex flex-col sm:flex-row items-center gap-8">
                      {/* Image */}
                      <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-2xl bg-secondary ring-1 ring-black/5 group-hover:scale-95 transition-transform duration-500">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 text-center sm:text-left space-y-4 w-full">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                          <div className="space-y-1">
                            <h3 className="text-2xl font-black italic tracking-tight group-hover:text-primary transition-colors">
                              {item.name.toUpperCase()}
                            </h3>
                            <p className="text-sm font-bold text-muted-foreground/60 italic">
                             Unit Price: {formatPrice(itemPrice)}
                            </p>
                          </div>
                          <p className="text-2xl font-black text-primary italic">
                            {formatPrice(itemPrice * item.quantity)}
                          </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4 border-t border-black/5">
                          <div className="flex items-center p-1.5 bg-secondary/50 rounded-xl ring-1 ring-black/5">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9 rounded-lg hover:bg-white shadow-sm transition-all"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="w-12 text-center font-black">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9 rounded-lg hover:bg-white shadow-sm transition-all"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-600 hover:bg-red-50 flex items-center gap-2 font-black italic rounded-xl px-4"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                            REMOVE
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Checkout Summary */}
          <div className="w-full lg:w-[400px] flex-shrink-0 sticky top-32">
            <Card className="p-10 rounded-[40px] border-2 border-primary bg-primary text-white space-y-10 shadow-2xl shadow-primary/40">
              <div className="space-y-4 border-b border-white/20 pb-10">
                <h2 className="text-3xl font-heading font-black tracking-tighter italic uppercase">
                  Order Summary
                </h2>
                <div className="flex justify-between items-center text-white/70 italic font-medium">
                  <span>Total Items</span>
                  <span>{totalItems()} pcs</span>
                </div>
              </div>

              <div className="space-y-6 text-xl">
                <div className="flex justify-between items-center text-white/70 font-medium italic">
                  <span>Subtotal</span>
                  <span className="font-bold">{formatPrice(totalPrice())}</span>
                </div>
                <div className="flex justify-between items-center text-white/70 font-medium italic">
                  <span>Shipping</span>
                  <span className="font-bold italic">FREE</span>
                </div>
                <div className="flex justify-between items-center text-4xl font-black italic pt-6 border-t border-white/20">
                  <span>Total</span>
                  <span>{formatPrice(totalPrice())}</span>
                </div>
              </div>

              <Button
                asChild
                className="w-full h-20 rounded-[28px] bg-white text-primary hover:bg-white/90 text-2xl font-black italic group"
              >
                <Link href="/checkout">
                  CHECKOUT NOW
                  <ArrowRight className="ml-3 w-8 h-8 transition-transform group-hover:translate-x-2" />
                </Link>
              </Button>

              <p className="text-center text-xs font-black italic text-white/40 tracking-widest uppercase">
                SECURE TRANSACTION GUARANTEED
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
