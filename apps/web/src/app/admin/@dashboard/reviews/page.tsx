import { ReviewsList } from "@/features/reviews/components/reviews-list";

export default function ReviewsPage() {
  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter">
            Reviews Management
          </h1>
          <p className="text-muted-foreground mt-2 font-medium">
            Approve or reject customer reviews
          </p>
        </div>
      </div>

      <ReviewsList />
    </div>
  );
}
