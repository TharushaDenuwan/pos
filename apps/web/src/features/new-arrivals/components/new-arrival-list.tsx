"use client";

import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@repo/ui/components/table";
import { IconEdit, IconPhoto, IconStar, IconTrash } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { deleteNewArrival } from "../actions/delete.action";
import { getAllNewArrivals } from "../actions/getAll.action";

export function NewArrivalList() {
  const [arrivals, setArrivals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchArrivals = async () => {
    setLoading(true);
    try {
      const res = await getAllNewArrivals();
      setArrivals(res.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch new arrivals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArrivals();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this new arrival?")) return;
    try {
      await deleteNewArrival(id);
      toast.success("New arrival deleted");
      fetchArrivals();
    } catch (error) {
      toast.error("Failed to delete new arrival");
    }
  };

  if (loading) return <div className="p-12 text-center animate-pulse italic font-bold text-muted-foreground uppercase tracking-widest">Loading arrivals...</div>;

  return (
    <div className="rounded-3xl border bg-white/50 backdrop-blur-sm overflow-hidden shadow-sm">
      <Table>
        <TableHeader className="bg-secondary/20">
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[120px] py-6 px-6 font-black uppercase text-[10px] tracking-widest">Images</TableHead>
            <TableHead className="py-6 font-black uppercase text-[10px] tracking-widest">Product</TableHead>
            <TableHead className="py-6 font-black uppercase text-[10px] tracking-widest">Category</TableHead>
            <TableHead className="py-6 font-black uppercase text-[10px] tracking-widest">Price</TableHead>
            <TableHead className="py-6 font-black uppercase text-[10px] tracking-widest text-center">Featured</TableHead>
            <TableHead className="py-6 font-black uppercase text-[10px] tracking-widest text-center">Status</TableHead>
            <TableHead className="py-6 pr-6 font-black uppercase text-[10px] tracking-widest text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {arrivals.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-20 italic text-muted-foreground">
                No arrivals found. Create one above to get started.
              </TableCell>
            </TableRow>
          ) : (
            arrivals.map((arrival) => {
              const images = arrival.images || [];
              const hasMultipleImages = images.length > 1;
              const effectivePrice = (arrival.price || 0) - (arrival.discount || 0);
              const hasDiscount = (arrival.discount || 0) > 0;

              return (
                <TableRow key={arrival.id} className="group transition-colors hover:bg-secondary/5">
                  <TableCell className="px-6 py-4">
                    <div className="flex gap-2">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-primary/10 shadow-sm group-hover:scale-105 transition-transform">
                        {arrival.image ? (
                          <img src={arrival.image} alt={arrival.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-secondary flex items-center justify-center text-[8px] font-black uppercase italic opacity-50">Empty</div>
                        )}
                      </div>
                      {hasMultipleImages && (
                        <div className="flex items-center">
                          <div className="flex flex-col gap-1">
                            <IconPhoto size={12} className="text-muted-foreground" />
                            <span className="text-[9px] font-bold text-muted-foreground">+{images.length - 1}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex flex-col gap-1">
                      <span className="font-heading font-black italic uppercase tracking-tight text-lg group-hover:text-primary transition-colors">
                        {arrival.name || "Unnamed"}
                      </span>
                      {arrival.description && (
                        <span className="text-xs text-muted-foreground line-clamp-1 max-w-[300px]">
                          {arrival.description}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge variant="outline" className="rounded-full px-4 py-1 border-primary/20 text-primary font-bold italic uppercase text-[10px] tracking-widest">
                      {arrival.category || "General"}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex flex-col gap-1">
                      <span className="font-black italic tracking-tight text-xl">
                        ${effectivePrice.toFixed(2)}
                      </span>
                      {hasDiscount && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs line-through text-muted-foreground">
                            ${(arrival.price || 0).toFixed(2)}
                          </span>
                          <Badge variant="destructive" className="text-[8px] px-2 py-0 h-4">
                            -${arrival.discount}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="py-4 text-center">
                    {arrival.isFeatured && (
                      <div className="flex justify-center">
                        <IconStar className="text-yellow-500 fill-yellow-500 w-5 h-5 animate-pulse" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="py-4 text-center">
                    <Badge variant={arrival.isActive ? "default" : "secondary"} className="rounded-full font-black uppercase text-[9px] tracking-widest px-3">
                      {arrival.isActive ? "ACTIVE" : "HIDDEN"}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4 pr-6 text-right space-x-2">
                    <Button variant="ghost" size="icon" className="rounded-xl hover:bg-primary/10 hover:text-primary">
                      <IconEdit className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-xl text-rose-500 hover:bg-rose-50 hover:text-rose-600"
                      onClick={() => handleDelete(arrival.id)}
                    >
                      <IconTrash className="h-5 w-5" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
