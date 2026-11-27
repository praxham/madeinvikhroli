import StyledButton from "../common/styledButton";
import Carousal from "./carousal";
import { NavLink, useNavigate } from "react-router";
import type { HomePageArtifact } from "~/types/common";
import { useEffect, useState } from "react";
import { workList } from "~/constatns";
import WorkCard from "../work/workCard";
import { generateMailToLink } from "~/functions";

const Hero = ({ artifacts }: { artifacts: HomePageArtifact[] }) => {
  const navigate = useNavigate();
  const [isDonatePaymentLinkLoading, setIsDonatePaymentLinkLoading] =
    useState(false);
  const [solutionsForIndex, setSolutionsForIndex] = useState(0);

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

  useEffect(() => {
    const intervalId: ReturnType<typeof setInterval> = setInterval(() => {
      setSolutionsForIndex(
        (prevIndex) => (prevIndex + 1) % solutionsFor.length,
      );
    }, 1500);

    return () => clearInterval(intervalId);
  }, [solutionsFor]);

  return (
    <div className="lg:max-h-[calc(100vh-26px)] relative grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-[max-content_max-content_max-content] gap-y-1 sm:gap-y-6">
      <div className="relative lg:col-span-2 bg-[#F8F8F7]">
        <Carousal artifacts={artifacts} />

        <NavLink
          className="absolute bottom-6 right-4 w-fit bg-black text-white rounded-(--corner-radius) px-4 py-2 flex flex-row items-center gap-2 shadow-lg"
          to={"/artifacts"}
        >
          <span className="font-semibold text-[0.7rem] sm:text-[0.87rem] text-nowrap">
            See More Artifacts
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="3.1"
            stroke="currentColor"
            className="size-3 sm:size-4 shrink-0"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
            />
          </svg>
        </NavLink>
      </div>
      <div className="fixed bottom-0 left-0 z-20 bg-white p-4 rounded-t-2xl shadow-2xl md:relative md:p-0 md:bg-transparent md:shadow-none lg:col-span-2 flex flex-col gap-4 justify-center">
        <h1 className="heading1 text-[2rem] md:text-[3rem] leading-[40px] md:leading-[50px]">
          Sustainable Websites, Software Solutions and Artworks for{" "}
          <br className="block sm:hidden" />
          <span
            key={solutionsForIndex}
            className="inline-block text-(clr-primary) animate-text-change whitespace-nowrap"
          >
            @{solutionsFor[solutionsForIndex]}
          </span>
        </h1>
        <div className="flex flex-row gap-4">
          <StyledButton
            title="Get In Touch"
            action={() => {}}
            heirarchy="primary"
            mode="link"
            url={generateMailToLink({
              emailId: "hello@madeinvikhroli.com",
              subject: "Looking to connect - Made in Vikhroli",
              body: "Hi,\n\nI saw your showcase and would love to connect with an individual creator for a project.\n\nHere is what I am looking for:\n\n",
            })}
            className="w-full md:w-fit"
          />
          <StyledButton
            title="Donate"
            action={() => triggerMivPayDonate(50)}
            heirarchy="secondary"
          />
        </div>
      </div>
      <div className="relative lg:col-span-2 grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
        {workList.map((item, index) => (
          <WorkCard
            key={item.title}
            title={item.title}
            bgImage={item.bgImage}
            articleUrl={item.articleUrl}
            headingBgColor={item.headingBgColor}
            headingMaxWidth={item.headingMaxWidth}
            className={
              index === 2
                ? "max-lg:col-span-2 max-md:aspect-[2/1] max-lg:w-full max-lg:max-h-[286px]"
                : ""
            }
          />
        ))}
        <NavLink
          className="absolute bottom-4 right-4 w-fit bg-black text-white rounded-(--corner-radius) px-4 py-2 flex flex-row items-center gap-2 shadow-lg"
          to={"/work"}
        >
          <span className="font-semibold text-[0.7rem] sm:text-[0.87rem] text-nowrap">
            See More Work
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="3.1"
            stroke="currentColor"
            className="size-3 sm:size-4 shrink-0"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
            />
          </svg>
        </NavLink>
      </div>
      {/* spacer repeated cta block for scroll padding */}
      <div className="lg:col-span-2 flex flex-col gap-4 justify-center pointer-events-none opacity-0 lg:hidden">
        <h1 className="heading1 text-[2rem] md:text-[3rem] leading-[40px] md:leading-[50px]">
          Sustainable Websites, Software Solutions and Artworks for{" "}
          <br className="block sm:hidden" />
          <span
            key={solutionsForIndex}
            className="inline-block text-(clr-primary) animate-text-change whitespace-nowrap"
          >
            @{solutionsFor[solutionsForIndex]}
          </span>
        </h1>
        <div className="flex flex-row gap-4">
          <StyledButton
            title="Get In Touch"
            action={() => {}}
            heirarchy="primary"
          />
          <StyledButton
            title="Donate"
            action={() => {}}
            heirarchy="secondary"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;

const solutionsFor = [
  "everyone",
  "small_businesses",
  "local_shops",
  "employees",
  "your_mom",
  "you",
];
