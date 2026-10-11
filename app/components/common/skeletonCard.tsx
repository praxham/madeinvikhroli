import React from "react";

const SkeletonCard = ({
  key,
  width,
  height,
  radius,
}: {
  width: string;
  height: string;
  radius: string;
}) => {
  return (
    <div
      role="status"
      key={key}
      className={`w-[${width}] h-[${height}] radius-[${radius}] animate-pulse bg-gray-200 `}
      aria-label="Loading..."
    />
  );
};

export default SkeletonCard;
