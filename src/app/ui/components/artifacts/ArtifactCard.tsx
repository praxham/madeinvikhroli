import React, { useEffect, useState } from "react";
import Image from "next/image";
import CheckoutPortal from "@/app/CheckoutPortal";

type ArtifactCardProps = {
  id: string;
  image: string;
  name: string;
  description: string;
  price: string;
  created_at: string;
  from_member: {
    id: string;
    upi_id: string;
    email_id: string;
    ig_username: string;
  };
};

const ArtifactCard = ({ artifact }: { artifact: ArtifactCardProps }) => {
  const [openCheckoutPopup, setOpenCheckoutPopup] = useState(false);

  return (
    <div key={artifact?.id} className="flex flex-col md:max-w-[310]">
      <div className="aspect-square overflow-hidden relative w-full">
        <Image
          src={artifact?.image}
          fill={true}
          className="w-full object-contain aspect-square"
          alt=""
        />
      </div>
      <div className="flex flex-col gap-2 items-start p-2">
        <div className="w-full flex flex-col gap-1">
          <div className="w-full flex flex-row items-baseline justify-between text-[16px] font-medium">
            <h1 className="line-clamp-1 text-nowrap">{artifact?.name}</h1>
            <h1 className="line-clamp-1 text-nowrap">₹{artifact?.price}</h1>
          </div>
          <h2 className="text-[12px] text-[#808080] line-clamp-1 break-all">
            by{" "}
            <a
              href={`https://instagram.com/${artifact?.from_member?.ig_username}`}
            >
              @{artifact?.from_member?.ig_username}
            </a>
          </h2>
        </div>
        <button
          onClick={() => setOpenCheckoutPopup(true)}
          className="p-2 w-full h-fit rounded-[8px] py-2 border-[1px] border-black hover:bg-black hover:text-white cursor-pointer active:scale-99 font-medium text-[14px]"
        >
          <h1 className="">Buy Now</h1>
        </button>
      </div>
      {openCheckoutPopup && (
        <CheckoutPortal
          setOpenCheckoutPopup={setOpenCheckoutPopup}
          artifact={artifact}
        />
      )}
    </div>
  );
};

export default ArtifactCard;
