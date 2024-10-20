import React from "react";
import pratham from "../../assets/pratham.png";
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

gsap.registerPlugin(ScrollTrigger);

const membersData = [
  {
    name: "Pratham Patankar",
    image: pratham,
    igUsername: "praxham",
  },
];

const Members = (translateToMarathi) => {
  useGSAP(() => {
    gsap.from(".members", {
      y: 100,
      opacity: 0,
      duration: 2,
      scrollTrigger: {
        trigger: ".container3",
        scroller: "body",
      },
    });
  });

  return (
    <div className="container3 w-[1240px] h-[800px] mx-auto mb-16 text-center">
      <div className="members text-[100px] font-medium text-white ml-auto text-right">
        {translateToMarathi ? "सदस्य" : "Members"}
      </div>
      {/* <Swiper
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
      > */}
        {membersData.map((membersData) => {
          return (
            // <SwiperSlide>
              <CardContainer className="w-fit flex flex-col gap-2 items-start bg-[#1A1A1A] p-4 rounded-[15px] text-white text-4 font-medium">
                <CardItem translateZ="40">
                  <img
                    translateZ="40"
                    className="w-[350px] rounded-[12px]"
                    src={membersData.image}
                    alt=""
                  />
                </CardItem>
                <CardItem translateZ="40" className="text-white">
                  {membersData.name}
                </CardItem>
                <CardItem
                  translateZ="40"
                  className="text-white cursor-pointer flex flex-row gap-2 items-center"
                  href={`instagram.com/@` + membersData.igUsername}
                >
                  @{membersData.igUsername}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-instagram"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334" />
                  </svg>
                </CardItem>
              </CardContainer>
            // </SwiperSlide> 
          );
        })}
      {/* </Swiper> */}
    </div>
  );
};

export default Members;
