import React,{useState} from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  const [translateToMarathi, setTranslateToMarathi] = useState(
    () => JSON.parse(localStorage.getItem("translateToMarathi")) || false
  );
  
  return (
    <div className='w-full text-white mx-4'>
        <div className='w-full lg:w-[1240px] mx-auto flex flex-col text-[64px] lg:text-[84px] font-medium font-dirtyline'>
            {/* <Link to="legal">Legal</Link> */}
            <Link to="purchase-policy">{translateToMarathi ? "खरेदी धोरण" : "Purchase Policy"}</Link>
            {/* <div>Energy Consumption & Carbon Footprint</div> */}
        </div>
    </div>
  )
}

export default Footer
