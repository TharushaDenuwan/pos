"use client";

import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@repo/ui/components/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@repo/ui/components/table";
import { IconEye, IconFilter, IconSearch } from "@tabler/icons-react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getAllOrders } from "../actions/getAll.action";

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
  confirmed: "bg-blue-100 text-blue-800 border-blue-300",
  shipped: "bg-purple-100 text-purple-800 border-purple-300",
  delivered: "bg-green-100 text-green-800 border-green-300",
  cancelled: "bg-red-100 text-red-800 border-red-300",
};

export function OrdersList() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await getAllOrders({
        status: statusFilter,
        search: searchQuery,
      });
      setOrders(res.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleSearch = () => {
    fetchOrders();
  };

  if (loading) {
    return (
      <div className="p-12 text-center animate-pulse italic font-bold text-muted-foreground uppercase tracking-widest">
        Loading orders...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">
            Search Orders
          </label>
          <div className="flex gap-2">
            <Input
              placeholder="Search by order number or customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="h-11 rounded-xl"
            />
            <Button onClick={handleSearch} className="h-11 rounded-xl px-6">
              <IconSearch size={18} />
            </Button>
          </div>
        </div>

        <div className="w-full md:w-[200px] space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <IconFilter size={14} />
            Filter by Status
          </label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-11 rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-3xl border bg-white/50 backdrop-blur-sm overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-secondary/20">
            <TableRow className="hover:bg-transparent">
              <TableHead className="py-6 px-6 font-black uppercase text-[10px] tracking-widest">
                Order #
              </TableHead>
              <TableHead className="py-6 font-black uppercase text-[10px] tracking-widest">
                Customer
              </TableHead>
              <TableHead className="py-6 font-black uppercase text-[10px] tracking-widest">
                Amount
              </TableHead>
              <TableHead className="py-6 font-black uppercase text-[10px] tracking-widest">
                Payment
              </TableHead>
              <TableHead className="py-6 font-black uppercase text-[10px] tracking-widest text-center">
                Status
              </TableHead>
              <TableHead className="py-6 font-black uppercase text-[10px] tracking-widest">
                Date
              </TableHead>
              <TableHead className="py-6 pr-6 font-black uppercase text-[10px] tracking-widest text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-20 italic text-muted-foreground">
                  No orders found.
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow
                  key={order.id}
                  className="group transition-colors hover:bg-secondary/5"
                >
                  <TableCell className="px-6 py-4">
                    <span className="font-mono font-bold text-sm">
                      {order.orderNumber}
                    </span>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold">{order.customerName}</span>
                      {order.customerPhone && (
                        <span className="text-xs text-muted-foreground">
                          {order.customerPhone}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <span className="font-black text-lg">
                      ${(order.totalAmount / 100).toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge
                      variant="outline"
                      className="rounded-full px-3 py-1 text-[10px] font-bold uppercase"
                    >
                      {order.paymentMethod}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4 text-center">
                    <Badge
                      className={`rounded-full font-black uppercase text-[9px] tracking-widest px-3 border ${
                        STATUS_COLORS[order.status as keyof typeof STATUS_COLORS] ||
                        "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4">
                    <span className="text-sm text-muted-foreground">
                      {order.createdAt
                        ? format(new Date(order.createdAt), "MMM dd, yyyy")
                        : "N/A"}
                    </span>
                  </TableCell>
                  <TableCell className="py-4 pr-6 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-xl hover:bg-primary/10 hover:text-primary"
                      onClick={() => router.push(`/admin/orders/${order.id}`)}
                    >
                      <IconEye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
