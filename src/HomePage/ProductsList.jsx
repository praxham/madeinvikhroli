import React, { useEffect, useState } from "react";
import vibrantQueen from "../assets/vibrantQueen.png";
import QRCode from "react-qr-code";
import mivlogowoutline from "../assets/mivlogowoutline.svg";
import { CardBody, CardContainer, CardItem } from "../Components/3d-card.jsx";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "../index.css";
import { EffectCoverflow, Pagination } from "swiper/modules";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import axios from "axios";
import { getArtifacts } from "../../public/API/getArtifacts.js";
import { postTransactions } from "../../public/API/postTransaction.js";

gsap.registerPlugin(ScrollTrigger);

// const ProductsInfo = [
//   {
//     productId: "MIV0101",
//     productTitle: "Clonned Flower",
//     productBy: "@praxham",
//     productPrice: 1,
//     productImage: vibrantQueen,
//     productTag: "Digital",
//     UPIID: "prathampatankar1234@oksbi",
//     productDescription: `"Vibrant Queen" celebrates the radiant spirit of motherhood. Captured on a Samsung A10s and artfully enhanced with Picsart, this striking portrait showcases a mother's innate vibrancy. The image masterfully balances raw authenticity with digital artistry, resulting in a visually captivating representation of maternal energy.`,
//     sellerPhoneNumber: 9076006477,
//     sellerEmailID: "prathampatankar1234@gmail.com",
//   },
//   {
//     productId: "MIV0101",
//     productTitle: "Clonned Flower",
//     productBy: "@praxham",
//     productPrice: 500,
//     productImage: vibrantQueen,
//     productTag: "Digital",
//     UPIID: "prathampatankar1234@oksbi",
//     productDescription: `"Vibrant Queen" is a psychedelic digital artwork, blending bold neon colors and abstract patterns to create hypnotic intensity.`,
//     sellerPhoneNumber: 9076006477,
//     sellerEmailID: "prathampatankar1234@gmail.com",
//   },
// ];

// generate code for adding two numbers

const ProductsList = () => {
  const [generatedUPILink, setGeneratedUPILink] = useState("");
  const [email, setEmail] = useState("prathampatankar1234@gmail.com");
  // prathampatankar1234@gmail.com
  const [buyerUPIID, setBuyerUPIID] = useState("prathampatankar1234@okicici");
  // prathampatankar1234@okicici
  const [verifyBuyerUPIID, setVerifyBuyerUPIID] = useState(false);
  const [upiTransactionID, setUPITransactionID] = useState(465276446933);
  // 463385466149
  const [verifyUPITransactionID, setVerifyUPITransactionID] = useState(false);
  const [paymentVerificationCode, setPaymentVerificationCode] = useState();
  const [paymentVerified, setPaymentVerified] = useState(false);
  const [paymentVerificationGeneratedCode,setPaymentVerificationGeneratedCode] = useState("");
  const [artifacts, setArtifacts] = useState([]);
  const [isAgreed, setIsAgreed] = useState(false)

  const testImg = 'https://i.imgur.com/4k8E89r.png'

  useEffect(()=>{
    const fetchData = async () => {
      const response = await getArtifacts()
      setArtifacts(response)
    }
    fetchData()
  },[])

  const handleEmailChange = (e) => {
    e.preventDefault();
    setEmail(e.target.value);
  };

  const handleBuyerUPIIDChange = (e) => {
    const inputVal = e.target.value;
    setBuyerUPIID(inputVal);
    console.log(buyerUPIID);
    if (/^[a-zA-Z0-9]+@[a-zA-Z]+$/.test(inputVal)) {
      setVerifyBuyerUPIID(true);
    } else {
      setVerifyBuyerUPIID(false);
    }
    console.log(verifyBuyerUPIID);
  };

  const handleUPITransactionIDChange = (e) => {
    const inputVal = e.target.value;
    setUPITransactionID(inputVal);
    if (/^\d{12}$/.test(inputVal)) {
      setVerifyUPITransactionID(true);
    } else {
      setVerifyUPITransactionID(false);
    }
    console.log(verifyUPITransactionID);
  };

  const handlePaymentVerificationCodeChange = (e) => {
    const inputVal = e.target.value;
    setPaymentVerificationCode(inputVal);
    const matchCodes = inputVal == paymentVerificationGeneratedCode;
    setPaymentVerified(
      matchCodes && verifyBuyerUPIID && verifyUPITransactionID
    );
    console.log(paymentVerified, "hi");
    
  };

  

  const createTransactionRecord = async (artifactID,price,upiTransactionID,buyerUPIID,email,paymentVerificationGeneratedCode) => {
    try {
      const transactionData = {
        artifactID,
        upiTransactionID, 
        upiID: buyerUPIID, 
        secretKey: paymentVerificationGeneratedCode,
        price,
        userEmailID: email, 
      };

      console.log(transactionData);
      const response = await postTransactions(artifactID,transactionData);
      console.log('Transaction record created:', response.data);
      // Handle success (e.g., notify user or redirect)
    } catch (error) {
      console.error('Error creating transaction record:', error);
      // Handle error (e.g., notify user)
    }
  };

  const generateUPILink = (artifactID, price, UPIID) => {
    const paymentVerifier = Math.floor(100000 + Math.random() * 900000); // 6-digit random number
    setPaymentVerificationGeneratedCode(paymentVerifier);
    const upiLink = `upi://pay?pa=${
      UPIID
    }&pn=${encodeURIComponent(artifactID)}&am=${
      price
    }&cu=INR&tn=${encodeURIComponent(paymentVerifier)}`;
    setGeneratedUPILink(upiLink);

    return paymentVerifier;
    // Update state with the generated link
  };

  const handleSendWhatsApp = (artifactID, artifactPrice ) => {
    const message = `Buyer UPI ID: ${buyerUPIID}\nTransaction ID: ${upiTransactionID}\nVerification Code: ${paymentVerificationCode}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappLink = `https://wa.me/${artifacts.sellerPhoneNumber}?text=${encodedMessage}`;
    paymentVerified && (
      createTransactionRecord(artifactID, artifactPrice,upiTransactionID,buyerUPIID,email,paymentVerificationGeneratedCode)
    )
    // window.open(whatsappLink, "_blank");
  };

  useGSAP(()=>{
    gsap.from(".artifacts",{
      y: 40,
      opacity: 0,
      duration:2,
      scrollTrigger:{
        trigger:".container2",
        scroller: "body",
        markers:true,
      }
    })
  })

  return (
    <div className="container2 w-[1240px] h-[800px] mx-auto mt-[500px] mb-16 flex flex-row gap-4 flex-wrap justify-center snap-start relative">
      <div className="artifacts -mb-[100px] text-[100px] font-medium text-white mr-auto">
        Artifacts
      </div>
      {/* <img src={testImg} alt="" /> */}
      <Swiper
        effect={"coverflow"}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={"auto"}
        coverflowEffect={{
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
        pagination={true}
        modules={[EffectCoverflow, Pagination]}
        className="mySwiper w-screen overflow-visible"
      >
        {artifacts.map((artifact) => {
          // const productInfo = artifacts[index % artifacts.length]; // Loop through ProductsInfo if less than 8
          return (
            <SwiperSlide>
              <CardContainer
                key={artifact.artifactID}
                className="inter-var w-[1200px] h-fit flex flex-row items-start gap-2 bg-[#1A1A1A] p-4 rounded-[12px] text-white text-4 font-medium"
              >
                {/* <div>{generatedUPILink || ""}</div> */}
                <CardItem
                  translateZ="40"
                  className="w-1/2 h-full bg-black flex flex-row items-center justify-center relative rounded-[12px]"
                >
                  <img className="rounded-[12px]" src={artifact.artifactImage || testImg} alt="" /> 
                  <div className="absolute top-4 right-4 w-fit px-2 py-1 border-white text-white border-[2px] rounded-[20px]">
                    {artifact.artifactTag}
                  </div>
                </CardItem>
                <CardItem
                  translateZ="40"
                  className="w-1/2 flex flex-col gap-2 text-white rounded-[8px] p-4"
                >
                  <div className="w-full flex flex-row justify-between">
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
                  <div onChange={(e) => setIsAgreed(e.target.checked)} className="flex items-center">
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
                      I agree to this website's payment policy before making payment
                    </label>
                  </div>
                  <div className={`flex flex-row gap-4 ${isAgreed ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
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
                          onClick={()=> generateUPILink(artifact.artifactID, artifact.artifactPrice, artifact.UPIID)}
                          className="text-[14px] bg-white text-black px-2 py-1 mt-2 rounded-[15px] text-nowrap"
                        >
                          Generate Another Payment QR
                        </button>
                      ) : (
                        
                        <button
                          onClick={()=> generateUPILink(artifact.artifactID, artifact.artifactPrice, artifact.UPIID)}
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
              {console.log(artifact.artifactID)}

                    </div>
                    <form
                      className="w-full flex flex-col gap-2 text-white"
                      action=""
                    >
                      {/* <div className="text-[14px]">
                    Payments made on this website are directly sent towards
                    maker of product, anything you want to discuss related
                    regarding payment or product shall be discussed, Made in
                    Vikhroli is just a platform for easy showcase and payment
                    collection, After verifying the upi id you can download the
                    dowloadable from here, we’ll send link to you
                  </div> */}
                      {/* <div>{paymentVerificationGeneratedCode}</div> */}
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
                      />
                      <input
                        className={`bg-transparent text-white placeholder:text-[#808080] ${
                          paymentVerified
                            ? "border-green-800 border-[2px] text-green-800 focus:outline-green-800"
                            : "border-white"
                        } border-[2px] p-2 rounded-[12px]`}
                        type="email"
                        value={upiTransactionID}
                        onChange={handleUPITransactionIDChange}
                        placeholder="Enter Transaction ID"
                      />
                      {paymentVerificationGeneratedCode}
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
                      />
                    </form>
                  </div>
                  <div className="w-full flex flex-row gap-2">
                    <button
                      className={`w-full bg-green-800 text-white py-3 rounded-[15px] ${
                        paymentVerified ? "opacity-100" : "opacity-50"
                      }`}
                      onClick={paymentVerified ? handleSendWhatsApp(artifact.artifactId, artifact.artifactPrice) : null}
                    >
                      Recieve Deliverables on WhatsApp
                    </button>
                    <a
                      href=""
                      className={`w-full bg-green-800 text-white py-3 rounded-[15px] ${
                        paymentVerified ? "opacity-100" : "opacity-50"
                      }`}
                    >
                      Recieve Deliverables on Email
                    </a>
                  </div>
                  
                </CardItem>
              </CardContainer>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default ProductsList;
