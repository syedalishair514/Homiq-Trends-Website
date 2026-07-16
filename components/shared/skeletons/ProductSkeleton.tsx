import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductSkeletonProps {
  count?: number;
}

export default function ProductSkeleton({ count = 8 }: ProductSkeletonProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex flex-col gap-4 border border-border/30 rounded-2xl p-4 bg-secondary/10">
          {/* Image Aspect ratio container */}
          <div className="aspect-[4/5] w-full relative overflow-hidden rounded-xl bg-secondary/20">
            <Skeleton className="absolute inset-0 bg-border/40 animate-pulse" />
          </div>
          
          {/* Category */}
          <Skeleton className="h-3 w-16 bg-border/40" />
          
          {/* Name */}
          <Skeleton className="h-5 w-3/4 bg-border/40" />
          
          {/* Price & Rating */}
          <div className="flex justify-between items-center mt-2">
            <Skeleton className="h-4 w-12 bg-border/40" />
            <Skeleton className="h-3.5 w-16 bg-border/40" />
          </div>
        </div>
      ))}
    </div>
  );
}
