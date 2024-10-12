import React,{useState,useEffect} from 'react'
import HeroSection from './HeroSection'
import ProductsList from './ProductsList'
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

  const frequentWords = {
    buyNow: 'विकत घ्या',
    donate: 'डोनेट करा',

  }

  const simpleTranslator = () => {
    
  }

  return (
    <div className='snap-y'>
      <HeroSection translateToMarathi={translateToMarathi} frequentWords={frequentWords}  />
      <ProductsList translateToMarathi={translateToMarathi} />
      <Members translateToMarathi={translateToMarathi} />
      <AboutUs />
    </div>
  )
}

export default HomePage
