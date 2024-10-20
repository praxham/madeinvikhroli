import React,{useState,useEffect} from 'react'
import HeroSection from './HeroSection'
import Artifacts from './Artifacts'
import Members from './Members';
import AboutUs from './AboutUs';

const HomePage = () => {
  const [translateToMarathi, setTranslateToMarathi] = useState(
    () => JSON.parse(localStorage.getItem('translateToMarathi'))
  );

  useEffect(() => {
    const handleLanguageChange = () => {
      setTranslateToMarathi(JSON.parse(localStorage.getItem('translateToMarathi')))
    };

    window.addEventListener('language', handleLanguageChange);

    return () => {
      window.removeEventListener('language', handleLanguageChange);
    };
  }, []);

  // const frequentWords = {
  //   buyNow: 'विकत घ्या',
  //   donate: 'डोनेट करा',

  // }

  // const simpleTranslator = () => {
    
  // }
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  return (
    <div className='snap-y'>
      <HeroSection translateToMarathi={translateToMarathi}   />
      <Artifacts translateToMarathi={translateToMarathi} />
      <Members translateToMarathi={translateToMarathi} />
      <AboutUs translateToMarathi={translateToMarathi} />
    </div>
  )
}

export default HomePage
