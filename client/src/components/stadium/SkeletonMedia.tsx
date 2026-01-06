import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface SkeletonMediaProps {
  className?: string;
  aspectRatio?: "video" | "square" | "wide";
}

export function SkeletonMedia({ className, aspectRatio = "video" }: SkeletonMediaProps) {
  const aspectClasses = {
    video: "aspect-video",
    square: "aspect-square",
    wide: "aspect-[21/9]",
  };

  return (
    <Skeleton className={cn("w-full rounded-lg", aspectClasses[aspectRatio], className)} />
  );
}

