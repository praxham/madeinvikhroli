import React, { useState, useEffect } from "react";
import mivLogo from "../assets/mivlogo.svg";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const NavBar = () => {
  const [translateToMarathi, setTranslateToMarathi] = useState(
    () => JSON.parse(localStorage.getItem('translateToMarathi')) || false
  );

  const handleTranslateToMarathi = () => {
    setTranslateToMarathi(true)
    window.location.reload();
  }

  const handleTranslateToEnglish = () => {
    setTranslateToMarathi(false)
    window.location.reload();
  }

  useGSAP(()=>{
    gsap.from(".navitem",{
      y: -20,
      opacity:0,
      duration:1,
      stagger: true
    })
  })

  useEffect(() => {
    localStorage.setItem('translateToMarathi', JSON.stringify(translateToMarathi));
  }, [translateToMarathi]);

  return (
    <div className="fixed left-[50%] translate-x-[-50%] translate-y-[-50%] z-50 bg-black w-[1240px]  mx-auto p-4 rounded-[16px] flex flex-row justify-between items-center text-white text-4">
      <div className="flex flex-row gap-4">
        <img src={mivLogo} alt="" />
        <div className="px-[12px] py-[6px] rounded-[50px] border-[2px] border-white text-nowrap">
          {translateToMarathi ? 'विक्रोळीत निर्मित' : 'made in vikhroli'}
        </div>
      </div>

      <div className=" absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] flex flex-row gap-[24px] px-4 py-2 bg-[#262626] rounded-[10px]">
        <div className="navitem">{translateToMarathi ? 'प्रोडक्ट्स' : 'Artifacts'}</div>
        <div className="navitem">{translateToMarathi ? 'सदस्य' : 'Members'}</div>
        <div className="navitem">{translateToMarathi ? 'आमच्या बद्दल' : 'About Us'}</div>
      </div>

      <div className="flex flex-row gap-2">
        <div onClick={handleTranslateToEnglish} className="cursor-pointer">English</div>
        <div className={`p-1 h-fit w-[36px] rounded-[50px] bg-[#262626] flex flex-row ${translateToMarathi ? 'justify-end' : 'justify-start '}`}>
          <div className="w-3 h-3 bg-white rounded-[50px]"></div>
        </div>
        <div onClick={handleTranslateToMarathi}  className="cursor-pointer">मराठी</div>
      </div>
    </div>
  );
};

export default NavBar;
