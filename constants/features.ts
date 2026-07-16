import { Shield, Sparkles, Truck, Users } from "lucide-react";

export const HOME_FEATURES = [
  {
    id: "feat-1",
    title: "Premium Quality",
    description: "Meticulously selected materials and hand-finished craftsmanship.",
    icon: Sparkles,
    value: 100,
    suffix: "% Guaranteed",
  },
  {
    id: "feat-2",
    title: "Free Delivery",
    description: "Expedited premium carbon-neutral shipping on orders over $150.",
    icon: Truck,
    value: 24,
    suffix: "hr Dispatch",
  },
  {
    id: "feat-3",
    title: "Secure Checkouts",
    description: "100% encrypted bank transfers and multiple payment options.",
    icon: Shield,
    value: 256,
    suffix: "-bit SSL",
  },
  {
    id: "feat-4",
    title: "24/7 Support",
    description: "Dedicated concierge assistance to handle inquiries.",
    icon: Users,
    value: 15,
    suffix: "min Response",
  },
];
