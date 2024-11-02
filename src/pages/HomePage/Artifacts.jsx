import React, { useEffect, useState, useRef } from "react";
import QRCode from "react-qr-code";
import mivlogowoutline from "../../assets/mivlogowoutline.svg";
import {
  CardContainer,
  CardItem,
} from "../../Components/3d-card.jsx";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import axios from "axios";
import { getArtifacts } from "../../API/getArtifacts.js";
import { postTransactions } from "../../API/postTransaction.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "../../Components/Loading.jsx";

gsap.registerPlugin(ScrollTrigger);

const Artifacts = ({ translateToMarathi }) => {
  const [generatedUPILink, setGeneratedUPILink] = useState("");
  const [email, setEmail] = useState("");
  const [buyerUPIID, setBuyerUPIID] = useState("");
  const [verifyBuyerUPIID, setVerifyBuyerUPIID] = useState(false);
  const [upiTransactionID, setUPITransactionID] = useState(null);
  const [verifyUPITransactionID, setVerifyUPITransactionID] = useState(false);
  const [paymentVerificationCode, setPaymentVerificationCode] = useState();
  const [paymentVerified, setPaymentVerified] = useState(false);
  const [
    paymentVerificationGeneratedCode,
    setPaymentVerificationGeneratedCode,
  ] = useState("");
  const [artifacts, setArtifacts] = useState([]);
  const [isAgreed, setIsAgreed] = useState(false);
  const [transactionMessage, setTransactionMessage] = useState("");
  const [selectedArtifact, setSelectedArtifact] = useState(null);
  const [artifactPopUp, setArtifactPopUp] = useState(false);
  const [loading, setLoading] = useState(true);

  const testImg = "https://i.imgur.com/4k8E89r.png";

  const artifactRef = useRef(null);
  const trasactionDetails = useRef(null);

  let isSelected;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Set loading to true before fetching
        const response = await getArtifacts();
        setArtifacts(response);
      } catch (error) {
        console.error("Error fetching artifacts:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };
    fetchData();
  }, []);

  const handleEmailChange = (e) => {
    e.preventDefault();
    setEmail(e.target.value);
  };

  const testvar = "test";

  const handleBuyerUPIIDChange = (e) => {
    const inputVal = e.target.value;
    setBuyerUPIID(inputVal);
    if (/^[a-zA-Z0-9]+@[a-zA-Z]+$/.test(inputVal)) {
      setVerifyBuyerUPIID(true);
    } else {
      setVerifyBuyerUPIID(false);
    }
  };

  const handleUPITransactionIDChange = (e) => {
    const inputVal = e.target.value;
    setUPITransactionID(inputVal);
    if (/^\d{12}$/.test(inputVal)) {
      setVerifyUPITransactionID(true);
    } else {
      setVerifyUPITransactionID(false);
    }
  };

  const handlePaymentVerificationCodeChange = (e) => {
    const inputVal = e.target.value;
    setPaymentVerificationCode(inputVal);
    const matchCodes = inputVal == paymentVerificationGeneratedCode;
    setPaymentVerified(
      matchCodes && verifyBuyerUPIID && verifyUPITransactionID
    );
  };

  const createTransactionRecord = async (
    artifactID,
    price,
    upiTransactionID,
    buyerUPIID,
    email,
    paymentVerificationGeneratedCode,
    whatsappLink
  ) => {
    try {
      const transactionData = {
        artifactID,
        upiTransactionID,
        upiID: buyerUPIID,
        secretKey: paymentVerificationGeneratedCode,
        price,
        userEmailID: email,
      };
      const response = await postTransactions(transactionData);
      setTransactionMessage(response.message);
      if (response.message === "Transaction Saved Successfully") {
        toast.success("Transaction Saved Successfully");
        setIsAgreed(false);
        window.open(whatsappLink, "_blank");
        setEmail("");
        setUPITransactionID("");
        setBuyerUPIID("");
        setPaymentVerificationCode("");
      } else if (response.message === "Transaction already exists") {
        toast.warning("Transaction already exists");
      } else {
        toast.error("Error processing transaction");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const createTransactionWithoutWA = async (artifactID, price) => {
    try {
      const data = {
        artifactID,
        upiTransactionID,
        upiID: buyerUPIID,
        secretKey: paymentVerificationGeneratedCode,
        price,
        userEmailID: email,
      };
      const response = await postTransactions(data);
      setTransactionMessage(response.message);
      if (response.message === "Transaction Saved Successfully") {
        toast.success("Transaction Saved Successfully"); // Success notification
        setIsAgreed(false);
        setEmail("");
        setUPITransactionID("");
        setBuyerUPIID("");
        setPaymentVerificationCode("");
      } else if (response.message === "Transaction already exists") {
        toast.warning("Transaction already exists"); // Warning notification
      } else {
        toast.error("Error processing transaction"); // Alert notification
      }
    } catch (error) {
      console.log(error);
    }
  };

  const generateUPILink = (artifactID, price, UPIID) => {
    const paymentVerifier = Math.floor(100000 + Math.random() * 900000); // 6-digit random number
    setPaymentVerificationGeneratedCode(paymentVerifier);
    const upiLink = `upi://pay?pa=${UPIID}&pn=${encodeURIComponent(
      artifactID
    )}&am=${price}&cu=INR&tn=${encodeURIComponent(paymentVerifier)}`;
    setGeneratedUPILink(upiLink);
  };

  const handleSendWhatsApp = (artifactID, artifactPrice, sellerPhoneNumber) => {
    const message = `UPI ID: ${buyerUPIID}\nTransaction ID: ${upiTransactionID}\nVerification Code: ${paymentVerificationCode}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappLink = `https://wa.me/${sellerPhoneNumber}?text=${encodedMessage}`;
    createTransactionRecord(
      artifactID,
      artifactPrice,
      upiTransactionID,
      buyerUPIID,
      email,
      paymentVerificationGeneratedCode,
      whatsappLink
    );
  };

  useGSAP(() => {
    gsap.from(".artifacts", {
      y: 40,
      opacity: 0,
      duration: 2,
      scrollTrigger: {
        trigger: ".container2",
        scroller: "body",
      },
    });
  });
  return (
    <div className="container2 w-full lg:w-[1240px] h-full mx-auto mt-[100px] lg:mt-[500px] mb-16 flex flex-row gap-4 gap-y-0 flex-wrap justify-center snap-start relative">
      <ToastContainer />
      <div className="artifacts absolute -top-[64px] lg:-top-[124px] left-0 lg:-mb-[100px] text-[64px] mx-4 lg:mx-0 lg:text-[100px] font-medium text-white font-dirtyline">
        {translateToMarathi ? "कलाकृत्या" : "Artifacts"}
      </div>
      {loading ? (<Loading />) : (
        <>
      {artifacts.map((artifact) => {
        isSelected = selectedArtifact === artifact.artifactID;
        return (
            <CardContainer
              key={artifact.artifactID}
              className={`inter-var ${
                isSelected ? "lg:w-[1200px] w-full flex-row" : "w-fit flex-col"
              } mx-4 lg:mx-0 h-fit flex items-center lg:items-start gap-2 gap-y-2 bg-[#1A1A1A] p-4 rounded-[12px] text-white text-4 font-medium`}
              ref={artifactRef}
            >
              {isSelected ? (
                <CardItem
                  translateZ="40"
                  className={`true h-full bg-black flex flex-row ${
                    isSelected
                      ? "items-center lg:w-1/2"
                      : "items-start justify-left"
                  } justify-center relative rounded-[12px] hidden lg:block`}
                >
                  <img
                    className="rounded-[12px]"
                    src={artifact.artifactImage}
                    alt="made in vikrholi"
                  />
                  
                  <div className="absolute top-4 right-4 w-fit px-2 py-1 border-white text-white border-[2px] rounded-[20px]">
                    {artifact.artifactTag}
                  </div>
                </CardItem>
              ) : (
                <CardItem
                  translateZ="40"
                  className="lg:w-[350px] w-full h-full bg-black lg:flex flex-col items-center justify-center relative rounded-[12px] hidden"
                >
                  <div className="bg-black flex flex-row items-center justify-center relative rounded-[12px]">
                    <img
                      className="rounded-[12px]"
                      src={artifact.artifactImage}
                      alt="made in vikrholi"
                    />
                    <div className="absolute top-4 right-4 w-fit px-2 py-1 border-white text-white border-[2px] rounded-[20px]">
                      {artifact.artifactTag}
                    </div>
                  </div>
                </CardItem>
              )}
              {isSelected ? (
                <CardItem
                  translateZ="40"
                  className="lg:w-1/2 w-full flex flex-col gap-2 text-white rounded-[8px] lg:p-4"
                >
                  <div
                    className={`h-full w-full bg-black flex flex-row ${
                      isSelected
                        ? "items-center lg:w-1/2"
                        : "items-start justify-left"
                    } justify-center relative rounded-[12px] lg:hidden block`}
                  >
                    <img
                      className="rounded-[12px]"
                      src={artifact.artifactImage}
                      alt="made in vikrholi"
                    />
                    <div className="absolute top-4 right-4 w-fit px-2 py-1 border-white text-white border-[2px] rounded-[20px]">
                      {artifact.artifactTag}
                    </div>
                  </div>
                  <div className="w-full flex flex-row justify-between relative">
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-row gap-2 text-wrap">
                        <div className="">{artifact.artifactTitle}</div>
                        <div className="text-[#808080]">
                          by {artifact.artifactBy}
                        </div>
                      </div>
                    </div>
                    <div>{artifact.artifactPrice}₹</div>
                  </div>
                  <div className="text-[14px] w-full">
                    {artifact.artifactDescription}
                  </div>
                  <div
                    onChange={(e) => setIsAgreed(e.target.checked)}
                    className="w-full flex items-start"
                  >
                    <input
                      id="agreement"
                      name="agreement"
                      type="checkbox"
                      checked={isAgreed}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="agreement"
                      className="ml-2 block text-sm text-white"
                    >
                      I agree to this website's Purchase Policy before making
                      payment
                    </label>
                  </div>
                  <div
                    className={`w-full flex flex-col items-center lg:flex-row gap-4 ${
                      isAgreed
                        ? "opacity-100"
                        : "opacity-50 pointer-events-none"
                    }`}
                  >
                    <div className="h-fit w-full lg:w-fit relative flex flex-col items-center">
                      <QRCode
                        className={`${
                          generatedUPILink ? "blur-none" : "blur-sm"
                        } rounded-[8px] p-4 bg-white lg:block hidden`}
                        value={generatedUPILink}
                        size={256} // You can adjust this size
                        level={"H"}
                      />
                      <a
                        href={generatedUPILink}
                        className="w-full bg-mivCol text-black p-3 text-center rounded-[15px] font-semibold lg:hidden block"
                      >
                        Pay via UPI apps
                      </a>
                      {generatedUPILink && (
                        <img
                          className="absolute top-[45%] left-[50%] translate-x-[-50%] translate-y-[-50%] h-[74px] filter-[drop-shadow(0 0 16px white)] lg:block hidden"
                          src={mivlogowoutline}
                        />
                      )}
                      {generatedUPILink ? (
                        <button
                          onClick={() =>
                            generateUPILink(
                              artifact.artifactID,
                              artifact.artifactPrice,
                              artifact.UPIID
                            )
                          }
                          className="w-full lg:w-fit text-[14px] bg-white text-black px-2 py-1 mt-2 rounded-[15px] text-nowrap whitespace-nowrap"
                        >
                          Generate Another Payment{" "}
                          <span className="hidden lg:block">QR</span>{" "}
                          <span className="block lg:hidden">Link</span>
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            generateUPILink(
                              artifact.artifactID,
                              artifact.artifactPrice,
                              artifact.UPIID
                            )
                          }
                          className="w-full lg:w-fit text-[14px] bg-white text-black px-2 py-1 mt-2 rounded-[15px] text-nowrap"
                        >
                          Generate Payment{" "}
                          <span className="hidden lg:block">QR</span>{" "}
                          <span className="block lg:hidden">Link</span>
                        </button>

                        // <button
                        //   onClick={generateUPILink}
                        //   className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-[14px] bg-white text-black px-2 py-1 rounded-[15px] text-nowrap"
                        // >
                        //   Generate Payment QR
                        // </button>
                      )}
                    </div>
                    <form
                      className="w-full flex flex-col gap-2 text-white"
                      action=""
                      ref={trasactionDetails}
                    >
                      <div>
                        After Making Payment, <br />
                        Enter Payment Details
                      </div>
                      <input
                        className="bg-transparent text-white placeholder:text-[#808080] border-white border-[2px] p-2 rounded-[12px] "
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        placeholder="Enter Email ID"
                        required
                      />
                      <input
                        className={`bg-transparent text-white placeholder:text-[#808080] ${
                          paymentVerified
                            ? "border-green-800 border-[2px] text-green-800 focus:outline-green-800"
                            : "border-white"
                        } border-[2px] p-2 rounded-[12px]`}
                        type="text"
                        value={buyerUPIID}
                        onChange={handleBuyerUPIIDChange}
                        placeholder="Enter UPI ID"
                        required
                      />
                      <input
                        className={`bg-transparent text-white placeholder:text-[#808080] ${
                          paymentVerified
                            ? "border-green-800 border-[2px] text-green-800 focus:outline-green-800"
                            : "border-white"
                        } border-[2px] p-2 rounded-[12px]`}
                        type="number"
                        value={upiTransactionID}
                        onChange={handleUPITransactionIDChange}
                        placeholder="Enter Transaction ID"
                        required
                      />
                      <input
                        className={`bg-transparent text-white placeholder:text-[#808080] ${
                          paymentVerified
                            ? "border-green-800 border-[2px] text-green-800 focus:outline-green-800"
                            : "border-white"
                        }   border-[2px] p-2 rounded-[12px]`}
                        type="number"
                        value={paymentVerificationCode}
                        onChange={handlePaymentVerificationCodeChange}
                        placeholder="Enter 6 Digit Code from UPI QR Note"
                        required
                      />
                    </form>
                  </div>
                  <div className="w-full flex flex-col lg:flex-row gap-2 font-semibold">
                    <button
                      className={`w-full bg-mivCol text-black py-3 rounded-[15px] ${
                        paymentVerified ? "opacity-100" : "opacity-50"
                      }`}
                      onClick={() =>
                        handleSendWhatsApp(
                          artifact.artifactID,
                          artifact.artifactPrice,
                          artifact.sellerPhoneNumber
                        )
                      }
                    >
                      Recieve Deliverables on WhatsApp
                    </button>
                    <button
                      onClick={() =>
                        createTransactionWithoutWA(
                          artifact.artifactID,
                          artifact.artifactPrice
                        )
                      }
                      className={`w-full bg-mivCol text-black text-center p-3 rounded-[15px] ${
                        paymentVerified ? "opacity-100" : "opacity-50"
                      }`}
                    >
                      Recieve Deliverables on Email
                    </button>
                  </div>
                </CardItem>
              ) : (
                <CardItem
                  translateZ="40"
                  className="w-full text-white rounded-[8px] flex flex-col gap-2"
                >
                  <div
                    className={`h-full bg-black flex flex-row ${
                      isSelected
                        ? "items-center lg:w-1/2 w-full"
                        : "items-start justify-left w-full"
                    } justify-center relative rounded-[12px] lg:hidden block`}
                  >
                    <img
                      className="rounded-[12px]"
                      src={artifact.artifactImage}
                      alt="made in vikrholi"
                    />
                    <div className="absolute top-4 right-4 w-fit px-2 py-1 border-white text-white border-[2px] rounded-[20px]">
                      {artifact.artifactTag}
                    </div>
                  </div>
                  <div className="w-full flex flex-col gap-2 justify-between">
                    <div className="w-full flex flex-row items-start justify-start gap-2">
                      <div className="text-nowrap">
                        {artifact.artifactTitle}
                      </div>
                      <div className="text-[#808080] text-nowrap">
                        by {artifact.artifactBy}
                      </div>
                    </div>
                    <button
                      className="w-full bg-mivCol text-black p-3 rounded-[15px] font-semibold cursor-pointer"
                      onClick={() => setSelectedArtifact(artifact.artifactID)}
                    >
                      {translateToMarathi
                        ? `${artifact.artifactPrice.toLocaleString(
                            "hi-u-nu-deva"
                          )}₹ विकत घ्या `
                        : `Buy Now for ${artifact.artifactPrice}₹`}
                    </button>
                    {/* <div>{artifact.artifactPrice}₹</div> */}
                  </div>
                </CardItem>
              )}
            </CardContainer> 
        );
      })}
      </>)
      }
      {/* </Swiper> */}
    </div>
  );
};

export default Artifacts;
