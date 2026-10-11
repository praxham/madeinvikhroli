import { useState } from "react";

const ArtifactImagePreview = ({ images }: { images: string[] }) => {
  const [hoveredImageId, setHoveredImageId] = useState(0);
  const [showMoreImages, setShowMoreImages] = useState(false);

  return (
    <div
      className="w-full aspect-square grid grid-cols-1 grid-rows-1 col-span-2 lg:col-span-1"
      onMouseEnter={() => setShowMoreImages(true)}
      onMouseLeave={() => setShowMoreImages(false)}
    >
      <img
        className="col-start-1 row-start-1 w-full h-full object-cover"
        src={images[hoveredImageId]}
        alt="Main Preview"
      />

      {showMoreImages && (
        <div className="col-start-1 row-start-1 grid grid-cols-4 grid-rows-4">
          {images.map((image, id) => (
            <img
              key={id}
              className="row-start-4 w-full h-full object-cover cursor-pointer outline-2 outline-offset-[-2px] outline-transparent hover:outline-white transition-all duration-200"
              onMouseEnter={() => setHoveredImageId(id)}
              src={image}
              alt={`Thumbnail ${id + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ArtifactImagePreview;
