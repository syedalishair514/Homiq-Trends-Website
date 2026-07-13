import React from "react";
import { cn } from "@/lib/utils";
import { DESIGN_SYSTEM } from "@/constants/theme";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  clean?: boolean;
}

export default function Container({
  children,
  className,
  clean = false,
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        !clean && DESIGN_SYSTEM.spacing.container,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
