import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function CategorySkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-6 min-h-[500px]">
      {/* First large category card */}
      <div className="md:col-span-2 md:row-span-2 h-[350px] md:h-full relative rounded-2xl overflow-hidden bg-secondary/20 p-8 flex flex-col justify-end border border-border/30">
        <Skeleton className="h-4 w-12 rounded bg-border/50 mb-2" />
        <Skeleton className="h-8 w-40 rounded bg-border/50 mb-4" />
        <Skeleton className="h-4 w-20 rounded bg-border/50" />
      </div>

      {/* 4 smaller category cards */}
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-[220px] md:h-full relative rounded-2xl overflow-hidden bg-secondary/20 p-6 flex flex-col justify-end border border-border/30">
          <Skeleton className="h-3 w-10 rounded bg-border/50 mb-2" />
          <Skeleton className="h-6 w-28 rounded bg-border/50 mb-3" />
          <Skeleton className="h-3.5 w-16 rounded bg-border/50" />
        </div>
      ))}
    </div>
  );
}
