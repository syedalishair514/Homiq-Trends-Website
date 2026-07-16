import { z } from "zod";

// 1. Profile Validation Schema
export const profileSchema = z.object({
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/).optional(),
  fullName: z.string().min(2).max(100).optional(),
  avatarUrl: z.string().url().optional().or(z.literal("")),
  phone: z.string().max(20).optional().or(z.literal("")),
  birthday: z.string().optional().or(z.literal("")),
  location: z.string().max(150).optional().or(z.literal(""))
});

// 2. Category Validation Schema
export const categorySchema = z.object({
  name: z.string().min(2).max(50),
  slug: z.string().min(2).max(50).regex(/^[a-z0-9-]+$/),
  description: z.string().max(500).optional(),
  imageUrl: z.string().url().optional().or(z.literal(""))
});

// 3. Product Validation Schema
export const productSchema = z.object({
  name: z.string().min(2).max(150),
  slug: z.string().min(2).max(150).regex(/^[a-z0-9-]+$/),
  description: z.string().min(10).max(2000),
  shortDescription: z.string().max(200).optional(),
  price: z.number().positive(),
  salePrice: z.number().positive().optional().nullable(),
  sku: z.string().min(3).max(50),
  stock: z.number().int().nonnegative(),
  rating: z.number().min(0).max(5).optional(),
  reviewsCount: z.number().int().nonnegative().optional()
});

// 4. Address Validation Schema
export const addressSchema = z.object({
  fullName: z.string().min(2).max(100),
  addressLine1: z.string().min(5).max(200),
  addressLine2: z.string().max(200).optional(),
  city: z.string().min(2).max(100),
  state: z.string().min(2).max(100),
  postalCode: z.string().min(3).max(20),
  country: z.string().min(2).max(100),
  phone: z.string().max(20).optional(),
  isDefault: z.boolean().default(false)
});

// 5. Order Validation Schema
export const orderSchema = z.object({
  addressId: z.string().uuid(),
  total: z.number().positive(),
  tax: z.number().nonnegative().default(0),
  shipping: z.number().nonnegative().default(0),
  discount: z.number().nonnegative().default(0),
  items: z.array(z.object({
    productId: z.string().uuid(),
    quantity: z.number().int().positive(),
    price: z.number().positive()
  })).min(1)
});

// 6. Review Validation Schema
export const reviewSchema = z.object({
  productId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(1000).optional()
});

// 7. Coupon Validation Schema
export const couponSchema = z.object({
  code: z.string().min(3).max(20).toUpperCase(),
  discountPercent: z.number().int().min(1).max(100),
  maxRedemptions: z.number().int().positive().optional().nullable(),
  expiresAt: z.string().optional().nullable()
});
