import React from 'react'

const NewsletterBox = () => {

  const onSubmitHandler = (e) => {
    e.preventDefault();
  }

  return (
    <div className='text-center '>
      <p className='text-2xl font-medium text-gray-500'>subscribe now & get 20% off</p>
      <p className='text-gray-400 mt-3'>
        Be the first to know about new collections, exclusive deals and seller offers across all categories on Vrihaa Bazaar.
      </p>

      <form onSubmit={onSubmitHandler} className='w-full sm:w-1/2 flex items-center gap-3  mx-auto my-6 border pl-3 '>
        <input className='w-full sm:flex-1 outline-none' type='email' placeholder='Enter Your email' required></input>
        <button type='submit' className='bg-black text-white  text-xs p-5'>SUBSCRIBE</button>
      </form>
    </div>
  )
}

export default NewsletterBox
