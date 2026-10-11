import StyledButton from "~/components/common/styledButton";
import SleepyMascot from "../assets/mascot/sleepy.svg?react";
import { useNavigate } from "react-router";
const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-row items-center justify-center h-[100vh] p-6 gap-[200px]">
      <SleepyMascot />
      <div className="text-start max-w-md space-y-4">
        <h2 className="text-3xl font-semibold tracking-tight text-red-700">
          404 Page Not Found
        </h2>
        <p className="text-gray-600 mb-16">
          he's sleepy or maybe meditating coz there's nothing here
        </p>
        <StyledButton
          title="Return Home"
          action={() => navigate("/")}
          heirarchy="primary"
          length="full-width"
        />
      </div>
    </div>
  );
};

export default NotFound;
