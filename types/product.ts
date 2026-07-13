export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  salePrice?: number;
  images: string[];
  category: string;
  rating: number;
  reviewsCount: number;
  stock: number;
  isFeatured?: boolean;
  isNew?: boolean;
  attributes?: Record<string, string[]>;
  createdAt: string;
}
