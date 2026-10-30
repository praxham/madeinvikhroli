import type { DetailedArtifact, GridArtifact } from "~/types/common";
import ArtifactImagePreview from "./artifactImagePreview";
import StyledButton from "../common/styledButton";
import { Link, useSearchParams } from "react-router";
import { useUserStore } from "~/store";
import ArtifactsGrid from "./artifactsGrid";
import { useCallback, useEffect, useState } from "react";
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
  const upiId = useUserStore((state) => state.user?.upiId);
  const [isDownloading, setIsDownloading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isPaymentLinkLoading, setIsPaymentLinkLoading] = useState(false);

  const triggerMivPay = useCallback(async () => {
    setIsPaymentLinkLoading(true);
    try {
      const contactType = artifact.artist.whatsapp_number
        ? "whatsapp"
        : "email";
      const contactInfo =
        contactType === "whatsapp"
          ? artifact.artist.whatsapp_number
          : artifact.artist.email_id;
      const paymentLinkBody = {
        pa: artifact.artist.upi_id,
        am: artifact.amount,
        tn: "Purchasing " + artifact.title,
        ct: contactType,
        ci: contactInfo,
        ra: upiId,
        vurl: `https://madeinvikhroli.com/profile/received-orders`,
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
      console.error("Failed to create miv-pay payment link", error);
    } finally {
      setIsPaymentLinkLoading(false);
    }
  }, [artifact, upiId]);

  interface MivPayPayload {
    status: string;
    utr: string;
  }

  useEffect(() => {
    const handleTabMessage = async (event: MessageEvent<MivPayPayload>) => {
      const allowedOrigins = ["https://miv-pay.vercel.app"];

      if (!allowedOrigins.includes(event.origin)) {
        console.warn("Blocked message from unauthorized origin:", event.origin);
        return;
      }

      const data = event.data;

      try {
        const orderApiResponse = await apiClient.post("/order/", {
          artifact: artifact.id,
          amount: artifact.amount,
          utr: data.utr,
        });

        if (orderApiResponse.status === 201 && orderApiResponse.data.success) {
          toast.success("Order created successfully!");
        }
      } catch (error) {
        console.error("Failed to create order", error);
      }
    };
    window.addEventListener("message", handleTabMessage);
    return () => window.removeEventListener("message", handleTabMessage);
  }, [artifact]);

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
                triggerMivPay();
              } else {
                setSearchParams({ sign_in: "true", get_upi: "true" });
              }
            }}
            heirarchy="primary"
            length="full-width"
            style={{ marginTop: "auto" }}
            isLoading={isPaymentLinkLoading}
          />
        )}

        {artifact.amount === 0 &&
          artifact.deliverable_file_formats?.length > 0 && (
            <StyledButton
              title="Download"
              action={() => getFreeArtifact(artifact?.id, setIsDownloading)}
              heirarchy="primary"
              length="full-width"
              isLoading={isDownloading}
              style={{ marginTop: "auto" }}
            />
          )}
      </div>
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

const getFreeArtifact = async (
  id: string,
  setIsDownloading: (val: boolean) => void,
) => {
  if (!id) {
    return toast.error(
      "id is required to fetch free artifact's deliverable content",
    );
  }
  setIsDownloading(true);
  try {
    const response = await apiClient.get(`/artifact/free?id=${id}`);

    if (response.data.success && response.data.data.url) {
      window.open(response.data.data.url, "_blank");
    }
  } catch (error: any) {
    toast.error(error);
  } finally {
    setIsDownloading(false);
  }
};

export default ArtifactDetailedCard;
