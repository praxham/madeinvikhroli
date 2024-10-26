import React from "react";
import mivlogogradient from "../../assets/mivlogogradient.png";
import mivstation from "../../assets/mivstation.png";
import discord from "../../assets/discord.svg";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const HeroSection = ({ translateToMarathi }) => {
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
      className="container w-[1240px] mx-auto mt-16 flex flex-col items-center justify-center relative snap-start"
    >
      <div className="z-20 flex flex-col items-center gap-2 text-white font-medium mt-[200px]">
        <div className="text-[100px] ">
          {translateToMarathi ? "एक कला मंडळ" : "An Art Collective"}
        </div>
        <div className="flex flex-row gap-4">
          <button className="bg-mivCol text-black px-[12px] py-[6px] rounded-[50px]">
            {translateToMarathi ? "डोनेट करा" : "Donate"}
            <span>❤️</span>
          </button>
          <a
            href="https://discord.gg/eKvZxeQRND"
            className="border-[#5865F2] text-[#5865F2] border-[2px] px-[12px] py-[6px] rounded-[50px] flex flex-row gap-2 items-center"
          >
            Join Discord
            <img src={discord} alt="" />
          </a>
        </div>
      </div>
      <div className="mivlogogradient  absolute bottom-[36px] -left-[150px] w-[275px] skew-x-[20deg] -rotate-[35deg]">
        <img className="absolute z-10" src={mivlogogradient} alt="" />
        <img
          className="absolute blur-2xl z-0 opacity-75"
          src={mivlogogradient}
          alt=""
        />
      </div>
      <div className="mivstation absolute bottom-[84px] -right-[220px] w-[450px] -skew-x-[25deg] rotate-[20deg]">
        <img className="absolute z-10" src={mivstation} alt="" />
        <img
          className="absolute blur-2xl z-0 opacity-75"
          src={mivstation}
          alt=""
        />
      </div>
    </div>
  );
};

export default HeroSection;
