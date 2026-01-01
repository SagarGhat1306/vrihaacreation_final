import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import Reletedproducts from '../components/Reletedproducts';
import { toast } from 'react-toastify';

const Product = () => {
  const {productID}  = useParams();
  const {products , currency , AddToCart } = useContext(ShopContext);

  const [productData , setProductData] = useState(false);
  const [image , setImage] = useState('')
  const [size , setSize] = useState('')

  const fetchproductData = async () => {
      products.map((item)=>{
        if (item._id === productID) {
          setProductData(item)
          setImage(item.image[0])
          return null
        }
      })
  }
   

  useEffect(()=>{
    fetchproductData()
  },[productID , products])
  // console.log(productID)

  return productData ?  (
    <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100 '>
      {/* product data  */}
        <div className='flex gap-12 flex-col sm:flex-row'>
          {/* product images */}

            <div className='flex-1 flex flex-col-reverse gap-3 justify-center  sm:flex-row sm:gap-5 '>
              <div className='flex flex-col overflow-x-auto sm:overflow-y-scroll justify-normal sm:w-[18.7%]  w-full'>
                {
                  productData.image.map((item,index)=> (
                    <img onClick={() => setImage(item)} src={item} key={index} className='w-[24%] sm:w-full sm:mb-5 shrink-0 cursor-pointer '/>
                  ))
                }

              </div>

              <div className='w-full sm:w-[80%] '>
                  <img src={image} alt = ""  className='w-full '/>
              </div>

                {/* product information  */}
              <div className=''>
                <h1 className='font-medium text-2xl mt-2'>{productData.name}</h1>
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
                  <div className='flex gap-2'>
                    {productData.sizes.map((item ,index)=> (
                      <button onClick={()=> setSize(item)} className={`border py-2 px-4 bg-gray-100 ${item === size ? 'border-orange-500' : ''}`} key ={index}>{item}</button>
                    ))}
                  </div>

                 </div>

                 <button onClick={() => {
                  if (!size) {
                    toast.error("Please select a size");
                    return;
                  }
                  AddToCart({ itemId: productData._id, size });
                }} className='bg-black text-sm active:bg-gray-700 text-white px-8 py-3'>ADD TO CART</button>
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
                    <p className=''>A stylish ribbed crop top crafted with stretchable fabric that hugs your body comfortably. Ideal for pairing with high-waist jeans, skirts, or joggers. Smooth texture, vibrant colors, and a flattering silhouette that enhances everyday fashion.</p>
                    <p>A soft, breathable oversized T-shirt made from 100% premium cotton. Designed for all-day comfort with a relaxed fit that feels light and easy on the skin. Perfect for daily wear, casual outings, or layering in any season.</p>
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
//