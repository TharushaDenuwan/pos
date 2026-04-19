"use client";

import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { Card } from "@repo/ui/components/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@repo/ui/components/select";
import {
    IconArrowLeft,
    IconCreditCard,
    IconMail,
    IconMapPin,
    IconPackage,
    IconPhone,
    IconUser,
} from "@tabler/icons-react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getOrderById } from "../actions/getById.action";
import { updateOrderStatus } from "../actions/updateStatus.action";

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  { value: "confirmed", label: "Confirmed", color: "bg-blue-100 text-blue-800" },
  { value: "shipped", label: "Shipped", color: "bg-purple-100 text-purple-800" },
  { value: "delivered", label: "Delivered", color: "bg-green-100 text-green-800" },
  { value: "cancelled", label: "Cancelled", color: "bg-red-100 text-red-800" },
];

interface OrderDetailsProps {
  orderId: string;
}

export function OrderDetails({ orderId }: OrderDetailsProps) {
  const [order, setOrder] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const router = useRouter();

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const data = await getOrderById(orderId);
      setOrder(data.order);
      setItems(data.items);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch order details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const handleStatusUpdate = async (newStatus: string) => {
    setUpdating(true);
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success("Order status updated successfully");
      fetchOrder();
    } catch (error) {
      toast.error("Failed to update order status");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center animate-pulse italic font-bold text-muted-foreground uppercase tracking-widest">
        Loading order details...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-12 text-center text-muted-foreground">Order not found</div>
    );
  }

  const currentStatus = STATUS_OPTIONS.find((s) => s.value === order.status);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="rounded-xl"
          >
            <IconArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-3xl font-black italic uppercase tracking-tighter">
              Order #{order.orderNumber}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Placed on {order.createdAt ? format(new Date(order.createdAt), "MMMM dd, yyyy 'at' hh:mm a") : "N/A"}
            </p>
          </div>
        </div>

        {/* Status Update */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">
              Update Status
            </p>
            <Select
              value={order.status}
              onValueChange={handleStatusUpdate}
              disabled={updating}
            >
              <SelectTrigger className="w-[180px] h-11 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Information */}
        <Card className="p-6 space-y-4 rounded-2xl border-2">
          <h2 className="text-lg font-black italic uppercase tracking-tighter flex items-center gap-2">
            <IconUser size={20} className="text-primary" />
            Customer Information
          </h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <IconUser size={16} className="text-muted-foreground mt-1" />
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Name
                </p>
                <p className="font-semibold">{order.customerName}</p>
              </div>
            </div>
            {order.customerEmail && (
              <div className="flex items-start gap-3">
                <IconMail size={16} className="text-muted-foreground mt-1" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Email
                  </p>
                  <p className="font-semibold">{order.customerEmail}</p>
                </div>
              </div>
            )}
            {order.customerPhone && (
              <div className="flex items-start gap-3">
                <IconPhone size={16} className="text-muted-foreground mt-1" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Phone
                  </p>
                  <p className="font-semibold">{order.customerPhone}</p>
                </div>
              </div>
            )}
            {order.customerAddress && (
              <div className="flex items-start gap-3">
                <IconMapPin size={16} className="text-muted-foreground mt-1" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Address
                  </p>
                  <p className="font-semibold">{order.customerAddress}</p>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Payment & Status */}
        <Card className="p-6 space-y-4 rounded-2xl border-2">
          <h2 className="text-lg font-black italic uppercase tracking-tighter flex items-center gap-2">
            <IconCreditCard size={20} className="text-primary" />
            Payment & Status
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
                Payment Method
              </p>
              <Badge variant="outline" className="rounded-full px-4 py-2 text-sm font-bold">
                {order.paymentMethod}
              </Badge>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
                Order Status
              </p>
              <Badge
                className={`rounded-full font-black uppercase text-sm tracking-widest px-4 py-2 ${
                  currentStatus?.color || "bg-gray-100 text-gray-800"
                }`}
              >
                {currentStatus?.label || order.status}
              </Badge>
            </div>
            <div className="pt-4 border-t">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
                Total Amount
              </p>
              <p className="text-3xl font-black italic">
                ${(order.totalAmount / 100).toFixed(2)}
              </p>
            </div>
          </div>
        </Card>

        {/* Order Summary */}
        <Card className="p-6 space-y-4 rounded-2xl border-2">
          <h2 className="text-lg font-black italic uppercase tracking-tighter flex items-center gap-2">
            <IconPackage size={20} className="text-primary" />
            Order Summary
          </h2>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Items</span>
              <span className="font-bold">{items.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-bold">${(order.totalAmount / 100).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span className="font-bold">$0.00</span>
            </div>
            <div className="pt-2 border-t flex justify-between">
              <span className="font-black uppercase text-sm">Total</span>
              <span className="font-black text-xl">${(order.totalAmount / 100).toFixed(2)}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Order Items */}
      <Card className="p-6 rounded-2xl border-2">
        <h2 className="text-lg font-black italic uppercase tracking-tighter mb-6">
          Order Items
        </h2>
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 p-4 rounded-xl border bg-secondary/5 hover:bg-secondary/10 transition-colors"
            >
              <div className="w-16 h-16 rounded-lg overflow-hidden border bg-white flex-shrink-0">
                {item.productImage ? (
                  <img
                    src={item.productImage}
                    alt={item.productName || "Product"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                    No image
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg">{item.productName || "Unknown Product"}</h3>
                <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
              </div>
              <div className="text-right">
                <p className="font-black text-xl">${((item.price * item.quantity) / 100).toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">
                  ${(item.price / 100).toFixed(2)} each
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
