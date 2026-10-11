import type { GridArtifact } from "~/types/common";
import ArtifactGridCard from "./artifactGridCard";
import StyledButton from "../common/styledButton";
import { useSearchParams } from "react-router";

const ArtifactsGrid = ({
  artifacts,
  currentPage,
  limit,
  hasNextPage,
}: {
  artifacts: GridArtifact[];
  currentPage: number;
  limit: number;
  hasNextPage: boolean;
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-1 gap-y-[30px]">
        {artifacts.slice(0, limit).map((artifact, i) => (
          <ArtifactGridCard key={i} artifact={artifact} />
        ))}
      </div>
      {(currentPage > 1 || hasNextPage) && (
        <div className="w-fit self-end flex flex-row gap-3">
          {currentPage !== 1 && (
            <StyledButton
              title="<"
              action={() => setSearchParams({ page: `${currentPage - 1}` })}
              heirarchy="secondary"
            />
          )}
          <span className="w-[44px] px-4 py-2 border-[var(--clr-grey-one)] text-[var(--clr-grey-one)] border-[2px] rounded-[var(--corner-radius)]">
            {currentPage}
          </span>
          {hasNextPage && (
            <StyledButton
              title=">"
              action={() => setSearchParams({ page: `${currentPage + 1}` })}
              heirarchy="secondary"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ArtifactsGrid;
