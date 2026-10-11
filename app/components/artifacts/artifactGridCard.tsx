import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import type { GridArtifact } from "~/types/common";

const ArtifactGridCard = ({ artifact }: { artifact: GridArtifact }) => {
  const images = artifact.images;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    // Don't set up an interval if there are no images or only one image
    if (!isHovered || !images || images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 1000); // 1000ms = 1 second

    // Cleanup interval on unmount
    return () => clearInterval(timer);
  }, [isHovered, images]);

  const handleMouseLeave = () => {
    setIsHovered(false);
    setCurrentIndex(0);
  };

  const isDeleteable = location.pathname.includes("profile/artifacts");
  const renderingForArtist =
    location.pathname.includes("artifacts/") ||
    location.pathname.includes("profile/artifacts");

  return (
    <div
      key={artifact.id}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="group relative flex flex-col gap-2 cursor-pointer"
      onClick={() =>
        navigate(
          isDeleteable
            ? `/profile/artifacts/edit?slug=${artifact.slug}`
            : `/artifacts/${artifact.slug}`,
        )
      }
    >
      {isDeleteable && (
        <div
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setSearchParams({ delete: artifact.id });
          }}
          className="bg-white p-2 rounded-full absolute top-2 right-2 shadow-gray-500 shadow-sm hidden group-hover:block"
        >
          <svg
            width="24px"
            height="24px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              {" "}
              <path
                d="M10 11V17"
                stroke="#000000"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>{" "}
              <path
                d="M14 11V17"
                stroke="#000000"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>{" "}
              <path
                d="M4 7H20"
                stroke="#000000"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>{" "}
              <path
                d="M6 7H12H18V18C18 19.6569 16.6569 21 15 21H9C7.34315 21 6 19.6569 6 18V7Z"
                stroke="#000000"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>{" "}
              <path
                d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z"
                stroke="#000000"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>{" "}
            </g>
          </svg>
        </div>
      )}
      <img
        className="w-full lg:w-[413.33px] aspect-square object-cover"
        src={artifact.images[currentIndex]}
      />

      {/* Details Container */}
      <div className="flex flex-col gap-2">
        {/* Top Row: Title and Artist side-by-side */}
        <div className="flex gap-2 items-baseline">
          <h1 className="heading2">{artifact.title}</h1>
          {!renderingForArtist && (
            <h2 className="heading2 text-[var(--clr-grey-two)]">
              by {artifact.by_artist}
            </h2>
          )}
        </div>

        {/* Bottom Row: Price */}
        {artifact.amount > 0 && (
          <h2 className="heading2 text-[var(--clr-grey-two)]">
            ₹ {artifact.amount}
          </h2>
        )}
      </div>
    </div>
  );
};

export default ArtifactGridCard;
