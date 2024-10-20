import React,{useState} from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  const [translateToMarathi, setTranslateToMarathi] = useState(
    () => JSON.parse(localStorage.getItem("translateToMarathi")) || false
  );
  
  return (
    <div className='w-full text-white'>
        <div className='w-[1240px] mx-auto flex flex-col text-[84px] font-medium'>
            {/* <Link to="legal">Legal</Link> */}
            <Link to="purchase-policy">{translateToMarathi ? "खरेदी धोरण" : "Purchase Policy"}</Link>
            {/* <div>Energy Consumption & Carbon Footprint</div> */}
        </div>
    </div>
  )
}

export default Footer
