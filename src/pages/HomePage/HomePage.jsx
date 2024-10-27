import React,{useState,useEffect, useContext, useRef} from 'react'
import HeroSection from './HeroSection'
import Artifacts from './Artifacts'
import Members from './Members';
import AboutUs from './AboutUs';
import NavigationContext from '../../context/NavigationContext';
import Loading from '../../Components/Loading';

const HomePage = () => {
  const [clickedSection, setClickedSection] = useState(null);

  const {artifactsClicked, membersClicked, aboutUsClicked,translateToMarathi,  setSectionClicked} = useContext(NavigationContext)

  const artifactsRef = useRef(null);
  const membersRef = useRef(null);
  const aboutUsRef = useRef(null);

  const [isScrolledPast, setIsScrolledPast] = useState({
    artifacts: false,
    members: false,
    aboutUs: false,
  });

  // Check if sections are in view
  const checkScrollPosition = () => {
    const artifactsInView = artifactsRef.current && artifactsRef.current.getBoundingClientRect().top < window.innerHeight && artifactsRef.current.getBoundingClientRect().bottom > 0;
    const membersInView = membersRef.current && membersRef.current.getBoundingClientRect().top < window.innerHeight && membersRef.current.getBoundingClientRect().bottom > 0;
    const aboutUsInView = aboutUsRef.current && aboutUsRef.current.getBoundingClientRect().top < window.innerHeight && aboutUsRef.current.getBoundingClientRect().bottom > 0;

    // Update clicked states based on visibility only if not explicitly clicked
    setSectionClicked((prev) => ({
      artifactsClicked: clickedSection === 'artifacts' || (artifactsInView && prev.artifactsClicked),
      membersClicked: clickedSection === 'members' || (membersInView && prev.membersClicked),
      aboutUsClicked: clickedSection === 'aboutUs' || (aboutUsInView && prev.aboutUsClicked),
    }));
  };

  useEffect(() => {
    // Add event listener for scroll
    window.addEventListener('scroll', checkScrollPosition);
    
    // Initial check on mount
    checkScrollPosition();

    // Cleanup on unmount
    return () => {
      window.removeEventListener('scroll', checkScrollPosition);
    };
  }, [clickedSection]);

  useEffect(() => {
    const scrollToElement = (ref, scrollPadding) => {
      if (ref.current) {
        const elementPosition = ref.current.getBoundingClientRect().top + window.scrollY; // Get the element's position
        window.scrollTo({
          top: elementPosition - scrollPadding, // Adjust for scroll padding
          behavior: 'smooth',
        });
      }
    };

    if (artifactsClicked) {
      scrollToElement(artifactsRef, 150);
    } else if (membersClicked) {
      scrollToElement(membersRef, 80);
    } else if (aboutUsClicked) {
      scrollToElement(aboutUsRef, 80);
    }
  }, [artifactsClicked,membersClicked,aboutUsClicked]);


  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  return (
    <div className='snap-y'>
      <HeroSection translateToMarathi={translateToMarathi}   />
      <div ref={artifactsRef}>
        <Artifacts translateToMarathi={translateToMarathi} />
        {/* <Loading/> */}
      </div>
      <div ref={membersRef}>
        <Members translateToMarathi={translateToMarathi} />
      </div>
      <div ref={aboutUsRef}>
        <AboutUs translateToMarathi={translateToMarathi} />
      </div>
    </div>
  )
}

export default HomePage
