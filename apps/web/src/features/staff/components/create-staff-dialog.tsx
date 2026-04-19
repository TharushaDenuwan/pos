"use client";

import { client } from "@/lib/rpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/ui/components/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@repo/ui/components/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@repo/ui/components/form";
import { Input } from "@repo/ui/components/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@repo/ui/components/select";
import { IconUserPlus } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createStaffSchema, type CreateStaff } from "../schemas";

interface CreateStaffDialogProps {
  onSuccess?: () => void;
}

export function CreateStaffDialog({ onSuccess }: CreateStaffDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<CreateStaff>({
    resolver: zodResolver(createStaffSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      position: "Staff Member",
      assignedSection: "orders",
    },
  });

  const onSubmit = async (data: CreateStaff) => {
    setLoading(true);
    try {
      const res = await client["staff-profiles"].register.$post({
        json: {
          name: data.name,
          email: data.email,
          password: data.password,
          position: data.position,
          assignedSection: data.assignedSection as any,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error((errorData as any).message || "Failed to create staff account");
      }

      toast.success("Staff account created successfully");
      setOpen(false);
      form.reset();
      router.refresh();
      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 rounded-xl h-11">
          <IconUserPlus size={18} />
          Add Staff Member
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-black italic uppercase tracking-tighter flex items-center gap-2">
            <IconUserPlus size={24} className="text-primary" />
            Create Staff Account
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-black uppercase tracking-widest">Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} className="h-11 rounded-xl" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-black uppercase tracking-widest">Email Address</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="john@example.com" {...field} className="h-11 rounded-xl" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-black uppercase tracking-widest">Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="At least 6 characters" {...field} className="h-11 rounded-xl" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-black uppercase tracking-widest">Position</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Warehouse Manager" {...field} className="h-11 rounded-xl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="assignedSection"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-black uppercase tracking-widest">Section</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-11 rounded-xl">
                          <SelectValue placeholder="Select section" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="orders">Orders</SelectItem>
                        <SelectItem value="reviews">Reviews</SelectItem>
                        <SelectItem value="storage">Storage</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} className="rounded-xl h-11">
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="rounded-xl h-11 px-8">
                {loading ? "Creating..." : "Create Account"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
