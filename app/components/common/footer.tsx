import { ReactFitty } from "react-fitty";
import { Link } from "react-router";

const Footer = () => {
  return (
    <div className="bg-black text-white py-16">
      <div className="max-w-[var(--website-horizontal-size)] mx-auto">
        {/* <img
          src="/assets/common/vikhrolit-nirmit-text.svg"
          alt="made in vikhroli footer signage"
        /> */}
        <div className="grid grid-cols-2 w-full gap-4 text-[24px] font-semibold items-start">
          <div className="grid grid-cols-1 gap-[19px]">
            <Link to="/artifacts">Artifacts</Link>
            <Link to="/members">Members</Link>
            <Link to="/artifacts">Sign In</Link>
          </div>
          <div className="grid grid-cols-1 gap-[19px]">
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/purchase-policy">Purchase Policy</Link>
          </div>
        </div>
        <ReactFitty
          maxSize={500}
          data-text="विक्रोळीत निर्मित"
          className="
    display-font font-bold leading-none text-center mt-[64px]
    
    relative z-10 text-[var(--clr-primary)]
    
    before:content-[attr(data-text)]
    before:absolute before:left-0 before:top-0 before:z-[-1]
    before:[-webkit-text-stroke:16px_var(--clr-secondary)] 
  "
        >
          विक्रोळीत निर्मित
        </ReactFitty>
      </div>
    </div>
  );
};

export default Footer;
