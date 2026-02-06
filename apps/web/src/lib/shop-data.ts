export type Product = {
  id: number;
  title: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  reviews: number;
  isNew?: boolean;
  isSale?: boolean;
};

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    title: "Premium Cotton Oxford Shirt",
    price: 59,
    category: "Menswear",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800&auto=format&fit=crop",
    rating: 4.8,
    reviews: 124,
    isNew: true,
  },
  {
    id: 2,
    title: "Ultralight Performance Runners",
    price: 129,
    category: "Footwear",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop",
    rating: 4.9,
    reviews: 89,
    isSale: true,
  },
  {
    id: 3,
    title: "Minimalist Leather Backpack",
    price: 189,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop",
    rating: 4.7,
    reviews: 56,
  },
  {
    id: 4,
    title: "Tech-Fiber Field Jacket",
    price: 249,
    category: "Menswear",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop",
    rating: 4.6,
    reviews: 42,
    isNew: true,
  },
  {
    id: 5,
    title: "Aviator Gold-Frame Sunglasses",
    price: 159,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1511499767390-91f99874593f?q=80&w=800&auto=format&fit=crop",
    rating: 4.5,
    reviews: 110,
  },
  {
    id: 6,
    title: "Classic Knit Wool Sweater",
    price: 89,
    category: "Menswear",
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=800&auto=format&fit=crop",
    rating: 4.7,
    reviews: 75,
    isSale: true,
  },
  {
    id: 7,
    title: "Urban Explorer Smart Watch",
    price: 349,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop",
    rating: 4.9,
    reviews: 215,
    isNew: true,
  },
  {
    id: 8,
    title: "Studio-Grade Wireless Headphones",
    price: 299,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop",
    rating: 4.8,
    reviews: 340,
  }
];

export const CATEGORIES = [
  { name: "Menswear", image: "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?q=80&w=800&auto=format&fit=crop", slug: "menswear" },
  { name: "Footwear", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop", slug: "footwear" },
  { name: "Accessories", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop", slug: "accessories" },
  { name: "Electronics", image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=800&auto=format&fit=crop", slug: "electronics" },
];

export const NAV_LINKS = [
  { name: "New Arrivals", href: "/new-arrivals" },
  { name: "Menswear", href: "/menswear" },
  { name: "Electronics", href: "/electronics" },
  { name: "Sale", href: "/sale" },
  { name: "Collections", href: "/collections" },
];
