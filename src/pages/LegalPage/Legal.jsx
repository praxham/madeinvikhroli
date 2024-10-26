import React, { useState, useEffect } from "react";
import { InstagramEmbed } from "react-social-media-embed";
const Legal = () => {
  const [translateToMarathi, setTranslateToMarathi] = useState(() =>
    JSON.parse(localStorage.getItem("translateToMarathi"))
  );

  useEffect(() => {
    const handleLanguageChange = () => {
      setTranslateToMarathi(
        JSON.parse(localStorage.getItem("translateToMarathi"))
      );
    };

    window.addEventListener("language", handleLanguageChange);

    return () => {
      window.removeEventListener("language", handleLanguageChange);
    };
  }, []);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);
  
  return (
    <div className="w-[1240px] mx-auto mt-16 flex flex-col items-center justify-center text-white">
      <div className="text-[84px] font-medium my-64">Legal</div>
      <div className="w-full flex flex-col gap-4">
        <p>
          "Made in Vikhroli" is an alias used by Pratham Patankar as a Cretive
          Outlet.
        </p>
        <p>
          The logo associated with this alias was created by Pratham Patankar.
          The creation process of this logo was documented and published on
          Instagram on 24 March 2024, in Vikhroli, Mumbai.
        </p>
        <p>
          These Instagram posts establish a public record of the logo's origin
          and its connection to the alias "Made in Vikhroli".
        </p>
        <div className="flex flex-row gap-4">
          <div className="w-1/2 pr-2 ">
            <InstagramEmbed
              url="https://www.instagram.com/p/C443N4RyJMe/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=="
              captioned
            />
          </div>
          <div className="w-1/2 pl-2 aspect-square">
            <InstagramEmbed
              url="https://www.instagram.com/p/C441JxNS-mE/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=="
              captioned
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Legal;
