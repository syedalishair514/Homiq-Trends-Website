import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function HeroSkeleton() {
  return (
    <div className="w-full h-[80vh] min-h-[500px] bg-secondary/30 flex items-center justify-center relative">
      <div className="max-w-4xl w-full mx-auto px-4 flex flex-col items-center gap-6 text-center">
        {/* Badge */}
        <Skeleton className="h-5 w-48 rounded-full bg-border/50" />
        
        {/* Title */}
        <Skeleton className="h-16 w-3/4 rounded-xl bg-border/50 max-w-xl" />
        
        {/* Description */}
        <Skeleton className="h-8 w-5/6 rounded-lg bg-border/50 max-w-2xl" />
        
        {/* CTAs */}
        <div className="flex gap-4 pt-4">
          <Skeleton className="h-12 w-36 rounded-xl bg-border/50" />
          <Skeleton className="h-12 w-36 rounded-xl bg-border/50" />
        </div>
      </div>
      
      {/* Pagination indicators skeleton */}
      <div className="absolute bottom-6 flex gap-2">
        <Skeleton className="h-2 w-2 rounded-full bg-border/50" />
        <Skeleton className="h-2 w-2 rounded-full bg-border/50" />
        <Skeleton className="h-2 w-2 rounded-full bg-border/50" />
      </div>
    </div>
  );
}
