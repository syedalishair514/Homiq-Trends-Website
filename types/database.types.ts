export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          updated_at: string | null
          username: string | null
          full_name: string | null
          avatar_url: string | null
          phone: string | null
          birthday: string | null
          location: string | null
        }
        Insert: {
          id: string
          updated_at?: string | null
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          birthday?: string | null
          location?: string | null
        }
        Update: {
          id?: string
          updated_at?: string | null
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          birthday?: string | null
          location?: string | null
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          image_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          image_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          image_url?: string | null
          created_at?: string
        }
      }
      products: {
        Row: {
          id: string
          category: string
          name: string
          slug: string
          description: string
          short_description: string | null
          price: number
          sale_price: number | null
          sku: string
          stock: number
          rating: number | null
          reviews_count: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          category?: string
          name: string
          slug: string
          description: string
          short_description?: string | null
          price: number
          sale_price?: number | null
          sku: string
          stock?: number
          rating?: number | null
          reviews_count?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          category?: string
          name?: string
          slug?: string
          description?: string
          short_description?: string | null
          price?: number
          sale_price?: number | null
          sku?: string
          stock?: number
          rating?: number | null
          reviews_count?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      product_images: {
        Row: {
          id: string
          product_id: string
          image_url: string
          priority: number | null
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          image_url: string
          priority?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          image_url?: string
          priority?: number | null
          created_at?: string
        }
      }
      addresses: {
        Row: {
          id: string
          user_id: string
          full_name: string
          address_line1: string
          address_line2: string | null
          city: string
          state: string
          postal_code: string
          country: string
          phone: string | null
          is_default: boolean | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          full_name: string
          address_line1: string
          address_line2?: string | null
          city: string
          state: string
          postal_code: string
          country: string
          phone?: string | null
          is_default?: boolean | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          full_name?: string
          address_line1?: string
          address_line2?: string | null
          city?: string
          state?: string
          postal_code?: string
          country?: string
          phone?: string | null
          is_default?: boolean | null
          created_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string | null
          status: string
          total: number
          tax: number
          shipping: number
          discount: number
          address_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          status?: string
          total: number
          tax?: number
          shipping?: number
          discount?: number
          address_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          status?: string
          total?: number
          tax?: number
          shipping?: number
          discount?: number
          address_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string | null
          quantity: number
          price: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id?: string | null
          quantity: number
          price: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string | null
          quantity?: number
          price?: number
          created_at?: string
        }
      }
      cart_items: {
        Row: {
          id: string
          user_id: string
          product_id: string
          quantity: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          quantity?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          quantity?: number
          created_at?: string
          updated_at?: string
        }
      }
      wishlist_items: {
        Row: {
          id: string
          user_id: string
          product_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          created_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          product_id: string
          user_id: string | null
          rating: number
          comment: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          user_id?: string | null
          rating: number
          comment?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          user_id?: string | null
          rating?: number
          comment?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      hero_banners: {
        Row: {
          id: string
          heading: string
          cta_text: string | null
          cta_link: string | null
          priority: number | null
          image_url: string
          starts_at: string | null
          ends_at: string | null
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          heading: string
          cta_text?: string | null
          cta_link?: string | null
          priority?: number | null
          image_url: string
          starts_at?: string | null
          ends_at?: string | null
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          heading?: string
          cta_text?: string | null
          cta_link?: string | null
          priority?: number | null
          image_url?: string
          starts_at?: string | null
          ends_at?: string | null
          status?: string
          created_at?: string
        }
      }
      announcements: {
        Row: {
          id: string
          text: string
          starts_at: string | null
          ends_at: string | null
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          text: string
          starts_at?: string | null
          ends_at?: string | null
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          text?: string
          starts_at?: string | null
          ends_at?: string | null
          status?: string
          created_at?: string
        }
      }
      coupons: {
        Row: {
          id: string
          code: string
          discount_percent: number
          max_redemptions: number | null
          status: string
          expires_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          code: string
          discount_percent: number
          max_redemptions?: number | null
          status?: string
          expires_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          code?: string
          discount_percent?: number
          max_redemptions?: number | null
          status?: string
          expires_at?: string | null
          created_at?: string
        }
      }
      coupon_usage: {
        Row: {
          id: string
          coupon_id: string
          user_id: string
          order_id: string
          created_at: string
        }
        Insert: {
          id?: string
          coupon_id: string
          user_id: string
          order_id: string
          created_at?: string
        }
        Update: {
          id?: string
          coupon_id?: string
          user_id?: string
          order_id?: string
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          content: string
          is_read: boolean | null
          type: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          content: string
          is_read?: boolean | null
          type?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          content?: string
          is_read?: boolean | null
          type?: string
          created_at?: string
        }
      }
      settings: {
        Row: {
          id: string
          key: string
          value: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          value: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          key?: string
          value?: Json
          created_at?: string
          updated_at?: string
        }
      }
      admins: {
        Row: {
          id: string
          role: string
          created_at: string
        }
        Insert: {
          id: string
          role?: string
          created_at?: string
        }
        Update: {
          id?: string
          role?: string
          created_at?: string
        }
      }
    }
  }
}
