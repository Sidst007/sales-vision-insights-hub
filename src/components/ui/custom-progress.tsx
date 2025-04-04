
import React from "react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface CustomProgressProps {
  value: number;
  className?: string;
  indicatorClassName?: string;
}

const CustomProgress = ({ 
  value, 
  className, 
  indicatorClassName,
  ...props
}: CustomProgressProps) => {
  return (
    <Progress
      value={value}
      className={className}
      {...props}
    />
  );
};

export { CustomProgress };
