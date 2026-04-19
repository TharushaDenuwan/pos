"use client";

import { useCartStore } from "@/features/cart/store/useCartStore";
import { createOrder } from "@/features/orders/actions/create.action";
import { CheckoutFormValues, checkoutSchema } from "@/features/orders/schemas/checkout";
import { formatPrice } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/ui/components/button";
import { Card } from "@repo/ui/components/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@repo/ui/components/form";
import { Input } from "@repo/ui/components/input";
import { Textarea } from "@repo/ui/components/textarea";
import { ArrowRight, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // We need to handle hydration mismatch for cart store which is persisted in local storage
  // A simple way is to use a mounted state, or just suppress hydration warning if simple
  // But for now, we assume it's fine or we can add a check. `persist` middleware usually handles rehydration.

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      customerAddress: "",
    },
  });

  const onSubmit = async (data: CheckoutFormValues) => {
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setIsSubmitting(true);
    try {
      const orderData = {
        ...data,
        totalAmount: totalPrice(),
        paymentMethod: "COD" as const,
        items: items.map((item) => ({
          id: item.id,
          quantity: item.quantity,
          price: item.price - (item.discount || 0),
        })),
      };

      const result = await createOrder(orderData);

      if (result.success) {
        toast.success("Order placed successfully!");
        clearCart();
        router.push(`/checkout/success?orderId=${result.orderId}`);
      } else {
        toast.error(result.error || "Failed to place order");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
     return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-8 content-container">
        <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center text-muted-foreground/30 animate-pulse">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-heading font-black tracking-tighter italic uppercase text-primary">
            Cart Empty
          </h1>
          <Button asChild size="lg" className="h-16 px-10 rounded-2xl text-lg font-bold group shadow-2xl shadow-primary/20">
            <Link href="/">
              Go Shopping
              <ArrowRight className="ml-2 w-6 h-6 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="content-container py-20 lg:py-32">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          {/* Checkout Form */}
          <div className="flex-1 space-y-10 w-full">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-heading font-black tracking-tighter italic uppercase">
                CHECKOUT.
              </h1>
              <p className="text-muted-foreground font-medium text-lg italic">
                Enter your details to complete the purchase.
              </p>
            </div>

            <Card className="p-8 md:p-12 rounded-[32px] border-2 border-black/5 hover:border-black/10 transition-all">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="customerName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold uppercase tracking-wider text-xs text-muted-foreground">Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} className="h-14 rounded-xl text-lg bg-secondary/30 border-transparent focus:bg-white focus:border-primary transition-all" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="customerEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-bold uppercase tracking-wider text-xs text-muted-foreground">Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="john@example.com" {...field} className="h-14 rounded-xl text-lg bg-secondary/30 border-transparent focus:bg-white focus:border-primary transition-all" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="customerPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-bold uppercase tracking-wider text-xs text-muted-foreground">Phone</FormLabel>
                            <FormControl>
                              <Input type="tel" placeholder="+1 (555) 000-0000" {...field} className="h-14 rounded-xl text-lg bg-secondary/30 border-transparent focus:bg-white focus:border-primary transition-all" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="customerAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold uppercase tracking-wider text-xs text-muted-foreground">Shipping Address</FormLabel>
                          <FormControl>
                            <Textarea placeholder="123 Fashion St, New York, NY" {...field} className="min-h-[120px] rounded-xl text-lg p-4 bg-secondary/30 border-transparent focus:bg-white focus:border-primary transition-all resize-none" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Payment Method - Only COD for now */}
                   <div className="pt-8 border-t border-black/5">
                      <h3 className="font-bold text-lg mb-4 italic">Payment Method</h3>
                      <div className="p-6 rounded-xl border-2 border-primary bg-primary/5 text-primary font-bold flex items-center gap-4 cursor-pointer hover:bg-primary/10 transition-colors">
                        <div className="w-6 h-6 rounded-full border-[6px] border-primary" />
                        Cash on Delivery (COD)
                      </div>
                   </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full h-20 rounded-[24px] text-xl font-black italic shadow-2xl shadow-primary/20 hover:scale-[1.01] transition-transform group mt-4"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "PROCESSING..." : "PLACE ORDER"}
                    {!isSubmitting && <ArrowRight className="ml-3 w-6 h-6 transition-transform group-hover:translate-x-1" />}
                  </Button>
                </form>
              </Form>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-[400px] flex-shrink-0 sticky top-32">
             <Card className="p-8 rounded-[32px] bg-secondary/30 border-2 border-transparent space-y-8">
                <div className="flex items-center justify-between">
                    <h3 className="font-heading font-black text-2xl italic uppercase">In Your Bag</h3>
                    <span className="font-bold text-muted-foreground bg-white px-3 py-1 rounded-full text-xs box-shadow-sm">{items.length} Items</span>
                </div>

                <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 items-center group">
                       <div className="w-20 h-20 rounded-2xl bg-white flex-shrink-0 overflow-hidden border border-black/5 group-hover:scale-95 transition-transform">
                         <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                       </div>
                       <div className="flex-1 min-w-0">
                         <p className="font-bold truncate text-sm mb-1">{item.name}</p>
                         <p className="text-xs text-muted-foreground font-medium">Qty: {item.quantity}</p>
                       </div>
                       <div className="text-right">
                         <p className="font-bold text-sm">
                           {formatPrice((item.price - (item.discount || 0)) * item.quantity)}
                         </p>
                       </div>
                    </div>
                  ))}
                </div>

                <div className="pt-8 border-t border-black/5 space-y-3">
                   <div className="flex justify-between font-medium text-muted-foreground">
                      <span>Subtotal</span>
                      <span className="font-bold text-foreground">{formatPrice(totalPrice())}</span>
                   </div>
                   <div className="flex justify-between font-medium text-muted-foreground">
                      <span>Shipping</span>
                      <span className="text-green-600 font-bold uppercase tracking-wider text-xs bg-green-100 px-2 py-1 rounded-md">Free</span>
                   </div>
                   <div className="flex justify-between text-3xl font-black italic text-primary pt-6 border-t border-black/5">
                      <span>Total</span>
                      <span>{formatPrice(totalPrice())}</span>
                   </div>
                </div>
             </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
