import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useQRCode } from "next-qrcode";
import mivSticker from "../../../../../public/assets/checkout/miv-sticker.svg";
import axios from "axios";
import CryptoJS from "crypto-js";
import Link from "next/link";
import html2canvas from "html2canvas";
import backIcon from "../../../../../public/assets/checkout/back.svg";

const SECRET_KEY = process.env.NEXT_PUBLIC_LOCALSTORAGE_ENCRYPT_KEY;

export const encryptData = (data: any) => {
  const stringData = JSON.stringify(data);
  return CryptoJS.AES.encrypt(stringData, SECRET_KEY).toString();
};

export const decryptData = (encryptedData: string) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted);
  } catch (error) {
    console.error("Decryption failed", error);
    return null;
  }
};

type CheckoutCardProps = {
  setOpenCheckoutPopup: (value: boolean) => void;
  artifact: any;
};

const CheckoutCard = ({
  setOpenCheckoutPopup,
  artifact,
}: CheckoutCardProps) => {
  const { Image: QRImage } = useQRCode();
  const [upiLink, setUpiLink] = useState("");
  const [upiSecret, setUpiSecret] = useState(0);
  const [userDetails, setUserDetails] = useState({
    emailID: "",
    upiID: "",
    secret: "",
  });
  const [paymentVerified, setPaymentVerified] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleUserDetailsUpdate = (key: string, value: any) => {
    setUserDetails((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  const upiLinkMaker = () => {
    const secret = Math.floor(100000 + Math.random() * 900000);
    console.log(
      `upi://pay?pa=${artifact?.from_member?.upi_id}&am=${
        artifact?.price
      }&cu=INR&tn=${encodeURIComponent(secret)}`
    );
    setUpiSecret(secret);
    return `upi://pay?pa=${artifact?.from_member?.upi_id}&am=${
      artifact?.price
    }&cu=INR&tn=${encodeURIComponent(secret)}`;
  };

  useEffect(() => {
    setUpiLink(upiLinkMaker());
  }, [artifact]);
  const validatePayment = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const upiRegex = /^[\w.-]+@[\w.-]+$/;

    const isEmailValid = emailRegex.test(userDetails.emailID);
    const isUpiValid = upiRegex.test(userDetails.upiID);
    const isSecretCorrect = parseInt(userDetails.secret) === upiSecret;

    if (isEmailValid && isUpiValid && isSecretCorrect) {
      setPaymentVerified(true);
    } else {
      setPaymentVerified(false);
    }
  };

  useEffect(() => {
    if (userDetails.emailID && userDetails.upiID && userDetails.secret) {
      validatePayment();
    }
  }, [userDetails]);

  useEffect(() => {
    const encrypted = localStorage.getItem("userDetails");
    if (encrypted) {
      const decryptedData = decryptData(encrypted);
      if (decryptedData) {
        setUserDetails({
          ...decryptedData,
          secret: "", // wipe secret key just in case
        });
      }
    }
  }, []);

  const handleCheckout = async () => {
    try {
      const encrypted = encryptData(userDetails);
      localStorage.setItem("userDetails", encrypted);
      const data = {
        buyerEmailID: userDetails.emailID,
        buyerUPIID: userDetails.upiID,
        member: artifact?.from_member,
        artifact: artifact,
        secret: upiSecret,
      };
      const res = await axios.post("/api/checkout", data);
      if (res?.status === 200) {
        setEmailSent(true);
        setUserDetails({
          emailID: "",
          upiID: "",
          secret: "",
        });
      }
    } catch (error) {
      console.error("Error During Checkout:", error);
    }
  };

  const shareQRCodeImage = async () => {
    const wrapper = document.getElementById("qr-code-image");
    if (!wrapper) return alert("QR code container not found");

    try {
      // Convert to canvas
      const canvas = await html2canvas(wrapper, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
      });

      // Convert canvas to blob
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/png")
      );
      if (!blob) throw new Error("Failed to convert to image");

      const file = new File([blob], "upi-qr.png", { type: "image/png" });

      // Check if share API is available
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: "Pay via UPI",
          text: "Share this QR to UPI app to pay",
          files: [file],
        });
      } else {
        // Fallback: inject image to simulate "tap and hold"
        const fallbackImg = document.createElement("img");
        fallbackImg.src = URL.createObjectURL(blob);
        fallbackImg.alt = "UPI QR";
        fallbackImg.style.position = "fixed";
        fallbackImg.style.top = "0";
        fallbackImg.style.left = "0";
        fallbackImg.style.width = "100%";
        fallbackImg.style.zIndex = "9999";
        fallbackImg.style.background = "#fff";

        // Tap to remove fallback image
        fallbackImg.onclick = () => fallbackImg.remove();

        document.body.appendChild(fallbackImg);

        alert(
          "Sharing not supported. Tap and hold the image to save or share manually."
        );
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong while sharing the QR code.");
    }
  };

  return (
    <div className="fixed top-0 left-0 w-screen h-screen">
      <div
        onClick={() => setOpenCheckoutPopup(false)}
        className="fixed top-0 left-0 w-screen h-screen bg-black opacity-50"
      />
      <div className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-screen h-screen md:h-fit md:w-fit bg-white md:rounded-[16px]">
        {emailSent ? (
          <div className="flex flex-col items-center gap-4 p-2 md:p-[24px]">
            <p className="text-[64px]">✉️</p>
            <div className="flex flex-col gap-2 font-medium text-[14px]">
              <p>
                You are now connected with the seller via email. They will
                verify your payment and share the deliverables with you in the
                same thread shortly.
              </p>
              <p>
                We (the miv team) are also part of the conversation. If you need
                any help or have questions at any point, just reply in the same
                thread — we’re here for you!
              </p>
              <p>Thanks again for your purchase. 😊</p>
            </div>
            <a
              href="https://mail.google.com/mail/u/0/#inbox"
              target="_blank"
              className="py-2 px-[24px] mt-8 h-fit rounded-[8px] bg-black cursor-pointer text-white font-medium active:scale-99 text-[14px] text-center"
            >
              Open Gmail
            </a>
          </div>
        ) : (
          <div className="md:w-fit h-full flex flex-col md:flex-row gap-4 p-4 md:p-[24px]">
            <div
              onClick={() => setOpenCheckoutPopup(false)}
              className="flex flex-row gap-2 font-semibold md:hidden"
            >
              <Image className="" width={8} height={8} src={backIcon} alt="" />
              Back
            </div>
            <div
              id="qr-code-image"
              className="relative place-self-center min-w-[310px]"
            >
              {upiLink && (
                <QRImage
                  text={upiLink}
                  options={{
                    type: "image/jpeg",
                    quality: 0.3,
                    errorCorrectionLevel: "H",
                    scale: 4,
                    margin: 0,
                    width: 310,
                  }}
                />
              )}
              <Image
                src={mivSticker}
                className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-16 object-contain pointer-events-none"
                alt="artifact image"
              />
            </div>
            <button
              type="button"
              onClick={shareQRCodeImage}
              className="w-full p-2 h-fit rounded-[8px] py-2 border-[1px] bg-black text-white font-medium cursor-pointer active:scale-99 text-[14px] md:hidden"
            >
              Share QR to UPI App
            </button>
            <div className="w-full h-full md:h-auto md:min-w-[445px] flex flex-col gap-4">
              <div className="w-full flex flex-row gap-2">
                <Image
                  src={artifact?.image}
                  width={47}
                  height={47}
                  className="object-contain"
                  alt="artifact image"
                />
                <div className="w-full flex flex-col gap-1">
                  <div className="w-full flex flex-row justify-between items-baseline font-medium text-[16px]">
                    <p className="text-[16px]">{artifact?.name}</p>
                    <p>₹{artifact?.price}</p>
                  </div>
                  <p className="text-[12px] text-[#808080]">
                    by {artifact?.from_member?.ig_username}
                  </p>
                </div>
              </div>
              <form
                onSubmit={(e) => e.preventDefault()}
                className="h-full flex flex-col gap-2 text-[14px]"
              >
                <div className="flex flex-col gap-1">
                  <label htmlFor="email" className="font-medium">
                    To Receive Deliverable(s)
                  </label>
                  <input
                    className="bg-[#F2F2F2] p-2 placeholder:text-[#808080] rounded-[5px]"
                    id="email"
                    name="email"
                    type="email"
                    placeholder="aakash@gmail.com"
                    value={userDetails.emailID}
                    onChange={(e) =>
                      handleUserDetailsUpdate("emailID", e.target.value)
                    }
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="email" className="font-medium">
                    For us to verify payment
                  </label>
                  <div className="w-full flex flex-col md:flex-row gap-2">
                    <input
                      className="w-full bg-[#F2F2F2] p-2 placeholder:text-[#808080] rounded-[5px]"
                      id="upiId"
                      name="upi id"
                      type="text"
                      placeholder="aakash@oksbi"
                      value={userDetails.upiID}
                      onChange={(e) =>
                        handleUserDetailsUpdate("upiID", e.target.value)
                      }
                    />
                    <input
                      className="w-full bg-[#F2F2F2] p-2 placeholder:text-[#808080] rounded-[5px]"
                      id="notePin"
                      name="note pin"
                      type="text"
                      placeholder="UPI Note Pin"
                      value={userDetails.secret}
                      maxLength={6}
                      onChange={(e) => {
                        const raw = e.target.value;
                        if (raw === "") {
                          handleUserDetailsUpdate("secret", "");
                        } else {
                          const value = parseInt(raw, 10);
                          if (!isNaN(value)) {
                            handleUserDetailsUpdate("secret", value);
                          }
                        }
                      }}
                    />
                  </div>
                </div>
                <div className="fixed bottom-4 w-[calc(100%-32px)] md:relative md:w-full flex flex-col md:flex-row gap-4 md:mt-auto">
                  <p className="md:w-[calc(50%-8px)] text-[12px] text-[#808080]">
                    by clicking “Connect with Seller” you agree to miv’s{" "}
                    <Link href={"/policy"} className="underline">
                      policies
                    </Link>
                  </p>
                  <button
                    type="button"
                    onClick={() => handleCheckout()}
                    className={`w-full md:w-[calc(50%-8px)] p-2 h-fit rounded-[8px] py-2 border-[1px] ${
                      paymentVerified
                        ? "bg-black cursor-pointer"
                        : "bg-[#808080] pointer-events-none"
                    } text-white font-medium cursor-pointer active:scale-99 text-[14px]`}
                  >
                    Connect with Seller
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutCard;
