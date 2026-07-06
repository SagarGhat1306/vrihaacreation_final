import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import Reletedproducts from '../components/Reletedproducts';
import { toast } from 'react-toastify';
import { imgUrl } from '../api';

const Product = () => {
  const { productID } = useParams();
  const { products, currency, AddToCart } = useContext(ShopContext);

  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState('')
  const [size, setSize] = useState('')

  const fetchproductData = async () => {
    products.map((item) => {
      if (item._id === productID) {
        setProductData(item)
        setImage(imgUrl(item.image[0]))
        return null
      }
    })
  }

  useEffect(() => {
    fetchproductData()
  }, [productID, products])

  // live stock for the selected size
  const selectedSizeInfo = productData ? productData.sizes.find(s => s.size === size) : null

  return productData ? (
    <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100 '>
      {/* product data  */}
      <div className='flex gap-12 flex-col sm:flex-row'>
        {/* product images */}

        <div className='flex-1 flex flex-col-reverse gap-3 justify-center  sm:flex-row sm:gap-5 '>
          <div className='flex flex-col overflow-x-auto sm:overflow-y-scroll justify-normal sm:w-[18.7%]  w-full'>
            {
              productData.image.map((item, index) => (
                <img onClick={() => setImage(imgUrl(item))} src={imgUrl(item)} key={index} className='w-[24%] sm:w-full sm:mb-5 shrink-0 cursor-pointer ' />
              ))
            }

          </div>

          <div className='w-full sm:w-[80%] '>
            <img src={image} alt="" className='w-full ' />
          </div>

          {/* product information  */}
          <div className=''>
            <h1 className='font-medium text-2xl mt-2'>{productData.name}</h1>

            {/* seller name — marketplace touch */}
            <p className='text-sm text-gray-400 mt-1'>Sold by {productData.sellerName || 'Vrihaa Bazaar'}</p>

            <div className='flex items-center gap-1 mt-2'>

              <img src={assets.star_icon} alt="" className="w-3 5" />
              <img src={assets.star_icon} alt="" className="w-3 5" />
              <img src={assets.star_icon} alt="" className="w-3 5" />
              <img src={assets.star_icon} alt="" className="w-3 5" />
              <img src={assets.star_dull_icon} alt="" className="w-3 5" />

              <p className='pl-2 '>{122}</p>
            </div>
            <p className='mt-5 text-3xl font-medium'>
              {currency}
              {productData.price}
            </p>

            <p className='mt-2 text-gray-500'>{productData.description}</p>

            <div className='flex flex-col gap-4 my-8'>
              <p className=''>Select size</p>
              <div className='flex gap-2 flex-wrap'>
                {productData.sizes.map((item, index) => {
                  const outOfStock = (item.stock || 0) <= 0
                  return (
                    <button
                      key={index}
                      disabled={outOfStock}
                      onClick={() => setSize(item.size)}
                      className={`border py-2 px-4 bg-gray-100
                        ${item.size === size ? 'border-orange-500' : ''}
                        ${outOfStock ? 'opacity-40 line-through cursor-not-allowed' : ''}`}
                    >
                      {item.size}
                    </button>
                  )
                })}
              </div>

              {/* availability message — like Meesho's urgency tag */}
              {selectedSizeInfo && selectedSizeInfo.stock > 0 && selectedSizeInfo.stock <= 5 && (
                <p className='text-sm text-red-500'>Hurry! Only {selectedSizeInfo.stock} left in this size</p>
              )}
              {productData.sizes.every(s => (s.stock || 0) <= 0) && (
                <p className='text-sm text-red-500 font-medium'>Currently out of stock</p>
              )}

            </div>

            <button onClick={() => {
              if (!size) {
                toast.error("Please select a size");
                return;
              }
              AddToCart({ itemId: productData._id, size });
            }}
              disabled={productData.sizes.every(s => (s.stock || 0) <= 0)}
              className='bg-black text-sm active:bg-gray-700 text-white px-8 py-3 disabled:bg-gray-400 disabled:cursor-not-allowed'>
              ADD TO CART
            </button>
            <hr className='mt-8 sm:4/5' />

            <div className='text-sm mt-5 text-gray-500 flex flex-col gap-1'>
              <p>100 % Original Product</p>
              <p> Cash On Delivary available on this product</p>
              <p> Exchange Policy withing 7 days</p>
            </div>
          </div>
        </div>
        {/* description and review section  */}
      </div>
      <div className='mt-20'>
        <div className='flex'>
          <b className='border px-5 py-3 text-sm'>
            Description
          </b>
          <p className='border px-5 py-3 text-sm'>
            Reviews (124)
          </p>
        </div>

        <div className='flex flex-col gap-4 border px-6 py-6 mt-10 text-sm text-gray-500'>
          <p className=''>{productData.description}</p>
          <p>Category: {productData.category} — {productData.subCategory}. Quality checked before dispatch. Cash on delivery and online payment available.</p>
        </div>

      </div>


      {/* display releted product  */}

      <Reletedproducts
        catagory={productData.category}
        subcatagory={productData.subCategory}
      />

    </div>
  ) : <div className='opacity-0'></div>
}

export default Product
