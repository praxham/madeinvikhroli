import React from "react";
import SkeletonCard from "./skeletonCard";

const SkeletonGrid = ({
  items,
  columns,
  gapX,
  gapY,
}: {
  items: { width: string; height: string; count: number; radius: string };
  columns: number;
  gapX: number;
  gapY: string;
}) => {
  const cards = Array.from({ length: items.count });
  return (
    <div
      className={`grid grid-cols-${columns} grid-rows-2 gap-x-${gapX} gap-y-[${gapY}] my-[1.5rem]`}
    >
      {cards.map((_, i) => (
        <SkeletonCard
          key={i}
          width={items.width}
          height={items.height}
          radius={items.radius}
        />
      ))}
    </div>
  );
};

export default SkeletonGrid;
