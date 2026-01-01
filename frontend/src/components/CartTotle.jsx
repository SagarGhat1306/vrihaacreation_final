import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'

const CartTotle = () => {
    const {currency , delivary_fee , getCartAmount } =  useContext(ShopContext)
  return (
    <div className='w-full'>
        <div className='text-2xl '>
                <Title text1={'CRAT'} text2={'TOTAL'}/>
        </div>
        <div className='flex flex-col gap-2 mt-2 textsm'>
            <div className='flex justify-between'>
                <p>Sub Total</p>
                <p>{currency} {getCartAmount()}</p>
            </div>
            <hr />

            <div className='flex justify-between'>
                  <p>Shipping Fee</p>
                <p>{currency} {delivary_fee}</p>
            </div>
            <hr />
                <div className='flex justify-between'>
                  <p>Total</p>
                <p>{currency} {getCartAmount() === 0 ? 0 : getCartAmount() + delivary_fee}</p>
            </div>


        </div>
    </div>
  )
}

export default CartTotle
