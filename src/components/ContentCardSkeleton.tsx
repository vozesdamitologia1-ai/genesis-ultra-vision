import { cn } from "@/lib/utils";

interface ContentCardSkeletonProps {
  layout: "list" | "grid" | "reels";
  count?: number;
  isLegado?: boolean;
}

const ShimmerBlock = ({ className }: { className?: string }) => (
  <div
    className={cn(
      "relative overflow-hidden rounded-lg bg-muted/40",
      className
    )}
  >
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
  </div>
);

const ContentCardSkeleton = ({ layout, count = 4, isLegado = false }: ContentCardSkeletonProps) => {
  const borderColor = isLegado ? "border-amber-400/10" : "border-primary/10";

  if (layout === "list") {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className={`flex gap-3 rounded-xl border ${borderColor} bg-card/60 p-3`}>
            <ShimmerBlock className="h-20 w-28 flex-shrink-0 rounded-lg" />
            <div className="flex flex-1 flex-col justify-center gap-2">
              <ShimmerBlock className="h-3.5 w-3/4 rounded" />
              <ShimmerBlock className="h-2.5 w-1/2 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (layout === "reels") {
    return (
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className={`overflow-hidden rounded-xl border ${borderColor} bg-card/60 aspect-[9/16]`}>
            <ShimmerBlock className="h-full w-full rounded-xl" />
          </div>
        ))}
      </div>
    );
  }

  // grid
  return (
    <div className="grid grid-cols-2 gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`overflow-hidden rounded-xl border ${borderColor} bg-card/60`}>
          <ShimmerBlock className="h-28 w-full" />
          <div className="p-2 space-y-1.5">
            <ShimmerBlock className="h-3 w-4/5 rounded" />
            <ShimmerBlock className="h-2.5 w-3/5 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContentCardSkeleton;
