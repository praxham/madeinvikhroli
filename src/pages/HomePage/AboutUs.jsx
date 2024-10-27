import React from "react";
import { useInView } from "react-intersection-observer";
import QRCode from "react-qr-code";
import CountUp from 'react-countup';
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const AboutUs = ({translateToMarathi}) => {
  const { ref, inView } = useInView({
    threshold: 0.1, // Trigger when 50% of the component is visible
    triggerOnce: true // Only trigger once
  });

  useGSAP(()=>{
    gsap.from(".aboutus",{
      y: 100,
      opacity: 0,
      duration:2,
      scrollTrigger:{
        trigger:".container4",
        scroller: "body",
      }
    })
  }) 

  return (
    <div ref={ref} className="container4 w-fit mx-4 lg:w-[1240px] h-fit lg:h-[800px] lg:mx-auto mb-[100px] text-center text-white">
      <div className="aboutus w-full h-fit -mb-[18px] text-[64px] lg:text-[100px] font-medium ml-auto text-left font-dirtyline">
        {translateToMarathi ? "आमच्या बद्दल" : "About Us"}
      </div>
      <div className="w-full flex flex-col gap-4 z-20">
        <div className="h-1/2 w-full flex flex-col lg:flex-row gap-4">
          <div className="lg:w-1/3 w-full h-full flex flex-col items-center gap-4 bg-[#1A1A1A] p-4 rounded-[15px] hover:border-white hover:border-[1px]">
            <div className="w-full lg:w-[150px] h-[150px] rounded-[100px] flex flex-row items-center justify-center">
              <div className="font-semibold text-[64px] lg:text-[84px]">
                ~{inView && <CountUp end={17.9} duration={2} />}
              </div>
              <div className="mt-[48px]">kg</div>
            </div>
            <div>Carbon Footprint</div>
          </div>
          <div className="lg:w-1/3 w-full h-full flex flex-col items-center gap-4 bg-[#1A1A1A] p-4 rounded-[15px] hover:border-white hover:border-[1px]">
            <div className="w-full lg:w-[150px] h-[150px] rounded-[100px] flex flex-row items-center justify-center">
              <div className="font-semibold text-[84px]">
                ~{inView && <CountUp end={21.84} duration={2} />}
              </div>
              <div className="mt-[48px]">kWh</div>
            </div>
            <div>Energy Used (Locally)</div>
          </div>
          <div className="lg:w-1/3 w-full h-full flex flex-col items-center gap-4 bg-[#1A1A1A] p-4 rounded-[15px] hover:border-white hover:border-[1px]">
            <div className="w-full lg:w-[150px] h-[150px] rounded-[100px] flex flex-row items-center justify-center">
              <div className="font-semibold text-[84px]">
                ~{inView && <CountUp end={30} duration={5} />}
              </div>
              <div className="mt-[48px]">%</div>
            </div>
            <div>Renewable Energy Used</div>
          </div>
        </div>
        <div className="h-1/2 w-full flex flex-col lg:flex-row gap-4">
          <div className="lg:w-1/3 w-full h-full flex flex-col items-center gap-4 bg-[#1A1A1A] p-4 rounded-[15px] hover:border-white hover:border-[1px]">
            <div className="w-full lg:w-[150px] h-[150px] rounded-[100px] flex flex-row items-center justify-center">
              <div className="font-semibold text-[84px]">0</div>
              <div className="mt-[48px]"></div>
            </div>
            <div>Mangroves Planted (for CO2 Offset)</div>
          </div>
          <div className="lg:w-1/3 w-full h-full flex flex-col items-center gap-4 bg-[#1A1A1A] p-4 rounded-[15px] hover:border-white hover:border-[1px]">
            <div className="w-full lg:w-[150px] h-[150px] rounded-[100px] flex flex-row items-center justify-center">
              <div className="font-semibold text-[84px]">
                ~{inView && <CountUp end={2652.88} duration={5} />}
              </div>
              <div className="mt-[48px]">₹</div>
            </div>
            <div>Money Spent</div>
          </div>
          <div className="lg:w-1/3 w-full h-full flex flex-col items-center gap-4 bg-[#1A1A1A] p-4 rounded-[15px] hover:border-white hover:border-[1px]">
            <QRCode
              className='w-full lg:w-[150px] h-[150px] rounded-[8px] p-4 bg-white'
              value='upi://pay?pa=prathampatankar1234@oksbi&pn=prathampatankar&tn=Donation&cu=INR'
              size={256}
              level={"H"}
            />
            <div>Donate ❤️</div>
          </div>
        </div>
      </div>
      <div className="mt-4 flex flex-col items-start text-left gap-4">
        <p>We're a cool group dedicated to presenting innovative artistic and tech projects. Our mission is to inspire and create while being mindful of our environmental impact.</p>
        <p>Your donations will first be used to recover costs and maintain our operations. Any excess funds will be allocated to planting mangroves for CO2 offset.</p>
        <p>Our goal is to achieve net-zero emissions each year. If donations fall short, we'll use our own funds to plant mangroves. However, your contributions can make a significant difference in reaching this goal!</p>
      </div>
    </div>
  );
};

export default AboutUs;