export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  image: string; // compatibility
  mediaUrl: string;
  mediaType: "image" | "video";
  ctaText?: string;
  ctaLink?: string;
  buttonText?: string; // mapping convenience
  buttonLink?: string;
  displayOrder: number;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
}
