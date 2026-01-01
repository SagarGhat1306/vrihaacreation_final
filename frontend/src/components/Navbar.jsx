import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { NavLink } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
const Navbar = () => {

        const [visible , setvisible] = useState(false)

        const {setShowSearch , GetcartCount , navigate, setToken ,setCartItems , token} = useContext(ShopContext)

        const userLogout = () => {
            localStorage.removeItem('token')
            setToken('')
            setCartItems({})
            navigate('/login')
        }
  return (
    <div className='flex items-center justify-between py-5 font-medium'>
        <img src = {assets.logo}  alt = "" className='w-36'/>
        <ul className='hidden sm:flex gap-5 text-sm text-gray-700'>
            <NavLink to = '/' className = 'flex flex-col items-center gap-1'>
                    <p>HOME</p>
                    <hr className='w-2/3 border-none h-[1.5px] bg-gray-700 hidden'></hr>
            </NavLink>
              <NavLink to = '/collection' className = 'flex flex-col items-center gap-1'>
                    <p>COLLECTIONS</p>
                    <hr className='w-2/3 border-none h-[1.5px] bg-gray-700 hidden'></hr>
            </NavLink>
              <NavLink to = '/about' className = 'flex flex-col items-center gap-1 '>
                    <p>ABOUT</p>
                    <hr className='w-2/3 border-none h-[1.5px] bg-gray-700' hidden></hr>
            </NavLink>
              <NavLink to = '/contact' className = 'flex flex-col items-center gap-1'>
                    <p>CONTACT</p>
                    <hr className='w-2/3 border-none h-[1.5px] bg-gray-700 hidden'></hr>
            </NavLink>
        </ul>

        <div className='flex items-center gap-6'>
        
            <img onClick={()=> setShowSearch(true)} src ={assets.search_icon} className='w-5 cursor-pointer'/>

            <div className='group relative'>
                <img  onClick ={()=> token ? null : navigate('/login')} src = {assets.profile_icon} className='w-5 cursor-pointer'/>
                {token && 
                    <div className='group-hover:block hidden absolute dropdown-menu right-0 pt-4'>
                        <div className='flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded-1xl'>
                            <p className = "cursor-pointer hover:text-black ">My Profile </p>
                            <p onClick ={()=> navigate('/orders')} className = "cursor-pointer hover:text-black ">Orders</p>
                            <p  onClick ={userLogout} className='cursor-pointer hover:text-black '>Logout</p>
                        </div>
                    </div>
                }
              
            </div>

          <Link to="/cart" className="relative">
                <img 
                    src={assets.cart_icon} 
                    className="w-5 min-w-5" 
                    alt="" 
                />

                <p className="absolute right-[-5px] bottom-[-5px] w-4 aspect-square text-center leading-4 bg-black text-white rounded-full text-[8px]">
                    {GetcartCount()}
                </p>

            </Link>

            <img onClick ={()=> {setvisible(true)}}  src={assets.menu_icon} className='w-5 cursor-pointer sm:hidden' alt=""/>
        </div>

        {/* {side bar menu} */}

        <div className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${visible ? 'w-full' : 'w-0'}`}>
            <div className='flex flex-col text-gray-600'>
                <div className='flex items-center gap-4 p-3 cursor-pointer' onClick={()=> setvisible(false)}>
                    <img src={assets.dropdown_icon} alt=" " className='h-4 rotate-180'/>
                    <p>back</p>
                </div>   
                <NavLink onClick={()=> setvisible(false)} className="py-2 pl-6  border" to="/">HOME</NavLink>    
                <NavLink onClick={()=> setvisible(false)} className="py-2 pl-6  border" to="/collection">COLLECTION</NavLink>   
                <NavLink onClick={()=> setvisible(false)} className="py-2 pl-6  border" to="/contact">CONTACT</NavLink>   
                <NavLink onClick={()=> setvisible(false)} className="py-2 pl-6  border" to="/about">ABOUT</NavLink>   
            </div>
        </div>
    </div>
  )
}

export default Navbar
