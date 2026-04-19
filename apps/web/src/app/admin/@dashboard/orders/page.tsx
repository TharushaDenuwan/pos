import { OrdersList } from "@/features/orders/components/orders-list";

export default function OrdersPage() {
  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter">
            Orders Management
          </h1>
          <p className="text-muted-foreground mt-2 font-medium">
            View and manage all customer orders
          </p>
        </div>
      </div>

      <OrdersList />
    </div>
  );
}
