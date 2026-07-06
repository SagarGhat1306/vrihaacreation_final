import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom'
import { imgUrl } from '../api'

const ProductItem = ({ id, image, name, price, sizes }) => {

  const { currency } = useContext(ShopContext)

  // sold out when every size has 0 stock
  const soldOut = sizes && sizes.length > 0 && sizes.every(s => (s.stock || 0) <= 0)

  return (
    <Link className="text-gray-500 cursor-pointer" to={`/product/${id}`}>
      <div className='overflow-hidden relative'>
        <img src={imgUrl(image[0])} className="hover:scale-110 transition ease-in-out" alt="" />
        {soldOut && (
          <p className='absolute top-2 left-2 bg-black text-white text-[10px] px-2 py-0.5'>SOLD OUT</p>
        )}
      </div>
      <p className='pt-3 pb-1 text-sm'>{name}</p>
      <p className='text-sm font-medium'>{currency}{price}</p>
    </Link>
  )
}

export default ProductItem
