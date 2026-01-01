import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 my-10 mt-40 text-sm">

        {/* Logo + Text */}
        <div>
          <img src={assets.logo} className="mb-5 w-32" alt="" />

          <p className="w-full md:w-2/3 text-gray-600">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Atque sapiente, et dignissimos consequuntur inventore provident.
          </p>
        </div>

        {/* Company */}
        <div>
          <p className="text-xl font-medium mb-5">COMPANY</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li>Home</li>
            <li>About us</li>
            <li>Delivery</li>
            <li>Privacy</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li>+1-212-235644</li>
            <li>vrihaacreation@gamil.com</li>
          </ul>
        </div>

      </div>

      <div>
        <hr />
        <p className="py-5 text-sm text-center">
          Copyright 2025 © Vrihaacreation.com - ALL Rights Reserved
        </p>
      </div>

    </div>
  )
}

export default Footer
