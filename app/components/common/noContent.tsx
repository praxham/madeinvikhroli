import SleepyMascot from "../../assets/mascot/sleepy.svg?react";

const NoContent = ({ title = "Items" }: { title: string }) => {
  return (
    <div className="h-full flex flex-col gap-4 items-center justify-center">
      <SleepyMascot className="[&_[stroke='black']]:!stroke-[var(--clr-grey-two)]" />
      <h1 className="heading1 text-[var(--clr-grey-two)]">No {title} Found</h1>
    </div>
  );
};

export default NoContent;
