import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'
import { useNavigate } from 'react-router-dom'

const Contact = () => {
  const navigate = useNavigate()
  return (
    <div>
      {/* PAGE TITLE */}
      <div className="text-center text-2xl pt-10 border-t">
        <Title text1={'CONTACT'} text2={'US'} />
      </div>

      {/* CONTACT SECTION */}
      <div className="my-10 flex flex-col md:flex-row items-center justify-center gap-10 mb-28">

        {/* IMAGE */}
        <img
          className="w-full md:max-w-[480px] rounded-lg shadow-sm"
          src={assets.contact_img}
          alt="Contact"
        />

        {/* INFO BOX */}
        <div className="flex flex-col items-start gap-5 max-w-md text-gray-700">

          <p className="font-semibold text-xl text-gray-700">Our Store</p>

          <p className="leading-6">
            123 Harmony Tower, 5th Floor, <br />
            Tech Park Road, Andheri East, Mumbai – 400059
          </p>

          <p className="text-gray-500">
            Telephone: +91 98765 43210 <br />
            Email: vrihaacreation@gmail.com
          </p>

          <p className="font-semibold text-xl">Sell on Vrihaa Bazaar</p>

          <p className="text-gray-600">
            Grow your business by reaching thousands of customers. Register your shop and start selling today.
          </p>

          {/* BUTTON */}
          <button onClick={() => navigate('/become-seller')} className="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition">
            Become a Seller
          </button>

        </div>
      </div>

      <NewsletterBox />
    </div>
  )
}

export default Contact
