"use client";

import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/ui/components/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
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
import { Textarea } from "@repo/ui/components/textarea";
import { Star } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { createReview } from "../actions/create.action";

const reviewSchema = z.object({
  customerName: z.string().min(2, "Name is required"),
  customerEmail: z.string().email("Valid email is required"),
  rating: z.number().min(1).max(5),
  comment: z.string().min(10, "Review must be at least 10 characters"),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
  productId: string;
}

export function ReviewForm({ productId }: ReviewFormProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      rating: 5,
      comment: "",
    },
  });

  const onSubmit = async (data: ReviewFormValues) => {
    setIsSubmitting(true);
    try {
      const res = await createReview({
        ...data,
        productId,
      });

      if (res.success) {
        toast.success("Review submitted! It will appear after approval.");
        setOpen(false);
        form.reset();
      } else {
        toast.error(res.error || "Failed to submit review");
      }
    } catch (error) {
      toast.error("Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg" className="rounded-2xl font-bold border-black/10 hover:bg-white hover:text-primary transition-all">
          Write a Review
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-[32px] p-8">
        <DialogHeader>
          <DialogTitle className="font-heading italic text-3xl font-black">Share your thoughts</DialogTitle>
          <DialogDescription className="text-muted-foreground font-medium">
            Tell us about your experience with this masterpiece.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Rating</FormLabel>
                  <FormControl>
                    <div className="flex gap-2 justify-center py-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          className={cn(
                            "p-1 transition-transform hover:scale-110 focus:outline-none",
                            field.value >= star ? "text-primary scale-105" : "text-muted-foreground/20"
                          )}
                          onClick={() => field.onChange(star)}
                        >
                          <Star className={cn("w-8 h-8", field.value >= star && "fill-current")} />
                        </button>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="customerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" {...field} className="h-12 rounded-xl bg-secondary/30 border-transparent focus:bg-white focus:border-primary transition-all" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

             <FormField
              control={form.control}
              name="customerEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="john@example.com" {...field} className="h-12 rounded-xl bg-secondary/30 border-transparent focus:bg-white focus:border-primary transition-all" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Review</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Share details of your own experience..." {...field} className="rounded-xl min-h-[120px] resize-none bg-secondary/30 border-transparent focus:bg-white focus:border-primary transition-all p-4" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-2">
              <Button type="submit" size="lg" className="w-full rounded-xl font-bold italic text-lg shadow-lg hover:shadow-xl transition-all" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
