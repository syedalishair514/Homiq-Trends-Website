import { ROUTES } from "./routes";

export const NAV_LINKS = [
  { label: "Home", href: ROUTES.HOME },
  { label: "Categories", href: ROUTES.CATEGORIES },
  { label: "Products", href: ROUTES.PRODUCTS },
  { label: "About", href: ROUTES.ABOUT },
  { label: "Contact", href: ROUTES.CONTACT },
];

export const FOOTER_LINKS = {
  shop: [
    { label: "All Products", href: ROUTES.PRODUCTS },
    { label: "New Arrivals", href: `${ROUTES.PRODUCTS}?filter=new` },
    { label: "Best Sellers", href: `${ROUTES.PRODUCTS}?filter=featured` },
    { label: "Luxury Decor", href: `${ROUTES.CATEGORIES}/decor` },
    { label: "High Fashion", href: `${ROUTES.CATEGORIES}/fashion` },
  ],
  company: [
    { label: "Our Story", href: ROUTES.ABOUT },
    { label: "Sustainability", href: "/sustainability" },
    { label: "Careers", href: "/careers" },
    { label: "Press", href: "/press" },
  ],
  support: [
    { label: "Contact Us", href: ROUTES.CONTACT },
    { label: "Shipping & Delivery", href: "/shipping" },
    { label: "Returns & Exchanges", href: "/returns" },
    { label: "FAQ", href: "/faq" },
    { label: "Size Guide", href: "/size-guide" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms & Conditions", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
  ],
};
