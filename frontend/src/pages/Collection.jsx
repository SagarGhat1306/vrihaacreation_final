import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';

const Collection = () => {

  const {products , search , showSearch } = useContext(ShopContext);
  const [showfiltter , setShowfillter] = useState(false);
  const [fillterProducts ,setfillterProducts] = useState([]);
  const [catagory , setCatagory] = useState([]);
  const [subcatagory , setSubCatagory] = useState([]);

  const [sortType , setSortType] = useState('relevent')

  useEffect(()=> {
    setfillterProducts(products)
  },[]);

  const toggleCatagory = (e) =>{
    if (catagory.includes(e.target.value)) {
      setCatagory(prev => prev.filter(item => item !== e.target.value ))
    }

    else {
      setCatagory(prev => [...prev , e.target.value])
    }
  }  

  useEffect(() => {
    console.log(catagory)
  },[catagory])

  const toggleSubCatagory = (e) => {
        if (subcatagory.includes(e.target.value)) {
      setSubCatagory(prev => prev.filter(item => item !== e.target.value ))
    }

    else {
      setSubCatagory(prev => [...prev , e.target.value])
    }
  }

  useEffect(() => {
    console.log(subcatagory)
  },[subcatagory])

  const Applyfillter = () => {
    let productsCopy = products.slice();
    
    if (showSearch && search) {
      productsCopy = productsCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
    }

    if(catagory.length > 0){
     productsCopy = productsCopy.filter(item =>
    catagory.includes(item.category));
  }

if (subcatagory.length > 0) {
  productsCopy = productsCopy.filter(item =>
    subcatagory.includes(item.subCategory)
  );
}


    setfillterProducts(productsCopy)
  }

  useEffect(() =>{
    Applyfillter();
  },[subcatagory, catagory, search,showSearch,products])

  const sortProducts = () => {
    let filtterProductsCopy = fillterProducts.slice();

    switch (sortType) {
      case 'low-high' : setfillterProducts(filtterProductsCopy.sort((a , b ) => (a.price - b.price) ));
      break;

      case 'high-low' : setfillterProducts(filtterProductsCopy.sort((a , b ) => (b.price - a.price) ));
      break;

      default:
        Applyfillter();
        break;
    }

  }

  useEffect(() => {
    sortProducts();
  },[sortType])

  return (
    <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t'>

      {/* fillter options  */}
      <div className='min-w-60 '>
        <p onClick={()=> setShowfillter(!showfiltter)} className='my-2 text-xl flex items-center cursor-pointer gap-2'>FILTTERS
         <img src={assets.dropdown_icon} className={`h-3 sm:hidden ${showfiltter ? 'rotate-90' : '' }`} />  
        </p> 
        {/* catagory filtter  */}

        <div className={`border border-gray-300 pl-5 py-3 mt-6  ${showfiltter ? '' : 'hidden' } sm:block`}>

          <p className='mb-3 text-sm font-medium '>CATAGORIES</p>

          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            <p className='flex gap-2 '>
              <input type = 'checkbox' className='w-3' value={'Men'} onChange={toggleCatagory}/>Men
            </p>
             <p className='flex gap-2 '>
              <input type = 'checkbox' className='w-3' value={'Women'}  onChange={toggleCatagory}/>women
            </p>
             <p className='flex gap-2 '>
              <input type = 'checkbox' className='w-3' value={'Kids'} onChange={toggleCatagory} />Kids
            </p>
          </div>
        </div>

        {/* sub catagory filtter  */}

       <div className={`border border-gray-300 pl-5 py-3 mt-5  ${showfiltter ? '' : 'hidden' } sm:block`}>

          <p className='mb-3 text-sm font-medium '>Type</p>

          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            <p className='flex gap-2 '>
              <input type = 'checkbox' className='w-3' value={'Topwear'} onChange={toggleSubCatagory}/>Topwear
            </p>
             <p className='flex gap-2 '>
              <input type = 'checkbox' className='w-3' value={'Bottomwear'} onChange={toggleSubCatagory}/>Bottomwear
            </p>
             <p className='flex gap-2 '>
              <input type = 'checkbox' className='w-3' value={'Winterwear'} onChange={toggleSubCatagory}/>Winterwear
            </p>
          </div>
        </div>
      </div>

      {/* righ side  */}

      <div className='flex-1 '>

        <div className='flex justify-between text-base sm:text-2xl mb-4'>
          <Title text1={"ALL"} text2={"COLLECTIONS"}/>
          {/* product sort  */}

          <select onChange={(e)=>setSortType(e.target.value)} className='border-2 border-gray-300 text-xl font-medium px-2'>
            <option value = "relevent">Sort by : Relevent</option>
            <option value = "low-high"> Sort by: low to High</option>
            <option value = "high-low">Sort by: High to Low</option>
          </select>
        </div>


        {/* All products  */}

        <div className='grid grid-cols-2 sm:grid-cols-3 ms:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
          {
            fillterProducts.map((item ,index )=>(
              <ProductItem key = {index} id = {item._id} image={item.image} name = {item.name} price= {item.price} />
            ))
          }
        </div>



      </div>
    </div>
  )
}

export default Collection
