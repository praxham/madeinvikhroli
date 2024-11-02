import React from "react";
import QRCode from "react-qr-code";
import mivlogowoutline from "../assets/mivlogowoutline.svg"

const DonationQRPopUp = ({ setDonationQRPopUp }) => {
  return (
    <div
      onClick={() => setDonationQRPopUp(false)}
      className="lg:block hidden fixed w-screen h-screen top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] pointer-events-none"
    >
      <div className="fixed z-50 top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-[8px] p-4 bg-white flex flex-col gap-2 items-center justify-center">
        <QRCode
          className=""
          value="upi://pay?pa=prathampatankar1234@oksbi&pn=prathampatankar&tn=Donation&cu=INR"
          size={256}
          level={"H"}
        />
        <img
          className="absolute top-[45%] left-[50%] translate-x-[-50%] translate-y-[-50%] h-[74px] filter-[drop-shadow(0 0 16px white)] lg:block hidden"
          src={mivlogowoutline}
        />
        <div className="text-[18px] font-semibold text-black w-fit">
          Donate any Amount via UPI
        </div>
      </div>
      <div className="w-screen h-screen bg-black opacity-50 z-60"></div>
    </div>
  );
};

export default DonationQRPopUp;
