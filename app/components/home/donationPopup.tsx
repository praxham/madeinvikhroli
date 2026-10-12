import { QRCodeCanvas } from "qrcode.react";
import { useRef, useState } from "react";
import StyledButton from "../common/styledButton";

type DonationAmount = 10 | 20 | 50 | 100;

const DonationPopup = ({ handleClose }: { handleClose: () => void }) => {
  const [amount, setAmount] = useState<DonationAmount>(50);
  const UPIPaymentURL = `upi://pay?pa=${import.meta.env.VITE_ADMIN_UPI_ID}&am=${amount}&cu=INR&tn=${encodeURIComponent("Donating " + amount + "₹ to MIV")}`;
  const qrRef = useRef<HTMLDivElement>(null);

  const amounts: DonationAmount[] = [10, 20, 50, 100];

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
      <div className="fixed flex flex-col items-center gap-4 w-[calc(100vw-2rem)] lg:w-[400px] top-[50%] left-[50%] transform-[translate(-50%,-50%)] rounded-[var(--corner-radius)] p-4 bg-white text-black border-[var(--clr-border-grey-one)] border-[1px]">
        <div className="w-full flex flex-col gap-2">
          <label className="w-full font-medium">Choose Amount to Donate</label>
          <div className="flex w-full justify-between gap-2">
            {amounts.map((amt) => (
              <button
                key={amt}
                onClick={() => setAmount(amt)}
                className={`flex-1 py-1.5 px-3 rounded-full text-sm font-semibold transition-all border ${
                  amount === amt
                    ? "bg-black text-white border-black" // Active state
                    : "bg-white text-black border-gray-300 hover:bg-gray-100" // Inactive state
                }`}
              >
                ₹{amt}
              </button>
            ))}
          </div>
        </div>
        <div ref={qrRef} className="flex justify-center w-full">
          <QRCodeCanvas
            value={UPIPaymentURL}
            level="H"
            size={500}
            style={{ width: "100%", height: "auto", maxWidth: "250px" }}
          />
        </div>
        <label className="w-full font-medium hidden md:block">
          Scan and Pay via any UPI app
        </label>
        <label className="w-full font-medium md:hidden">
          Share to UPI app and Pay
        </label>
        <div className="w-full md:hidden">
          <StyledButton
            title="Share QR"
            action={handleShareQR}
            heirarchy="primary"
            length="full-width"
          />
        </div>
      </div>
    </div>
  );
};

export default DonationPopup;
