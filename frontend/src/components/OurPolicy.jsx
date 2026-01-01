import React from 'react'
import { assets } from '../assets/assets'

const OurPolicy = () => {

  return (
    <div className='flex flex-col sm:flex-row justify-around gap-12 sm:gap-2 text-center py-20 textxs sm:text-sm md:text-base text-gray-700'>
        <div>
            <img src={assets.exchange_icon}  className = "w-13 m-auto mb-5"alt=""/>
            <p className='font-semibold'>Easy Exchange</p>
            <p className='text-gray-400'>We Offer hassle free Exchange policy</p>
        </div>
         <div>
            <img src={assets.quality_icon}  className = "w-13 m-auto mb-5"alt=""/>
            <p className='font-semibold'>7 Days Return Policy</p>
            <p className='text-gray-400'>We provide 7 Days free return policy </p>
        </div>
          <div>
            <img src={assets.support_img} className = "w-13 m-auto mb-5"alt=""/>
            <p className='font-semibold'>Best Customer Support </p>
            <p className='text-gray-400'>We provide 24/7 Customer support</p>
        </div>
    </div>
     
  )
}

export default OurPolicy
