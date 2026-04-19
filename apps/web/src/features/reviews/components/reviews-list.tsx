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
    IconCheck,
    IconFilter,
    IconStar,
    IconStarFilled,
    IconX,
} from "@tabler/icons-react";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getAllReviews } from "../actions/getAll.action";
import { approveReview, rejectReview } from "../actions/updateStatus.action";

export function ReviewsList() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const isApproved = filter === "approved" ? true : filter === "pending" ? false : null;
      const res = await getAllReviews({ isApproved });
      setReviews(res.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [filter]);

  const handleApprove = async (reviewId: string) => {
    setUpdating(reviewId);
    try {
      await approveReview(reviewId);
      toast.success("Review approved");
      fetchReviews();
    } catch (error) {
      toast.error("Failed to approve review");
    } finally {
      setUpdating(null);
    }
  };

  const handleReject = async (reviewId: string) => {
    setUpdating(reviewId);
    try {
      await rejectReview(reviewId);
      toast.success("Review rejected");
      fetchReviews();
    } catch (error) {
      toast.error("Failed to reject review");
    } finally {
      setUpdating(null);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <div key={star}>
            {star <= rating ? (
              <IconStarFilled size={16} className="text-yellow-500" />
            ) : (
              <IconStar size={16} className="text-gray-300" />
            )}
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-12 text-center animate-pulse italic font-bold text-muted-foreground uppercase tracking-widest">
        Loading reviews...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter */}
      <div className="flex justify-end">
        <div className="w-[200px] space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <IconFilter size={14} />
            Filter Reviews
          </label>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="h-11 rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Reviews</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 gap-4">
        {reviews.length === 0 ? (
          <Card className="p-12 text-center text-muted-foreground rounded-2xl">
            No reviews found.
          </Card>
        ) : (
          reviews.map((review) => (
            <Card
              key={review.id}
              className="p-6 rounded-2xl border-2 hover:shadow-md transition-shadow"
            >
              <div className="flex gap-6">
                {/* Product Image */}
                <div className="w-24 h-24 rounded-xl overflow-hidden border bg-secondary flex-shrink-0">
                  {review.productImage ? (
                    <img
                      src={review.productImage}
                      alt={review.productName || "Product"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                      No image
                    </div>
                  )}
                </div>

                {/* Review Content */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-lg">
                        {review.productName || "Unknown Product"}
                      </h3>
                      <div className="flex items-center gap-3 mt-1">
                        {renderStars(review.rating || 0)}
                        <span className="text-sm text-muted-foreground">
                          by {review.customerName || "Anonymous"}
                        </span>
                      </div>
                    </div>
                    <Badge
                      variant={review.isApproved ? "default" : "secondary"}
                      className="rounded-full font-bold uppercase text-[9px] tracking-widest px-3"
                    >
                      {review.isApproved ? "Approved" : "Pending"}
                    </Badge>
                  </div>

                  {review.comment && (
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      "{review.comment}"
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="text-xs text-muted-foreground">
                      {review.customerEmail && (
                        <span className="mr-4">{review.customerEmail}</span>
                      )}
                      <span>
                        {review.createdAt
                          ? format(new Date(review.createdAt), "MMM dd, yyyy")
                          : "N/A"}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      {!review.isApproved && (
                        <Button
                          size="sm"
                          onClick={() => handleApprove(review.id)}
                          disabled={updating === review.id}
                          className="rounded-xl bg-green-600 hover:bg-green-700"
                        >
                          <IconCheck size={16} className="mr-1" />
                          Approve
                        </Button>
                      )}
                      {review.isApproved && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleReject(review.id)}
                          disabled={updating === review.id}
                          className="rounded-xl"
                        >
                          <IconX size={16} className="mr-1" />
                          Reject
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
