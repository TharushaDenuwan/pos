import { OrderDetails } from "@/features/orders/components/order-details";

interface OrderDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function OrderDetailsPage({
  params,
}: OrderDetailsPageProps) {
  const resolvedParams = await params;
  return (
    <div className="p-8">
      <OrderDetails orderId={resolvedParams.id} />
    </div>
  );
}
