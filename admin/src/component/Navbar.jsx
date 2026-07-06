import React from 'react'
import { assets } from '../assets/assets'

const Navbar = ({ setToken }) => {
  return (
    <div className='flex items-center py-2 px-[4%] justify-between'>
      <div className='flex items-center gap-3'>
        <img className='w-[max(10%,80px)]' src={assets.logo} alt="" />
        <p className='text-sm text-gray-500 hidden sm:block'>Vrihaa Bazaar — Admin Panel</p>
      </div>
      <button
        onClick={() => { setToken(''); localStorage.removeItem('token') }}
        className='bg-gray-600 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full sm:text-sm'
      >
        Logout
      </button>
    </div>
  )
}

export default Navbar
