import { Star } from "lucide-react";

interface Props {
  rating: number;
  size?: number;
}

export default function StarRating({ rating, size = 16 }: Props) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = rating >= star;
        const half = !filled && rating >= star - 0.5;
        return (
          <Star
            key={star}
            size={size}
            className={filled || half ? "star-filled" : "star-empty"}
            fill={filled ? "currentColor" : half ? "url(#half)" : "none"}
            strokeWidth={1.5}
          />
        );
      })}
    </div>
  );
}
