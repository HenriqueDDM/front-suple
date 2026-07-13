import { memo } from "react";
import { cn } from "@/lib/utils";

const SIZE_CLASSES = {
  sm: "h-9 w-9",
  md: "h-10 w-10",
  lg: "h-11 w-11",
} as const;

interface ProductThumbnailProps {
  imageUrl: string;
  name: string;
  subtitle?: string;
  size?: keyof typeof SIZE_CLASSES;
  className?: string;
}

export const ProductThumbnail = memo(function ProductThumbnail({
  imageUrl,
  name,
  subtitle,
  size = "md",
  className,
}: ProductThumbnailProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <img
        src={imageUrl}
        alt={name}
        className={cn("shrink-0 rounded-md object-cover", SIZE_CLASSES[size])}
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{name}</p>
        {subtitle ? <p className="truncate text-xs text-muted-foreground">{subtitle}</p> : null}
      </div>
    </div>
  );
});

export const ProductThumbnailInline = memo(function ProductThumbnailInline({
  imageUrl,
  name,
  size = "md",
  className,
}: Omit<ProductThumbnailProps, "subtitle">) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <img
        src={imageUrl}
        alt={name}
        className={cn("shrink-0 rounded-md object-cover", SIZE_CLASSES[size])}
      />
      <span className="font-medium">{name}</span>
    </div>
  );
});
