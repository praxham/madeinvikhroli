import { useEffect, useState } from "react";
import { useNavigation } from "react-router";

const NavigationProgressBar = () => {
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";

  const steps = Array.from({ length: 9 }, (_, index) => (index + 1) * 10); // [10, 20, ..., 90]
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isLoading) {
      setIsVisible(true);
      setCurrentStep(10);

      let stepIndex = 0;
      timer = setInterval(() => {
        if (stepIndex < steps.length) {
          setCurrentStep(steps[stepIndex]);
          stepIndex++;
        }
      }, 150);
    } else {
      setCurrentStep(100);
      timer = setTimeout(() => {
        setIsVisible(false);
        setCurrentStep(0);
      }, 200);
    }

    return () => {
      clearInterval(timer);
      clearTimeout(timer);
    };
  }, [isLoading]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 w-screen h-1 z-50 bg-transparent">
      <div
        className="top-0 left-0 h-1 bg-[var(--clr-primary)] transition-all duration-150 ease-out"
        style={{ width: `${currentStep}vw` }}
      />
    </div>
  );
};

export default NavigationProgressBar;
