import React from 'react'
import { useState , useEffect} from 'react'
import axios from 'axios'
import {toast} from 'react-toastify'
import {assets} from '../assets/assets'
import {currency}  from '../App'

const Order = ({token}) => {

  console.log(token)
  const [orders, setOrders ]  = useState([]);

  const fetchAllorders = async (req,res) => {
    if (!token){
      return null
    }

    try{
      const response =  await axios.post(
      "http://localhost:5000/api/order/list",
      {}, 
      { headers: { token } })

        console.log(response.data)
           if (response.data.success){
        setOrders(response.data.orders)
      }
      else{
        toast.error(response.data.message)
      }

    }catch(error){
      toast.error(response.data.message)
      resizeBy.j
      console.log(error)
    }
  }

  useEffect(()=>{
    fetchAllorders();
  },[token])

  const statusHandler = async(e, orderId) => {
    try{
      await axios.post(
      "http://localhost:5000/api/order/status",
      { orderId, status: e.target.value }, 
      { headers: { token } }
    )


      if(response.data.success){
        await fetchAllorders()
      }
    }catch(error){
      console.log(error)
       toast.error(response.data.message)
    }
  }

  return (
   <div className=''>
  <h3>Order Page</h3>
  <div>
    {
      orders.map((order, index) => (
        <div
          className='grid grid-col-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] items-start border border-gray-200 md:p-8 md:my-4 text-xs sm:text-sm text-gray-700'
          key={index}
        >
          <img className='w-12' src={assets.parcel_icon} alt="" />

          {/* LEFT SIDE */}
          <div>
            {/* ITEMS LIST */}
            <div>
              {
                order.items?.map((item, i) => (
                  <p className='py-0.5' key={i}>
                    {item.name} x {item.quantity} <span>{item.size}</span>
                  </p>
                ))
              }
            </div>

            {/* ADDRESS */}
            <div>
              <p className='mt-3 mb-2 font-medium'>
                {order.address.firstName + " " + order.address.lastName}
              </p>

              <div>
                <p>{order.address.street + ","}</p>
                <p>
                  {order.address.city + "," + order.address.state + "," + order.address.zipcode}
                </p>
              </div>
            </div>

            <p>{order.address.phone}</p>
          </div>

          {/* CENTER */}
          <div>
            <p className='text-sm sm:text-[15px]'>
              Items : {order.items?.length}
            </p>

            <p className='mt-3'>Method : {order.paymentMethod}</p>
            <p>Payment : {order.payment ? "Done" : "Pending"}</p>
            <p>Date : {new Date(order.date).toLocaleDateString()}</p>
          </div>

          {/* AMOUNT */}
          <p className='text-sm sm:text-[15px]'>
            {currency}{order.amount}
          </p>

          {/* STATUS DROPDOWN */}
          <select
            onChange={(e) => statusHandler(e, order._id)}
            value={order.status}
            className='p-2 font-semibold'
          >
            <option value="Order Placed">Order Placed</option>
            <option value="Packing">Packing</option>
            <option value="Shipped">Shipped</option>
            <option value="Out for delivery">Out for delivery</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>
      ))
    }
  </div>
</div>

  )
}

export default Order
