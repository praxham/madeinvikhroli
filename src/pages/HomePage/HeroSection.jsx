import React, { useState } from "react";
import mivlogogradient from "../../assets/mivlogogradient.png";
import mivstation from "../../assets/mivstation.png";
import discord from "../../assets/discord.svg";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import DonationQRPopUp from "../../Components/DonationQRPopUp";

const HeroSection = ({ translateToMarathi }) => {
  const [donationQRPopUp, setDonationQRPopUp] = useState(false)
  useGSAP(() => {
      gsap.from(".mivlogogradient", {
        x: -500,
        y: -500,
        scale:0,
        duration:1.5,
      });
      gsap.from(".mivstation", {
        x: 500,
        y: -500,
        scale:0,
        duration:1.5,
      });
    }
  ); 
  return (
    <div
      className="container w-full h-screen lg:h-full lg:w-[1240px] mx-auto mt-16 flex flex-col items-center justify-center relative snap-start"
    >
      <div className="z-20 flex flex-col items-center gap-2 text-white font-medium mt-[380px] lg:mt-[200px] mx-4">
        <div className="lg:text-[100px] text-[64px] text-center font-dirtyline">
          {translateToMarathi ? "एक कला मंडळ" : "An Art Collective "}
        </div>
        <div className="flex flex-row gap-4">
          {donationQRPopUp && <DonationQRPopUp setDonationQRPopUp={setDonationQRPopUp} />}
          <a href="upi://pay?pa=prathampatankar1234@oksbi&pn=prathampatankar&tn=Donation&cu=INR" onMouseEnter={()=>setDonationQRPopUp(true)} onMouseLeave={()=>setDonationQRPopUp(false)}  className="bg-mivCol text-black px-[12px] py-[6px] flex items-center justify-center rounded-[50px]">
            {translateToMarathi ? "डोनेट करा" : "Donate"}
            <span>❤️</span>
          </a>
          <a
            href="https://discord.gg/eKvZxeQRND"
            className="border-[#5865F2] text-[#5865F2] border-[2px] px-[12px] py-[6px] rounded-[50px] flex flex-row gap-2 items-center"
          >
            Join Discord
            <img src={discord} alt="" />
          </a>
        </div>
      </div>
      <div className="absolute lg:bottom-[36px] block lg:hidden left-[50%] transform -translate-x-[50%] top-[10%] lg:-left-[150px] w-[220px] h-fit lg:w-[275px] lg:skew-x-[20deg] lg:-rotate-[35deg]">
        <img className="absolute z-10" src={mivlogogradient} alt="" />
        <img
          className="animate-pulse absolute blur-2xl z-0 opacity-75"
          src={mivlogogradient}
          alt="made in vikrholi"
        />
      </div>
      <div className="mivlogogradient absolute bottom-[36px] hidden lg:block lg:-left-[150px] w-[150px] h-fit lg:w-[275px] lg:skew-x-[20deg] lg:-rotate-[35deg]">
        <img className="absolute z-10" src={mivlogogradient} alt="" />
        <img
          className="absolute blur-2xl z-0 opacity-75"
          src={mivlogogradient}
          alt="made in vikrholi"
        />
      </div>
      <div className="mivstation absolute bottom-[84px] hidden lg:block lg:-right-[220px] w-[200px] lg:w-[450px] lg:-skew-x-[25deg] lg:rotate-[20deg]">
        <img className="absolute z-10" src={mivstation} alt="" />
        <img
          className="absolute blur-2xl z-0 opacity-75"
          src={mivstation}
          alt="made in vikrholi"
        />
      </div>
    </div>
  );
};

export default HeroSection;
