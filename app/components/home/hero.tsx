import StyledButton from "../common/styledButton";
import Carousal from "./carousal";
import { useNavigate } from "react-router";
import type { HomePageArtifact } from "~/types/common";
import { useState } from "react";

const Hero = ({ artifacts }: { artifacts: HomePageArtifact[] }) => {
  const navigate = useNavigate();
  const [isDonatePaymentLinkLoading, setIsDonatePaymentLinkLoading] =
    useState(false);

  const triggerMivPayDonate = async (amount: number) => {
    setIsDonatePaymentLinkLoading(true);
    try {
      const paymentLinkBody = {
        pa: import.meta.env.VITE_ADMIN_UPI_ID,
        am: amount,
        tn: "Donating to Made In Vikhroli",
      };
      const mivPayResponse = await fetch(
        "https://miv-pay.vercel.app/api/generate-link",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(paymentLinkBody),
        },
      );
      const result = await mivPayResponse.json();
      const link = result.data.link;
      if (result.success && link) {
        window.open(link, "_blank");
      }
    } catch (error) {
      console.error("Failed to create miv-pay donate link", error);
    } finally {
      setIsDonatePaymentLinkLoading(false);
    }
  };
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
            action={() => triggerMivPayDonate(50)}
            heirarchy="primary"
            isLoading={isDonatePaymentLinkLoading}
            style={{ width: "91.16px" }}
          />
          <StyledButton
            title="View Artifacts"
            action={() => navigate("artifacts")}
            heirarchy="secondary"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
