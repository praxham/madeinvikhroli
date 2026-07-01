import StyledButton from "../common/styledButton";

const Hero = () => {
  return (
    <div className="h-screen -mt-[76px] flex flex-col gap-4 items-center justify-center">
      <div className="flex flex-col gap-2 items-center">
        <h1 className="text-center text-[64px] font-semibold leading-[80px]">
          We’re a collective making
          <br />
          <span className="secondary_clr_text">art, websites</span> &{" "}
          <span className="secondary_clr_text">everything tech</span>
        </h1>
        <h2 className="text-center text-[24px] font-medium text-[var(--clr-grey-one)]">
          homegrown, people made, authentic,
          <br /> affordable and sometimes free
        </h2>
      </div>
      <div className="flex flex-row gap-4">
        <StyledButton title="Donate" action={() => {}} type="primary" />
        <StyledButton
          title="View Artifacts"
          action={() => {}}
          type="secondary"
        />
      </div>
    </div>
  );
};

export default Hero;
