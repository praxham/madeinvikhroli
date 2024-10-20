import React, { useState, useEffect, useRef, useContext } from "react";
import mivLogo from "../assets/mivlogo.svg";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Link } from "react-router-dom";
import NavigationContext from "../context/NavigationContext";

const NavBar = () => {
  const trasnlateElement = useRef(null);

  const {
    setSectionClicked,
    artifactsClicked,
    membersClicked,
    aboutUsClicked,
    translateToMarathi,
    setTranslateToMarathi,
  } = useContext(NavigationContext);

  const handleNavigationClick = (section) => {
    setSectionClicked(section);
  };

  const handleSwitchLanguage = () => {
    if (translateToMarathi === true) {
      setTranslateToMarathi(false);
    }
    if (translateToMarathi === false) {
      setTranslateToMarathi(true);
    }
  };

  return (
    <div className="fixed left-[50%] translate-x-[-50%] translate-y-[-50%] z-50 bg-black bg-opacity-80 backdrop-blur-[10px]  w-[1240px]  mx-auto p-4 rounded-[16px] flex flex-row justify-between items-center text-white text-4">
      <Link className="flex flex-row gap-4" to="/">
        <img src={mivLogo} alt="" />
        <div className="px-[12px] py-[6px] rounded-[50px] border-[2px] border-white text-nowrap">
          {translateToMarathi ? "विक्रोळीत निर्मित" : "made in vikhroli"}
        </div>
      </Link>

      <div className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] flex flex-row items-center justify-around gap-[24px] px-2 py-2 bg-[#262626] rounded-[10px]">
        <div
          className={`navitem cursor-pointer ${
            artifactsClicked ? "bg-[#323232]" : "bg-transparent"
          } px-2 py-1 rounded-[5px]`}
          onClick={() => handleNavigationClick("artifacts")}
        >
          {translateToMarathi ? "कलाकृत्या" : "Artifacts"}
        </div>
        <div
          className={`navitem cursor-pointer ${
            membersClicked ? "bg-[#323232]" : "bg-transparent"
          } px-2 py-1 rounded-[5px]`}
          onClick={() => handleNavigationClick("members")}
        >
          {translateToMarathi ? "सदस्य" : "Members"}
        </div>
        <div
          className={`navitem cursor-pointer ${
            aboutUsClicked ? "bg-[#323232]" : "bg-transparent"
          } px-2 py-1 rounded-[5px]`}
          onClick={() => handleNavigationClick("aboutUs")}
        >
          {translateToMarathi ? "आमच्या बद्दल" : "About Us"}
        </div>
      </Link>

      <div className="flex flex-row gap-2 cursor-pointer">
        <div onClick={handleSwitchLanguage} className="cursor-pointer">
          English
        </div>
        <div
          onClick={handleSwitchLanguage}
          className={`p-1 h-fit w-[36px] rounded-[50px] bg-[#262626] flex flex-row ${
            translateToMarathi ? "justify-end" : "justify-start"
          }`}
        >
          <div className="w-3 h-3 bg-white rounded-[50px]"></div>
        </div>
        <div onClick={handleSwitchLanguage} className="cursor-pointer">
          मराठी
        </div>
        <div ref={trasnlateElement}></div>
      </div>
    </div>
  );
};

export default NavBar;
