import React from 'react'
import Title from '../components/Title';
import { assets } from '../assets/assets';
import NewsletterBox from '../components/NewsletterBox';
const About = () => {
  return (
    <div>
      <div className='text-2xl text-center pt-8 border-t'>
        <Title text1={'ABOUT'} text2={"US"}/>
      </div>
      <div className='my-10 flex flex-col md:flex-row gap-16 '>
        <img className='w-full md:max-w-[450px]' src = {assets.about_img} alt=""/>
        <div className='flex flex-col justify-center gap-6 md:2/4 text-gray-600'>
        <p>We are a modern fashion brand dedicated to bringing high-quality, trendy, and affordable clothing to everyone. Our collection is designed with comfort, style, and individuality in mind. We aim to make online shopping easier, faster, and more enjoyable for all fashion lovers.</p>
        <p>At our store, fashion is more than just clothing — 
          it’s a way to express who you are. We created this platform to bring together premium-quality outfits, modern designs, and effortless shopping in one place. Every product in our collection is handpicked for its comfort, durability, and trend-forward style. We’re committed to making fashion accessible for everyone by offering great designs at fair prices. With a growing community of happy customers, we continue to innovate, inspire, and deliver a shopping experience that feels personal, enjoyable, and always on trend.</p>
          <b className='text-gray-800'>Our Mission</b>
          <p>Our mission is to make modern fashion truly accessible by offering stylish, high-quality clothing that inspires confidence in every customer. We aim to combine affordability with premium design, creating a seamless shopping experience built on trust, transparency, and customer satisfaction. Through innovation, ethical sourcing, and continuous improvement, we strive to deliver fashion that fits every lifestyle and empowers individuals to express their identity with comfort and style.</p>
        </div>
      </div> 

      <div className='text-2xl py-4'>
        <Title text1={'WHY'} text2={'CHOOSE US'}/>
      </div>

      <div className='flex flex-col md:flex-row text-sm mb-20'>
        <div className='border px-10 md:16px sm:py-20 flex flex-col gap-5'>
          <b>Quality Assurance :</b>
          <p className='text-gray-600 text-justify'>At the heart of our brand is a commitment to exceptional quality. Every product undergoes careful selection, thorough inspection, and multiple quality checks before it reaches you. From fabric durability and stitching precision to comfort and fit, we ensure that each item meets stringent standards. Our team works closely with trusted manufacturers and continuously monitors production processes to guarantee consistency, reliability, and long-lasting wear. We believe in delivering clothing that not only looks great but also feels premium—because our customers deserve nothing less.</p>
        </div>
        <div className='border px-10 md:16px sm:py-20 flex flex-col gap-5'>
          <b>Convenience :</b>
          <p className='text-gray-600 text-justify'>We are dedicated to making your shopping experience as smooth and effortless as possible. Our platform is designed for easy navigation, quick search results, and fast checkout—so you can find what you love without wasting time. With secure payment options, real-time order tracking, and responsive customer support, we ensure a hassle-free journey from browsing to delivery. Whether you're shopping on mobile or desktop, our goal is to provide comfort, speed, and convenience at every step.</p>
        </div>

        <div className='border px-10 md:16px sm:py-20 flex flex-col gap-5'>
          <b>Exceptional Customer service :</b>
          <p className='text-gray-600 text-justify'>We are dedicated to making your shopping experience as smooth and effortless as possible. Our platform is designed for easy navigation, quick search results, and fast checkout—so you can find what you love without wasting time. With secure payment options, real-time order tracking, and responsive customer support, we ensure a hassle-free journey from browsing to delivery. Whether you're shopping on mobile or desktop, our goal is to provide comfort, speed, and convenience at every step.</p>
        </div>
      </div>
      <NewsletterBox />
    </div>
  )
}

export default About
