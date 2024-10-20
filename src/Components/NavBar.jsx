import React, { useState, useEffect, useRef } from "react";
import mivLogo from "../assets/mivlogo.svg";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Link } from "react-router-dom";

const NavBar = () => {
  const [translateToMarathi, setTranslateToMarathi] = useState(
    () => JSON.parse(localStorage.getItem("translateToMarathi")) || false
  );

  const trasnlateElement = useRef(null)

  
  // const handleTranslateToMarathi = () => {
  //   setTranslateToMarathi(true);
  //   window.location.reload();
  // };

  // const handleTranslateToEnglish = () => {
  //   setTranslateToMarathi(false);
  //   window.location.reload();
  // };

  const handleSwitchLanguage = () => {
    if(translateToMarathi === true){
      setTranslateToMarathi(false);
      window.location.reload();
    }
    if(translateToMarathi === false){
      setTranslateToMarathi(true);
      window.location.reload();
    }
  }

  // useGSAP(() => {
  //   gsap.from(".navitem", {
  //     y: -20,
  //     opacity: 0,
  //     duration: 1,
  //     stagger: true,
  //   });
  // });
  

  
  

  useEffect(()=>{
    let intervalId;
    const loadGoogleTranslate = () => {
      const script = document.createElement('script');
      script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
      if(window.google && window.google.translate){
        clearInterval(intervalId);
        new window.google.translate.TraslateElement(
          {
            pageLanguage: 'en', layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
          },trasnlateElement.current
        )
      }
    }
  
    intervalId = setInterval(loadGoogleTranslate,100)
  },[])

  useEffect(() => {
    localStorage.setItem(
      "translateToMarathi",
      JSON.stringify(translateToMarathi)
    );
  }, [translateToMarathi]);

  return (
    <div className="fixed left-[50%] translate-x-[-50%] translate-y-[-50%] z-50 bg-black bg-opacity-80 backdrop-blur-[10px]  w-[1240px]  mx-auto p-4 rounded-[16px] flex flex-row justify-between items-center text-white text-4">
      <Link className="flex flex-row gap-4" to="/">
        <img src={mivLogo} alt="" />
        <div className="px-[12px] py-[6px] rounded-[50px] border-[2px] border-white text-nowrap">
          {translateToMarathi ? "विक्रोळीत निर्मित" : "made in vikhroli"}
        </div>
      </Link>

      <div className=" absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] flex flex-row gap-[24px] px-4 py-2 bg-[#262626] rounded-[10px]">
        <div className="navitem">
          {translateToMarathi ? "कलाकृत्या" : "Artifacts"}
        </div>
        <div className="navitem">
          {translateToMarathi ? "सदस्य" : "Members"}
        </div>
        <div className="navitem">
          {translateToMarathi ? "आमच्या बद्दल" : "About Us"}
        </div>
      </div>

      <div className="flex flex-row gap-2 cursor-pointer">
        <div onClick={handleSwitchLanguage} className="cursor-pointer">
          English
        </div>
        <div
          onClick={handleSwitchLanguage}
          className={`p-1 h-fit w-[36px] rounded-[50px] bg-[#262626] flex flex-row ${
            translateToMarathi ? "justify-end" : "justify-start "
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
