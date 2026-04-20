export type Product = {
  id: string;
  title: string;
  description?: string;
  price: number; // Stored in cents, formatted on display
  originalPrice?: number;
  category: string;
  image: string;
  images?: string[];
  rating: number; // 0-5
  reviews: number;
  isNew?: boolean;
  isSale?: boolean;
  isFeatured?: boolean;
  stockQuantity?: number;
};

// We will fetch products from API, so mocks are empty/unused but kept for type reference if needed by legacy code for a moment
export const MOCK_PRODUCTS: Product[] = [];

export const CATEGORIES = [
  { name: "Menswear", image: "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?q=80&w=800&auto=format&fit=crop", slug: "menswear" },
  { name: "Footwear", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop", slug: "footwear" },
  { name: "Accessories", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop", slug: "accessories" },
  { name: "Electronics", image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=800&auto=format&fit=crop", slug: "electronics" },
];

