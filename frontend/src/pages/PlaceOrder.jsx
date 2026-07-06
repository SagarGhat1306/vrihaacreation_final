import React, { useContext, useState } from 'react'
import Title from '../components/Title'
import CartTotle from '../components/CartTotle'
import { assets } from '../assets/assets'
import { ShopContext } from '../context/ShopContext'
import { toast } from 'react-toastify'
import { apiPost } from '../api'

const PlaceOrder = () => {

  const [method, setMethod] = useState('cod');
  const [loading, setLoading] = useState(false);
  const { navigate, token, cartItems, setCartItems, products, delivary_fee, getCartAmount } = useContext(ShopContext)
  const [formData, setfromData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: ''
  })

  const onchangeHandler = (e) => {
    const name = e.target.name
    const value = e.target.value
    setfromData(data => ({ ...data, [name]: value }))
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const activeToken = token || localStorage.getItem("token")
      if (!activeToken) {
        toast.error("Please login to place your order")
        navigate('/login')
        return
      }

      let orderItems = [];

      // Loop through cartItems
      for (const productId in cartItems) {
        for (const size in cartItems[productId]) {
          if (cartItems[productId][size] > 0) {

            const itemInfo = structuredClone(
              products.find((product) => product._id === productId)
            );

            if (itemInfo) {
              itemInfo.size = size;
              itemInfo.quantity = cartItems[productId][size];
              orderItems.push(itemInfo);
            }
          }
        }
      }

      if (orderItems.length === 0) {
        toast.error("Your cart is empty")
        return
      }

      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivary_fee
      }

      setLoading(true)

      // availability pre-check — tells the user exactly what's out of stock
      const availability = await apiPost('/api/product/availability', {
        items: orderItems.map(i => ({ itemId: i._id, size: i.size, quantity: i.quantity }))
      })
      if (!availability.success) {
        availability.unavailable?.forEach(u =>
          toast.error(`${u.name} (${u.size}) — only ${u.available} left`)
        )
        setLoading(false)
        return
      }

      switch (method) {

        // ---------- CASH ON DELIVERY (your existing flow) ----------
        case 'cod': {
          const data = await apiPost('/api/order/place', orderData, activeToken)

          if (data.success) {
            setCartItems({});
            toast.success("Order placed!")
            navigate('/orders');
          } else {
            toast.error(data.message);
          }
          break;
        }

        // ---------- RAZORPAY (DUMMY) ----------
        case 'razorpay': {
          // 1. backend reserves the stock atomically + returns a dummy order
          const rzpData = await apiPost('/api/order/razorpay', orderData, activeToken)

          if (!rzpData.success) {
            toast.error(rzpData.message) // e.g. out of stock
            break
          }

          // 2. dummy payment popup — swap with real Razorpay checkout later
          const paid = window.confirm(
            `RAZORPAY (DUMMY)\n\nPay ₹${rzpData.order.amount / 100} for order ${rzpData.order.id}?\n\nOK = payment success\nCancel = payment failed`
          )

          // 3. verify — success places order, failure releases reserved stock
          const verifyData = await apiPost('/api/order/verifyRazorpay', {
            razorpayOrderId: rzpData.order.id,
            success: paid
          }, activeToken)

          if (verifyData.success) {
            setCartItems({})
            toast.success("Payment successful!")
            navigate('/orders')
          } else {
            toast.error(verifyData.message)
          }
          break;
        }

        default:
          break;
      }

    } catch (error) {
      console.log("Order Error:", error);
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  };


  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t '>
      {/* left side  */}
      <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
        <div className='text-xl sm:2xl my-3 '>
          <div>
            <Title text1={'DELEVERY'} text2={'INFORMATION'} />
          </div>
          <div className='flex gap-3'>
            <input onChange={onchangeHandler} name='firstName' value={formData.firstName} className='border border-gray-200 rounded py-1.5 px-3.5 w-full' type="text" placeholder='First Name' required />
            <input onChange={onchangeHandler} name='lastName' value={formData.lastName} className='border border-gray-200 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Last Name' required />
          </div>
          <input onChange={onchangeHandler} name='email' value={formData.email} className='border border-gray-200 rounded py-1.5 px-3.5 w-full mt-5' type="email" placeholder='Email' required />
          <input onChange={onchangeHandler} name='street' value={formData.street} className='border border-gray-100 rounded py-1.5 px-3.5 w-full mt-5' type="text" placeholder='street' required />

          <div className='flex gap-3'>
            <input onChange={onchangeHandler} name='city' value={formData.city} className='border border-gray-200 rounded py-1.5 px-3.5 w-full mt-5' type="text" placeholder='City' required />
            <input onChange={onchangeHandler} name='state' value={formData.state} className='border border-gray-200 rounded py-1.5 px-3.5 w-full mt-5 ' type="text" placeholder='State' required />
          </div>

          <div className='flex gap-3'>
            <input onChange={onchangeHandler} name='zipcode' value={formData.zipcode} className='border border-gray-200 rounded py-1.5 px-3.5 w-full mt-5' type="number" placeholder='zip code' required />
            <input onChange={onchangeHandler} name='country' value={formData.country} className='border border-gray-200 rounded py-1.5 px-3.5 w-full mt-5 ' type="text" placeholder='country' required />
          </div>

          <input onChange={onchangeHandler} name='phone' value={formData.phone} className='border border-gray-200 rounded py-1.5 px-3.5 w-full mt-5 ' type="number" placeholder='phone number' required />
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

            {/* Razorpay */}
            <div onClick={() => setMethod('razorpay')} className="flex items-center gap-3 p-4 border rounded cursor-pointer hover:shadow-md transition">
              <span className={`min-w-3.5 h-3 border rounded-full ${method === 'razorpay' ? 'bg-green-400' : ''}`}></span>
              <img className="h-6 " src={assets.razorpay_logo} alt="" />
            </div>

            {/* Stripe — coming soon */}
            <div className="flex items-center gap-3 p-4 border rounded cursor-not-allowed opacity-40">
              <span className='min-w-3.5 h-3 border rounded-full'></span>
              <img className="h-6" src={assets.stripe_logo} alt="" />
            </div>

            {/* COD */}
            <div onClick={() => setMethod('cod')} className="flex items-center gap-3 p-4 border rounded cursor-pointer hover:shadow-md transition">
              <span className={`min-w-3.5 h-3 border rounded-full ${method === 'cod' ? 'bg-green-400' : ''}`}></span>
              <p className="text-gray-600 text-sm font-medium">Cash on Delivery</p>
            </div>
          </div>


          <div className='w-full text-end mt-8'>
            <button disabled={loading} type='submit' className='bg-black text-white px-16 py-3 text-sm disabled:bg-gray-400'>
              {loading ? 'PLACING...' : 'PLACE ORDER'}
            </button>
          </div>
        </div>
      </div>

    </form>
  )
}

export default PlaceOrder
