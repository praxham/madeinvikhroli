import React, { useState, useEffect, useRef, useContext } from "react";
import mivLogo from "../assets/mivlogo.svg";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Link } from "react-router-dom";
import NavigationContext from "../context/NavigationContext";
import engtomartranslateicon from "../assets/engtomartranslateicon.svg";

const NavBar = () => {
  const [width, setWidth] = useState(window.innerWidth - 16);
  const [isVisible, setIsVisible] = useState(false);
  let timeoutId;
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

  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth >= 1240 ? 1240 : window.innerWidth - 36; // Set width to 1240px for large screens
      setWidth(newWidth);
    };

    window.addEventListener("resize", handleResize); // Add event listener

    return () => {
      window.removeEventListener("resize", handleResize); // Cleanup on unmount
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(true); // Show navbar on scroll

      // Clear previous timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      // Hide navbar after 2 seconds of inactivity
      timeoutId = setTimeout(() => {
        setIsVisible(false);
      }, 2000); // Adjust time as needed
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId); // Cleanup timeout on unmount
    };
  }, []);

  return (
    <>
      <div
        className="fixed left-[50%] -translate-x-[50%] -translate-y-[50%] z-50 bg-black bg-opacity-80 backdrop-blur-[10px] lg:w-[1240px] lg:mx-auto p-4 rounded-[16px] flex flex-row justify-between items-center text-white text-4"
        style={{ width: `${width}px` }}
      >
        <Link className="flex flex-row gap-4" to="/">
          <img src={mivLogo} alt="" />
          <div className="px-[12px] py-[6px] rounded-[50px] border-[2px] border-white text-nowrap hidden lg:block">
            {translateToMarathi ? "विक्रोळीत निर्मित" : "made in vikhroli"}
          </div>
        </Link>

        <div className="font-dirtyline hidden absolute left-[50%] lg:top-[50%] translate-x-[-50%] lg:translate-y-[-50%] lg:text-4 text-[14px] text-nowrap lg:flex flex-row items-center justify-around lg:gap-[24px] lg:px-2 px-1 py-1 lg:py-2 bg-[#262626] rounded-[10px]">
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
        </div>

        <div className="flex flex-row gap-2 cursor-pointer">
          <img
            onClick={handleSwitchLanguage}
            src={engtomartranslateicon}
            alt=""
          />
          {/* <div onClick={handleSwitchLanguage} className="cursor-pointer">
          En
        </div>
        <div
          onClick={handleSwitchLanguage}
          className={`p-1 h-fit w-[28px] rounded-[50px] bg-[#262626] flex flex-row ${
            translateToMarathi ? "justify-end" : "justify-start"
          }`}
        >
          <div className="w-3 h-3 bg-white rounded-[50px]"></div>
        </div>
        <div onClick={handleSwitchLanguage} className="cursor-pointer">
          म
        </div>
        <div ref={trasnlateElement}></div> */}
        </div>
      </div>
      <div
      className={`font-dirtyline fixed z-50 left-[50%] bottom-4 lg:top-[50%] translate-x-[-50%] lg:translate-y-[-50%] text-4 text-nowrap flex flex-row items-center justify-around lg:gap-[24px] lg:px-2 px-1 py-1 lg:py-2 bg-[#262626] text-white rounded-[10px] transition-opacity duration-300 lg:hidden ${isVisible ? 'opacity-100 ' : 'opacity-0 pointer-events-none'}`}
    >
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
    </div>
    </>
  );
};

export default NavBar;
