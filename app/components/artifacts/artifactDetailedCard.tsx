import type { DetailedArtifact, GridArtifact } from "~/types/common";
import ArtifactImagePreview from "./artifactImagePreview";
import StyledButton from "../common/styledButton";
import { Link, useSearchParams } from "react-router";
import PurchasePopup from "../purchase/purchasePoup";
import { useUserStore } from "~/store";
import ArtifactsGrid from "./artifactsGrid";
import { useState } from "react";
import { toast } from "react-toastify";
import { apiClient } from "~/api/axios";

const ArtifactDetailedCard = ({
  artifact,
  artifactsOfMember,
}: {
  artifact: DetailedArtifact;
  artifactsOfMember: GridArtifact[];
}) => {
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);
  const [isDownloading, setIsDownloading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const showPurchasePopup = JSON.parse(searchParams.get("purchase") || "false");
  return (
    <div className="h-fit grid grid-cols-1 lg:grid-cols-2 gap-x-[20px] gap-y-[1rem] lg:gap-y-[2.25rem]">
      {/* left side */}
      <ArtifactImagePreview images={artifact.images} />
      {/* right side */}
      <div className="col-span-2 lg:col-span-1 w-full flex flex-col gap-2 bg-white p-4 font-medium rounded-[var(--corner-radius)]">
        <h1 className="text-[1.5rem]">{artifact.title}</h1>
        <Link to={`/members/${artifact.artist.username}`}>
          <h2 className="text-[var(--clr-grey-two)]">
            by {artifact.artist.username}
          </h2>
        </Link>
        <div className="flex flex-row gap-2">
          {artifact.category.map((item) => (
            <h3 className="mt-1 text-[var(--clr-grey-three)] border-2 border-[var(--clr-grey-three)] w-fit px-[1rem] py-[6px] rounded-full">
              {item}
            </h3>
          ))}
        </div>
        <p className="mt-4 text-[0.87rem] font-normal">
          {artifact.description}
        </p>
        {Array.isArray(artifact.deliverable_file_formats) &&
          artifact.deliverable_file_formats?.length > 0 && (
            <div className="mt-4 text-[0.87rem] font-normal flex flex-row gap-1">
              <span>deliverable file formats:</span>
              <div className="flex flex-row gap-2">
                <p>
                  {artifact.deliverable_file_formats
                    .map((item) => `.${item}`)
                    .join(", ")}
                </p>
              </div>
            </div>
          )}

        {/* <div className="fixed bottom-0 left-0 w-full p-4 bg-white z-50 lg:contents"> */}
        {artifact.amount > 0 && (
          <StyledButton
            title={`Buy Now for ₹${artifact.amount}`}
            action={() => {
              if (isLoggedIn) {
                setSearchParams({ purchase: "true" });
              } else {
                setSearchParams({ sign_in: "true", get_upi: "true" });
              }
            }}
            heirarchy="primary"
            length="full-width"
            style={{ marginTop: "auto" }}
          />
        )}

        {artifact.amount === 0 &&
          artifact.deliverable_file_formats?.length > 0 && (
            <StyledButton
              title="Download"
              action={() => getFreeArtifact(artifact?.id)}
              heirarchy="primary"
              length="full-width"
              isLoading={isDownloading}
              style={{ marginTop: "auto" }}
            />
          )}
      </div>
      {/* </div> */}
      {showPurchasePopup && (
        <PurchasePopup
          handleClose={() =>
            setSearchParams((prevParams) => {
              prevParams.delete("purchase");
              return prevParams;
            })
          }
          artifact={artifact}
        />
      )}
      <div className="col-span-2">
        <h1 className="heading1 mb-[1.5rem]">
          More from{" "}
          {artifact.artist.username[0].toUpperCase() +
            artifact.artist.username.slice(1)}
        </h1>
        <ArtifactsGrid
          artifacts={artifactsOfMember}
          currentPage={1}
          limit={6}
          hasNextPage={false}
        />
      </div>
    </div>
  );
};

const getFreeArtifact = async (id: string) => {
  if (!id) {
    return toast.error(
      "id is required to fetch free artifact's deliverable content",
    );
  }
  try {
    const response = await apiClient.get(`/artifact/free?id=${id}`);

    if (response.data.success && response.data.data.url) {
      window.open(response.data.data.url, "_blank");
    }
  } catch (error: any) {
    toast.error(error);
  }
};

export default ArtifactDetailedCard;
