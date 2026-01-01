import React, { useContext, useState } from 'react'
import Title from '../components/Title'
import CartTotle from '../components/CartTotle'
import { assets } from '../assets/assets'
import { ShopContext } from '../context/ShopContext'
import { toast } from 'react-toastify'
import axios from 'axios'
const PlaceOrder = () => {

  const [method, setMethod] = useState('cod');
  const {navigate , backendurl,token, cartItems,  setCartItems,  products, currency , delivary_fee , getCartAmount} = useContext(ShopContext)
  const [formData,setfromData] = useState({
      firstName : '',
      lastName : '',
      email : '',
      street:'',
      city:'',
      state:'',
      zipcode:'',
      country:'',
      phone:''

  })

  const onchangeHandler  = (e) => {
    const name = e.target.name
    const value = e.target.value

    setfromData(data => ({...data,[name]:value}))
  }

const onSubmitHandler = async (e) => {
  e.preventDefault();
   console.log("cartItems:", cartItems);
  console.log("products:", products);

  try {
    let orderItems = [];

    // Loop through cartItems (category or product ID)
    for (const productId in cartItems) {

      // Loop through sizes or variations
      for (const size in cartItems[productId]) {

        // Only push if quantity > 0
        if (cartItems[productId][size] > 0) {
          
          // Find the product info
          const itemInfo = structuredClone(
            products.find((product) => product._id === productId)
          );

          // If product found — add size & quantity
          if (itemInfo) {
            itemInfo.size = size;
            itemInfo.quantity = cartItems[productId][size];
            orderItems.push(itemInfo);
          }
        }
      }
    }

    console.log("Final Order Items:", orderItems);

    let orderData = {
      // userId: userIdFromContextOrToken,
      address:formData,
      items: orderItems,
      amount: getCartAmount() + delivary_fee
    }
    console.log(orderData)

    const token = localStorage.getItem("token") 
    if(!token){
      console.log("no token is getting")
    }
    console.log(token);

    switch(method){
      case 'cod':
          const response = await axios.post(`${backendurl}/api/order/place`, orderData, {
             headers: {
              token: token
            } 
          });

          console.log(response.data); // <- fixed

          if (response.data.success) {
            setCartItems({});
            navigate('/Orders');
          } else {
            toast.error(response.data.message);
          }

      break;

      default:
        break;

    }
    
    // ➤ Now you can send it to backend
    // await axios.post("/order", { orderItems });

  } catch (error) {
    console.log("Order Error:", error);
  }
};


  return (
    <form  onSubmit = {onSubmitHandler} className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t '>
      {/* left side  */}
      <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
        <div className='text-xl sm:2xl my-3 '>
          <div>
              <Title text1={'DELEVERY'} text2={'INFORMATION'}/>
          </div>
          <div className='flex gap-3'>
            <input onChange={onchangeHandler} name='firstName'  value= {formData.firstName} className='border border-gray-200 rounded py-1.5 px-3.5 w-full' type ="text" placeholder='First Name' required/>
            <input  onChange={onchangeHandler} name='lastName'  value= {formData.lastName} className='border border-gray-200 rounded py-1.5 px-3.5 w-full' type ="text" placeholder='Last Name'  required/>      
          </div>
              <input onChange={onchangeHandler} name='email'  value= {formData.email}  className='border border-gray-200 rounded py-1.5 px-3.5 w-full mt-5' type ="email" placeholder='Email'  required/>
              <input onChange={onchangeHandler} name='street'  value= {formData.street} className='border border-gray-100 rounded py-1.5 px-3.5 w-full mt-5' type ="text" placeholder='street'  required/>

          <div className='flex gap-3'>
            <input onChange={onchangeHandler} name='city'  value= {formData.city} className='border border-gray-200 rounded py-1.5 px-3.5 w-full mt-5' type ="text" placeholder='City'  required/>
            <input onChange={onchangeHandler} name='state'  value= {formData.state} className='border border-gray-200 rounded py-1.5 px-3.5 w-full mt-5 ' type ="text" placeholder='State'  required/>      
          </div>

          <div className='flex gap-3'>
            <input onChange={onchangeHandler} name='zipcode'  value= {formData.zipcode} className='border border-gray-200 rounded py-1.5 px-3.5 w-full mt-5' type ="number" placeholder='zip code'  required/>
            <input onChange={onchangeHandler} name='country'  value= {formData.country} className='border border-gray-200 rounded py-1.5 px-3.5 w-full mt-5 ' type ="text" placeholder='country'  required/>      
          </div>

           <input onChange={onchangeHandler} name='phone'  value= {formData.phone} className='border border-gray-200 rounded py-1.5 px-3.5 w-full mt-5 ' type ="number" placeholder='phone number'  required/>
        </div>
      </div>


      {/* right side  */}

      <div className='flex flex-col'>
      <div className="mt-8 min-w-80">
        <CartTotle />
      </div>

      <div className="mt-12">
        <Title text1={"PAYMENT"} text2={"METHOD"} />

        {/* PAYMENT METHOD */}
        <div className="flex flex-col lg:flex-row gap-4 mt-6">

          {/* Stripe */}
          <div onClick={()=>setMethod('strip')} className="flex items-center gap-3 p-4 border rounded cursor-pointer hover:shadow-md transition">
            <span className={`min-w-3.5 h-3 border rounded-full ${method === 'strip' ? 'bg-green-400' : '' }`}></span>
            <img className="h-6" src={assets.stripe_logo} alt="" />
          </div>

          {/* Razorpay */}
          <div onClick={()=>setMethod('razorpay')} className="flex items-center gap-3 p-4 border rounded cursor-pointer hover:shadow-md transition">
             <span className={`min-w-3.5 h-3 border rounded-full ${method === 'razorpay' ? 'bg-green-400': '' }`}></span>
            <img className="h-6 " src={assets.razorpay_logo} alt="" />
          </div>

          {/* COD */}
          <div onClick={()=>setMethod('cod')} className="flex items-center gap-3 p-4 border rounded cursor-pointer hover:shadow-md transition">
             <span className={`min-w-3.5 h-3 border rounded-full ${method === 'cod' ? 'bg-green-400' : '' }`}></span>
            <p className="text-gray-600 text-sm font-medium">Cash on Delivery</p>
          </div>
        </div>


      <div  className='w-full text-end mt-8'>
        <button type='submit' className='bg-black text-white px-16 py-3 text-sm'>PLACE ORDER</button>
      </div>
      </div>
    </div>

    </form>
  )
}

export default PlaceOrder


//  onClick={()=> navigate('/Orders')}