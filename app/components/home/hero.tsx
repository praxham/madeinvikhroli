import StyledButton from "../common/styledButton";
import Carousal from "./carousal";
import { useNavigate, useSearchParams } from "react-router";
import type { HomePageArtifact } from "~/types/common";
import DonationPopup from "./donationPopup";

const Hero = ({ artifacts }: { artifacts: HomePageArtifact[] }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const showDonatePopup = JSON.parse(searchParams.get("donate") || "false");
  return (
    <div className="relative h-[90vh] flex flex-col gap-4 items-center justify-center px-4 lg:px-0">
      <Carousal artifacts={artifacts} />
      <div className="absolute bottom-8 lg:top-8 left-0 flex flex-col items-start gap-4">
        <div className="flex flex-col gap-2 items-start">
          <h1 className="text-start text-[2rem] font-semibold md:leading-[40px]">
            We’re a collective making
            <br />
            <span className="text-[var(--clr-grey-one)]">
              art, websites
            </span> &{" "}
            <span className="text-[var(--clr-grey-one)]">everything tech</span>
          </h1>
          <h2 className="text-start md:text-[1.2rem] font-medium text-[var(--clr-grey-two)]">
            homegrown, people made, authentic,
            <br /> affordable and sometimes free
          </h2>
        </div>
        <div className="flex flex-row gap-4">
          <StyledButton
            title="Donate"
            action={() => setSearchParams({ donate: "true" })}
            heirarchy="primary"
          />
          <StyledButton
            title="View Artifacts"
            action={() => navigate("artifacts")}
            heirarchy="secondary"
          />
        </div>
      </div>
      {showDonatePopup && (
        <DonationPopup
          handleClose={() =>
            setSearchParams((prevParams) => {
              prevParams.delete("donate");
              return prevParams;
            })
          }
        />
      )}
    </div>
  );
};

export default Hero;
