export interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  price: number;
  salePrice?: number;
  discountPercentage?: number;
  images: string[];
  category: string;
  rating: number;
  reviewsCount: number;
  stock: number;
  isFeatured?: boolean;
  bestSeller?: boolean;
  newArrival?: boolean;
  isNew?: boolean; // backwards compatibility
  attributes?: Record<string, string[]>;
  createdAt: string;
}
