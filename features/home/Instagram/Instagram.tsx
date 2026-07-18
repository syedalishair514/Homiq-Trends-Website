"use client";

import React, { useState } from "react";
import { INSTAGRAM_POSTS } from "@/constants/instagram";
import { motion } from "framer-motion";
import { slideUp, staggerContainer } from "@/constants/animations";
import { Heart, MessageCircle } from "lucide-react";
import SectionHeading from "@/components/shared/SectionHeading";
import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import { DESIGN_SYSTEM } from "@/constants/theme";

const InstagramIconLocal = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export default function Instagram() {
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});

  const toggleLike = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setLikedPosts((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <section className="py-20 sm:py-28 bg-[#FAFAF8] dark:bg-[#181816] border-t border-border/40">
      <Container>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
          <SectionHeading
            title="Instagram Inspiration"
            subtitle="Social Gallery"
            align="left"
            description="Share your premium setups using #HomiqTrends and follow us for daily updates on luxury interior design."
            className="mb-0 sm:mb-0 max-w-2xl mx-0"
          />
          
          <Button
            variant="outline"
            className={`${DESIGN_SYSTEM.radius.button} border-primary text-accent hover:bg-[#EEDCCB]/30 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider py-5 px-6 shrink-0 mt-6 sm:mt-0 cursor-pointer`}
            onClick={() => window.open("https://instagram.com/homiqtrends", "_blank")}
          >
            <InstagramIconLocal className="text-accent" /> Follow @HomiqTrends
          </Button>
        </div>

        {/* Gallery Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer(0.06)}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {INSTAGRAM_POSTS.map((post, idx) => {
            const hasLiked = likedPosts[post.id];
            const likesCount = hasLiked ? post.likes + 1 : post.likes;

            return (
              <motion.div
                key={post.id}
                variants={slideUp(0.4, 20)}
                className="relative aspect-square rounded-2xl overflow-hidden border border-border group bg-white"
              >
                {/* Image Background */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{
                    backgroundImage: `url(${post.image})`,
                    backgroundColor: idx % 2 === 0 ? "#E5E0D8" : "#EFECE6",
                  }}
                />

                {/* Hover Mask */}
                <a
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 z-10 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center gap-4 text-[#FCFBF7] cursor-pointer"
                >
                  <InstagramIconLocal className="w-8 h-8" />
                  <div className="flex gap-6 text-sm font-semibold">
                    <button
                      onClick={(e) => toggleLike(e, post.id)}
                      className="flex items-center gap-1.5 hover:text-primary transition-colors cursor-pointer"
                      aria-label="Like post"
                    >
                      <Heart className={`w-4 h-4 ${hasLiked ? "fill-primary text-primary" : "stroke-[1.5]"}`} />
                      <span>{likesCount}</span>
                    </button>
                    <div className="flex items-center gap-1.5">
                      <MessageCircle className="w-4 h-4 stroke-[1.5]" />
                      <span>{post.comments}</span>
                    </div>
                  </div>
                </a>
              </motion.div>
            );
          })}
        </motion.div>
      </Container>
    </section>
  );
}
