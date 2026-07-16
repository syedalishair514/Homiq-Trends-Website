import { Room } from "@/types/room";

export const ROOMS: Room[] = [
  {
    id: "room-1",
    name: "Living Room",
    slug: "living-room",
    description: "Bespoke ambient spaces crafted for hosting and comfort.",
    image: "/images/rooms/room-living-room.jpg",
    featured: true,
  },
  {
    id: "room-2",
    name: "Kitchen",
    slug: "kitchen",
    description: "Functional culinary setups displaying fine organic materials.",
    image: "/images/rooms/room-kitchen.jpg",
    featured: true,
  },
  {
    id: "room-3",
    name: "Bedroom",
    slug: "bedroom",
    description: "Peaceful havens of cashmere fabrics and warm dim lighting.",
    image: "/images/rooms/room-bedroom.jpg",
    featured: true,
  },
  {
    id: "room-4",
    name: "Dining Room",
    slug: "dining-room",
    description: "Refined hosting blocks featuring travertine stone tables.",
    image: "/images/rooms/room-dining-room.jpg",
    featured: false,
  },
  {
    id: "room-5",
    name: "Bathroom",
    slug: "bathroom",
    description: "Minimal spa atmospheres styled with stone catching trays.",
    image: "/images/rooms/room-bathroom.jpg",
    featured: false,
  },
  {
    id: "room-6",
    name: "Office",
    slug: "office",
    description: "Structured environments enhancing creative work output.",
    image: "/images/rooms/room-office.jpg",
    featured: true,
  },
];
