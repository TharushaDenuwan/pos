import { getProductById } from "@/features/products/actions/getById.action";
import { ProductImageGallery } from "@/features/products/components/ProductImageGallery";
import { ProductInfo } from "@/features/products/components/ProductInfo";
import { getApprovedReviewsByProduct } from "@/features/reviews/actions/getApprovedByProduct.action";
import { ReviewForm } from "@/features/reviews/components/review-form";
import { Card } from "@repo/ui/components/card";
import { IconStarFilled } from "@tabler/icons-react";
import { format } from "date-fns";
import { notFound } from "next/navigation";

export default async function ProductPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { data: product } = await getProductById(id);

  if (!product) {
    notFound();
  }

  const { data: reviews } = await getApprovedReviewsByProduct(id);

  return (
    <div className="bg-white min-h-screen">
      <div className="content-container py-20 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          <ProductImageGallery images={product.images || []} mainImage={product.image} />
          <ProductInfo product={product} />
        </div>

        {/* Reviews Section */}
        <section className="mt-32 border-t border-black/5 pt-20">
          <div className="max-w-4xl mx-auto space-y-16">
            <div className="text-center space-y-4">
              <h2 className="text-4xl md:text-5xl font-heading font-black tracking-tighter italic">
                CUSTOMER VOICES.
              </h2>
              <div className="flex flex-col items-center gap-6">
                <p className="text-muted-foreground font-medium text-lg italic">
                  What the community is saying about this drop.
                </p>
                <ReviewForm productId={id} />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
              {reviews.length === 0 ? (
                <div className="text-center py-20 bg-secondary/30 rounded-[40px] border-2 border-dashed border-black/5">
                  <p className="font-bold text-muted-foreground italic uppercase tracking-widest">
                    No reviews yet. Be the first to break the silence.
                  </p>
                </div>
              ) : (
                reviews.map((review: any) => (
                  <Card
                    key={review.id}
                    className="p-10 rounded-[32px] border-2 border-black/5 hover:border-primary/20 transition-all group"
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                      <div className="space-y-4">
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <IconStarFilled
                              key={i}
                              size={20}
                              className={
                                i < (review.rating || 0)
                                  ? "text-primary"
                                  : "text-muted-foreground/20"
                              }
                            />
                          ))}
                        </div>
                        <p className="text-xl font-medium text-foreground italic leading-relaxed">
                          "{review.comment}"
                        </p>
                      </div>
                      <div className="text-left md:text-right space-y-1 min-w-[150px]">
                        <p className="font-black text-sm uppercase tracking-wider text-primary">
                          {review.customerName || "Anonymous"}
                        </p>
                        <p className="text-xs font-bold text-muted-foreground/60">
                          {review.createdAt
                            ? format(new Date(review.createdAt), "MMM dd, yyyy")
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
