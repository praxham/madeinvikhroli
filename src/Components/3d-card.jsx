"use client";
import { cn } from "../utils/cn.js";
import React, {
  createContext,
  useState,
  useContext,
  useRef,
  useEffect,
} from "react";

const MouseEnterContext = createContext(undefined);

export const CardContainer = ({
  children,
  className,
  containerClassName
}) => {
  const containerRef = useRef(null);
  const [isMouseEntered, setIsMouseEntered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isClicked, setIsClicked] = useState(false); // New state for click

  // Check if the device is mobile or tablet
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Adjust threshold as needed
    };

    handleResize(); // Check on mount
    window.addEventListener('resize', handleResize); // Check on resize

    return () => {
      window.removeEventListener('resize', handleResize); // Cleanup
    };
  }, []);

  const handleMouseMove = (e) => {
    if (!containerRef.current || isMobile || isClicked) return; // Prevent movement on mobile or if clicked
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / 50;
    const y = (e.clientY - top - height / 2) / 50;
    containerRef.current.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
  };

  const handleMouseEnter = () => {
    if (isMobile || isClicked) return; // Prevent mouse enter effect on mobile or if clicked
    setIsMouseEntered(true);
  };

  const handleMouseLeave = () => {
    if (!containerRef.current || isMobile || isClicked) return; // Prevent mouse leave effect on mobile or if clicked
    setIsMouseEntered(false);
    containerRef.current.style.transform = `rotateY(0deg) rotateX(0deg)`;
  };

  const handleClick = () => {
    setIsClicked((prev) => !prev); // Toggle clicked state
    if (containerRef.current) {
      containerRef.current.style.transform = `rotateY(0deg) rotateX(0deg)`; // Reset transform on click
    }
  };

  return (
    <MouseEnterContext.Provider value={[isMouseEntered, setIsMouseEntered]}>
      <div
        className={cn("py-4 flex items-center justify-center", containerClassName)}
        style={{
          perspective: "1000px",
        }}>
        <div
          ref={containerRef}
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick} // Add click handler
          className={cn(
            "flex items-center justify-center relative transition-all duration-200 ease-linear",
            className
          )}
          style={{
            transformStyle: "preserve-3d",
          }}>
          {children}
        </div>
      </div>
    </MouseEnterContext.Provider>
  );
};

export const CardBody = ({
  children,
  className
}) => {
  return (
    <div
      className={cn(
        "h-96 w-96 [transform-style:preserve-3d] [&>*]:[transform-style:preserve-3d]",
        className
      )}>
      {children}
    </div>
  );
};

export const CardItem = ({
  as: Tag = "div",
  children,
  className,
  translateX = 0.5,
  translateY = 0.5,
  translateZ = 0.5,
  rotateX = 0.5,
  rotateY = 0.5,
  rotateZ = 0.5,
  ...rest
}) => {
  
const ref = useRef(null);
const [isMouseEntered] = useMouseEnter();

useEffect(() => {
handleAnimations();
}, [isMouseEntered]);

const handleAnimations = () => {
if (!ref.current) return;
if (isMouseEntered) {
ref.current.style.transform = `translateX(${translateX}px) translateY(${translateY}px) translateZ(${translateZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`;
} else {
ref.current.style.transform = `translateX(0px) translateY(0px) translateZ(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)`;
}
};

return (
<Tag
ref={ref}
className={cn("w-fit transition duration-200 ease-linear", className)}
{...rest}>
{children}
</Tag>
);
};

// Create a hook to use the context
export const useMouseEnter = () => {
const context = useContext(MouseEnterContext);
if (context === undefined) {
throw new Error("useMouseEnter must be used within a MouseEnterProvider");
}
return context;
};