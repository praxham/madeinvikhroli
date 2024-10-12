import React from "react";
import pratham from "../assets/pratham.png";
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

gsap.registerPlugin(ScrollTrigger);

const membersData = [
  {
    name: "Pratham Patankar",
    image: pratham,
    igUsername: "praxham",
  },
  {
    name: "Pratham Patankar",
    image: pratham,
    igUsername: "praxham",
  },
];



const Members = () => {

  useGSAP(()=>{
    gsap.from(".members",{
      y: 100,
      opacity: 0,
      duration:2,
      scrollTrigger:{
        trigger:".container3",
        scroller: "body",
        markers:true,
      }
    })
  })

  return (
    <div className="container3 w-[1240px] h-[800px] mx-auto mb-16 text-center">
      <div className="members text-[100px] font-medium text-white ml-auto text-right">
        Members
      </div>
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
        className="mySwiper w-full flex flex-row items-center justify-center overflow-visible"
      >
        {membersData.map((membersData) => {
          return (
            <SwiperSlide>
              <CardContainer className="w-fit flex flex-col gap-2 items-start bg-[#1A1A1A] p-4 rounded-[15px] text-white text-4 font-medium">
                <CardItem translateZ="40">
                  <img
                    translateZ="40"
                    className="w-[400px] rounded-[12px] grayscale"
                    src={membersData.image}
                    alt=""
                  />
                </CardItem>
                <CardItem translateZ="40" className="text-white">
                  {membersData.name}
                </CardItem>
                <CardItem
                  translateZ="40"
                  className="text-white"
                  href={`instagram.com/@` + membersData.igUsername}
                >
                  @{membersData.igUsername}
                </CardItem>
              </CardContainer>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default Members;
