"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

import { createClient } from "@/lib/supabase/client";

interface Announcement {
  id: string;
  text: string;
  isActive: boolean;
  displayOrder: number;
}

const MOCK_ANNOUNCEMENTS: Announcement[] = [
  { id: "ann-1", text: "🚚 Free global shipping on orders over $150", isActive: true, displayOrder: 1 },
  { id: "ann-2", text: "🔥 Summer Sale: Up to 40% OFF with code SUM40", isActive: true, displayOrder: 2 },
  { id: "ann-3", text: "✨ New Cashmere Blankets & Stoneware Vases are now in stock", isActive: true, displayOrder: 3 },
];

export default function AnnouncementBar() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(MOCK_ANNOUNCEMENTS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    async function loadAnnouncements() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("announcements")
          .select("*")
          .eq("status", "active");

        if (!error && data && data.length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const mapped = data.map((a: any, idx: number) => ({
            id: a.id,
            text: a.text,
            isActive: true,
            displayOrder: idx
          }));
          setAnnouncements(mapped);
        } else {
          setAnnouncements(MOCK_ANNOUNCEMENTS);
        }
      } catch {
        setAnnouncements(MOCK_ANNOUNCEMENTS);
      }
    }
    loadAnnouncements();
  }, []);

  const activeAnnouncements = announcements
    .filter((a) => a.isActive)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  useEffect(() => {
    if (activeAnnouncements.length <= 1 || !isVisible) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % activeAnnouncements.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [activeAnnouncements.length, isVisible]);

  if (!isVisible || activeAnnouncements.length === 0) return null;

  return (
    <div className="w-full bg-[#151515] text-[#FCFBF7] text-[10px] sm:text-xs py-2.5 px-4 flex items-center justify-between z-50 relative border-b border-white/5 font-sans tracking-wide">
      <div className="flex-1 flex justify-center overflow-hidden h-4 items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeAnnouncements[currentIndex].id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="font-medium text-center truncate max-w-xs sm:max-w-xl"
          >
            {activeAnnouncements[currentIndex].text}
          </motion.div>
        </AnimatePresence>
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="text-[#FCFBF7]/60 hover:text-white transition-colors ml-4 focus:outline-none cursor-pointer"
        aria-label="Close Announcement Bar"
      >
        <X className="w-3.5 h-3.5 stroke-[1.5]" />
      </button>
    </div>
  );
}
