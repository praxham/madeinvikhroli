import React, { useEffect, useState, useRef } from "react";
import QRCode from "react-qr-code";
import mivlogowoutline from "../../assets/mivlogowoutline.svg";
import {
  CardBody,
  CardContainer,
  CardItem,
} from "../../Components/3d-card.jsx";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "../../index.css";
import { EffectCoverflow, Pagination } from "swiper/modules";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import axios from "axios";
import { getArtifacts } from "../../API/getArtifacts.js";
import { postTransactions } from "../../API/postTransaction.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

gsap.registerPlugin(ScrollTrigger);

const Artifacts = ({translateToMarathi}) => {
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


  const testImg = "https://i.imgur.com/4k8E89r.png";

  const artifactRef = useRef(null);
  const trasactionDetails = useRef(null);

  let isSelected;

  useEffect(() => {
    const fetchData = async () => {
      const response = await getArtifacts();
      setArtifacts(response);
    };
    fetchData();
  }, []);


  const handleEmailChange = (e) => {
    e.preventDefault();
    setEmail(e.target.value);
  };

  const testvar = "test"

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
    <div className="container2 w-[1240px] h-fit mx-auto mt-[500px] mb-16 flex flex-row gap-4 flex-wrap justify-center snap-start relative">
      <ToastContainer />
      <div className="artifacts absolute -top-[64px] left-0 -mb-[100px] text-[100px] font-medium text-white">
        {translateToMarathi ? "कलाकृत्या" : "Artifacts"}
      </div>
      {artifacts.map((artifact) => {
        isSelected = selectedArtifact === artifact.artifactID;
        return (
          <>
            <CardContainer
              key={artifact.artifactID}
              className={`inter-var ${
                isSelected ? "w-[1200px] flex-row" : "w-fit flex-col"
              } h-fit flex items-start gap-2 gap-y-2 bg-[#1A1A1A] p-4 rounded-[12px] text-white text-4 font-medium`}
              ref={artifactRef}
            >
              {isSelected ? (
                <CardItem
                  translateZ="40"
                  className={`h-full bg-black flex flex-row ${
                    isSelected
                      ? "items-center w-1/2"
                      : "items-start justify-left w-full"
                  } justify-center relative rounded-[12px]`}
                >
                  <img
                    className="rounded-[12px]"
                    src={artifact.artifactImage}
                    alt=""
                  />
                  <div className="absolute top-4 right-4 w-fit px-2 py-1 border-white text-white border-[2px] rounded-[20px]">
                    {artifact.artifactTag}
                  </div>
                </CardItem>
              ) : (
                <CardItem
                  translateZ="40"
                  className="w-[350px] h-full bg-black flex flex-col items-center justify-center relative rounded-[12px]"
                >
                  <div className="bg-black flex flex-row items-center justify-center relative rounded-[12px]">
                    <img
                      className="rounded-[12px]"
                      src={artifact.artifactImage || testImg}
                      alt=""
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
                  className="w-1/2 flex flex-col gap-2 text-white rounded-[8px] p-4"
                >
                  <div className="w-full flex flex-row justify-between relative">
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-row gap-2">
                        <div className="text-nowrap">
                          {artifact.artifactTitle}
                        </div>
                        <div className="text-[#808080] text-nowrap">
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
                    className="flex items-center"
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
                    className={`flex flex-row gap-4 ${
                      isAgreed
                        ? "opacity-100"
                        : "opacity-50 pointer-events-none"
                    }`}
                  >
                    <div className="h-fit w-fit relative flex flex-col items-center">
                      <QRCode
                        className={`${
                          generatedUPILink ? "blur-none" : "blur-sm"
                        } rounded-[8px] p-4 bg-white`}
                        value={generatedUPILink}
                        size={256} // You can adjust this size
                        level={"H"}
                      />
                      {generatedUPILink && (
                        <img
                          className="absolute top-[45%] left-[50%] translate-x-[-50%] translate-y-[-50%] h-[74px] filter-[drop-shadow(0 0 16px white)]"
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
                          className="text-[14px] bg-white text-black px-2 py-1 mt-2 rounded-[15px] text-nowrap"
                        >
                          Generate Another Payment QR
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
                          className="text-[14px] bg-white text-black px-2 py-1 mt-2 rounded-[15px] text-nowrap"
                        >
                          Generate Payment QR
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
                  <div className="w-full flex flex-row gap-2 font-semibold">
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
                      Recieve Deliverables on Email (Automatic)
                    </button>
                  </div>
                </CardItem>
              ) : (
                <CardItem
                  translateZ="40"
                  className="w-full text-white rounded-[8px]"
                >
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
                      {translateToMarathi ? `${(artifact.artifactPrice).toLocaleString("hi-u-nu-deva")}₹ विकत घ्या ` : `Buy Now for ${artifact.artifactPrice}₹`}
                      
                    </button>
                    {/* <div>{artifact.artifactPrice}₹</div> */}
                  </div>
                </CardItem>
              )}
            </CardContainer>
          </>
          // </SwiperSlide>
        );
      })}
      {/* </Swiper> */}
    </div>
  );
};

export default Artifacts;
