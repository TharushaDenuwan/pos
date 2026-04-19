import { OrderDetails } from "@/features/orders/components/order-details";

interface OrderDetailsPageProps {
  params: {
    id: string;
  };
}

export default function OrderDetailsPage({ params }: OrderDetailsPageProps) {
  return (
    <div className="p-8">
      <OrderDetails orderId={params.id} />
    </div>
  );
}
