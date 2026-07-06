import React from 'react'
import Title from '../components/Title';
import { assets } from '../assets/assets';
import NewsletterBox from '../components/NewsletterBox';
const About = () => {
  return (
    <div>
      <div className='text-2xl text-center pt-8 border-t'>
        <Title text1={'ABOUT'} text2={"US"} />
      </div>
      <div className='my-10 flex flex-col md:flex-row gap-16 '>
        <img className='w-full md:max-w-[450px]' src={assets.about_img} alt="" />
        <div className='flex flex-col justify-center gap-6 md:2/4 text-gray-600'>
          <p>Vrihaa Bazaar is a modern online marketplace dedicated to bringing high-quality, trendy, and affordable products to everyone — from fashion and beauty to home, electronics and more. Our collection is designed with comfort, style, and individuality in mind. We aim to make online shopping easier, faster, and more enjoyable for all.</p>
          <p>At Vrihaa Bazaar, shopping is more than just buying —
            it's a way to express who you are. We created this platform to bring together premium-quality products, trusted third-party sellers, and effortless shopping in one place. Every product in our marketplace is quality checked for comfort, durability, and trend-forward style. We're committed to making great products accessible for everyone by offering fair prices. With a growing community of happy customers and sellers, we continue to innovate, inspire, and deliver a shopping experience that feels personal, enjoyable, and always on trend.</p>
          <b className='text-gray-800'>Our Mission</b>
          <p>Our mission is to make quality products truly accessible by connecting customers directly with trusted sellers across every category. We aim to combine affordability with premium design, creating a seamless shopping experience built on trust, transparency, and customer satisfaction. Through innovation, ethical sourcing, and continuous improvement, we strive to deliver products that fit every lifestyle and empower individuals to express their identity with comfort and style.</p>
        </div>
      </div>

      <div className='text-2xl py-4'>
        <Title text1={'WHY'} text2={'CHOOSE US'} />
      </div>

      <div className='flex flex-col md:flex-row text-sm mb-20'>
        <div className='border px-10 md:16px sm:py-20 flex flex-col gap-5'>
          <b>Quality Assurance :</b>
          <p className='text-gray-600 text-justify'>At the heart of our brand is a commitment to exceptional quality. Every product undergoes careful selection, thorough inspection, and multiple quality checks before it reaches you. From fabric durability and stitching precision to comfort and fit, we ensure that each item meets stringent standards. Our team works closely with trusted sellers and continuously monitors listings to guarantee consistency, reliability, and long-lasting quality. We believe in delivering products that not only look great but also feel premium—because our customers deserve nothing less.</p>
        </div>
        <div className='border px-10 md:16px sm:py-20 flex flex-col gap-5'>
          <b>Convenience :</b>
          <p className='text-gray-600 text-justify'>We are dedicated to making your shopping experience as smooth and effortless as possible. Our platform is designed for easy navigation, quick search results, and fast checkout—so you can find what you love without wasting time. With secure payment options, real-time order tracking, and responsive customer support, we ensure a hassle-free journey from browsing to delivery. Whether you're shopping on mobile or desktop, our goal is to provide comfort, speed, and convenience at every step.</p>
        </div>

        <div className='border px-10 md:16px sm:py-20 flex flex-col gap-5'>
          <b>Exceptional Customer service :</b>
          <p className='text-gray-600 text-justify'>Our support team is here for you before, during, and after every order. From questions about sizing and availability to returns and exchanges, we respond quickly and resolve issues fairly. With order tracking, easy exchanges, and a 7-day return policy, we make sure every purchase on Vrihaa Bazaar feels safe and worry-free.</p>
        </div>
      </div>
      <NewsletterBox />
    </div>
  )
}

export default About
