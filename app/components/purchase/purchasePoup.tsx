import { type DetailedArtifact } from "~/types/common";
import { QRCodeCanvas } from "qrcode.react";
import { useRef, useState } from "react";
import StyledButton from "../common/styledButton";
import z from "zod";
import { apiClient } from "~/api/axios";
import { useUserStore } from "~/store";
import { toast } from "react-toastify";

const PurchasePopup = ({
  handleClose,
  artifact,
}: {
  handleClose: () => void;
  artifact: DetailedArtifact;
}) => {
  const user = useUserStore((state) => state.user);
  const [utr, setUTR] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [verificationMethod, setVerificationMethod] = useState<
    "email" | "whatsapp" | null
  >(null);
  const qrRef = useRef<HTMLDivElement>(null);

  const UPIPaymentURL = `upi://pay?pa=${artifact.artist.upi_id}&pn=${encodeURIComponent(
    artifact.id,
  )}&am=${artifact.amount}&cu=INR&tn=${encodeURIComponent("Purchasing " + artifact.title)}`;

  const handleOrderSubmit = (medium: "email" | "whatsapp") => {
    setVerificationMethod(medium);
    createOrder({
      id: artifact.id,
      amount: artifact.amount,
      artifact_name: artifact.title,
      artist_email: artifact.artist.email_id,
      artist_whatsapp: artifact.artist.whatsapp_number,
      utr,
      paymentConfirmationMedium: medium,
      upiId: user?.upiId,
      setIsLoading,
      handleClose,
    });
  };

  const handleShareQR = async () => {
    if (!qrRef.current) return;

    const canvas = qrRef.current.querySelector("canvas");
    if (!canvas) return;

    canvas.toBlob(async (blob) => {
      if (!blob) return;

      const file = new File([blob], "upi-qr-code.png", { type: "image/png" });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            title: "Share to UPI app and Pay",
            text: "Share this QR code to UPI app to make payment.",
            files: [file],
          });
        } catch (error) {
          console.error("Error sharing QR code:", error);
        }
      } else {
        const imageUrl = URL.createObjectURL(blob);
        const downloadLink = document.createElement("a");

        downloadLink.href = imageUrl;
        downloadLink.download = "upi-qr-code.png";

        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(imageUrl);
        alert("Your browser does not support file sharing.");
      }
    });
  };

  return (
    <div className="fixed w-screen h-screen text-[1rem] font-normal z-50">
      <div
        onClick={handleClose}
        className="fixed top-0 left-0 w-screen h-screen bg-black/50"
      />
      <div className="fixed flex flex-col gap-4 w-[calc(100vw-2rem)] lg:w-[600px] top-[50%] left-[50%] transform-[translate(-50%,-50%)] rounded-[var(--corner-radius)] p-4 bg-white text-black border-[var(--clr-border-grey-one)] border-[1px]">
        <div className="grid grid-cols-[100px_1fr_80px] gap-x-4 font-medium">
          <img
            className="w-[100px] aspect-square object-cover"
            src={artifact.images[0]}
            alt="artifact image"
          />
          <div className="grid auto-rows-max gap-2 h-fit">
            <h1 className="">{artifact.title}</h1>
            <h2 className="text-[0.85rem] text-[var(--clr-grey-two)]">
              by {artifact.artist.username}
            </h2>
          </div>
          <h1 className="text-4xl w-fit">₹{artifact.amount}</h1>
        </div>
        <div className="grid grid-rows-auto gap-4">
          <div className="w-full flex flex-col items-center gap-2">
            <label className="w-full font-medium hidden md:block">
              Scan and Pay via any UPI app
            </label>
            <label className="w-full font-medium md:hidden">
              Share to UPI app and Pay
            </label>
            <div ref={qrRef} className="flex justify-center w-full">
              <QRCodeCanvas
                value={UPIPaymentURL}
                level="H"
                size={500}
                style={{ width: "100%", height: "auto", maxWidth: "250px" }}
              />
            </div>
            <div className="w-full md:hidden">
              <StyledButton
                title="Share QR"
                action={handleShareQR}
                heirarchy="primary"
                length="full-width"
              />
            </div>
          </div>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col items-center gap-2"
          >
            <label className="w-full font-medium">UTR</label>
            <input
              className="w-full px-4 py-2 rounded-[var(--corner-radius)] border-[var(--clr-border-grey-two)] border-[1px]"
              id="utr"
              name="utr"
              placeholder="Enter your UTR, found in upi transaction receipt"
              type="text"
              value={utr}
              minLength={12}
              maxLength={12}
              pattern="[0-9]{12}"
              title="UTR must be exactly 12 numeric digits"
              required
              onChange={(e) => setUTR(e.target.value)}
            />
            <label className="w-full font-medium">Verify via</label>
            {
              <StyledButton
                title="Email"
                action={() => handleOrderSubmit("email")}
                heirarchy="primary"
                length="full-width"
                type="submit"
                disabled={verificationMethod === "whatsapp"}
                isLoading={verificationMethod === "email" && isLoading}
              />
            }
            {artifact.artist.whatsapp_number && (
              <StyledButton
                title="Whatsapp"
                action={() => handleOrderSubmit("whatsapp")}
                heirarchy="secondary"
                length="full-width"
                type="submit"
                disabled={verificationMethod === "email"}
                isLoading={verificationMethod === "whatsapp" && isLoading}
              />
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export const utrSchema = z
  .string("utr must be provided")
  .trim()
  .length(12, "UTR must be exactly 12 digits")
  .regex(/^[0-9]{12}$/, {
    message: "Invalid UTR number. Must contain exactly 12 numeric digits.",
  });

const createOrder = async ({
  id,
  amount,
  artifact_name,
  artist_email,
  artist_whatsapp,
  utr,
  paymentConfirmationMedium,
  upiId,
  setIsLoading,
  handleClose,
}: {
  id: string;
  amount: number;
  artifact_name: string;
  artist_email: string;
  artist_whatsapp?: number;
  utr: string;
  paymentConfirmationMedium: "email" | "whatsapp";
  upiId?: string;
  setIsLoading: (value: boolean) => void;
  handleClose: () => void;
}) => {
  const result = utrSchema.safeParse(utr);
  if (!upiId) {
    console.error("upiId is required to create order");
    return;
  }
  if (!result.success) {
    console.error("Invalid UTR format");
    return;
  }
  setIsLoading(true);
  try {
    const response = await apiClient.post("/order/", {
      artifact: id,
      amount,
      utr,
    });
    if (response.status !== 201 || !response.data.success) {
      console.error("Failed to create order", response);
    }
    const orderId = response.data?.data?.id;

    if (paymentConfirmationMedium === "email") {
      const emailBody = `Please Verify Payment from ${upiId.toUpperCase()} for "${artifact_name.toUpperCase()}" artifact of amount ₹${amount} with UTR: ${utr.toUpperCase()}

Verify order here:
https://madeinvikhroli.com/profile/received-orders?id=${orderId}`;

      const emailURL = `mailto:${artist_email}?cc=${import.meta.env.VITE_WEBSITE_OFFICIAL_EMAILID}&subject=Verify payment from ${upiId.toUpperCase()} of ₹${amount}&body=${encodeURIComponent(emailBody)}`;
      window.open(emailURL, "_blank");
    } else {
      const wtspMessage = `Please Verify Payment from *${upiId.toUpperCase()}* for the *"${artifact_name.toUpperCase()}"* artifact.
  
*Amount:* ₹${amount}
*UTR:* ${utr.toUpperCase()}

Verify here: https://madeinvikhroli.com/profile/received-orders?id=${orderId}`;
      const whatsappURL = `https://wa.me/${artist_whatsapp}?text=${encodeURIComponent(wtspMessage)}`;
      window.open(whatsappURL, "_blank");
    }
    toast.success(`Order Placed!`);
    handleClose();
  } catch (error) {
    toast.error(`Something Went Wrong!`);
    console.error(error);
  } finally {
    setIsLoading(false);
  }
};

export default PurchasePopup;
