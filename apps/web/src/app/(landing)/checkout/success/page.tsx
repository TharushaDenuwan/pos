import { Button } from "@repo/ui/components/button";
import { CheckCircle2, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default async function CheckoutSuccessPage(props: {
  searchParams: Promise<{ orderId: string }>;
}) {
  const searchParams = await props.searchParams;
  const { orderId } = searchParams;

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center content-container text-center space-y-8">
      <div className="w-24 h-24 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-4 ring-8 ring-green-50 animate-bounce">
        <CheckCircle2 className="w-12 h-12" />
      </div>

      <div className="space-y-4 max-w-md">
        <h1 className="text-4xl md:text-5xl font-heading font-black tracking-tighter italic uppercase text-primary">
          Order Confirmed!
        </h1>
        <p className="text-muted-foreground font-medium text-lg">
          Thank you for your purchase. Your order has been received and is being processed.
        </p>

        {orderId && (
          <div className="p-4 bg-secondary/30 rounded-xl border border-black/5 mt-6">
            <p className="text-sm text-muted-foreground uppercase tracking-wider font-bold">Order ID</p>
            <p className="font-mono text-xl font-black text-primary">{orderId}</p>
          </div>
        )}
      </div>

      <div className="pt-8">
        <Button asChild size="lg" className="h-16 px-10 rounded-2xl text-lg font-bold group shadow-xl hover:shadow-2xl transition-all">
          <Link href="/">
            Continue Shopping
            <ShoppingBag className="ml-3 w-6 h-6 transition-transform group-hover:scale-110" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
