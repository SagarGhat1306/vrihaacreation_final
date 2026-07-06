import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';
import { useSearchParams } from 'react-router-dom';

const Collection = () => {

  const { products, search, showSearch, categories } = useContext(ShopContext);
  const [showfiltter, setShowfillter] = useState(false);
  const [fillterProducts, setfillterProducts] = useState([]);
  const [catagory, setCatagory] = useState([]);
  const [subcatagory, setSubCatagory] = useState([]);

  const [sortType, setSortType] = useState('relevent')

  // read ?category= & ?subCategory= from the Meesho-style navbar links
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const cat = searchParams.get('category')
    const sub = searchParams.get('subCategory')
    setCatagory(cat ? [cat] : [])
    setSubCatagory(sub ? [sub] : [])
  }, [searchParams])

  useEffect(() => {
    setfillterProducts(products)
  }, []);

  const toggleCatagory = (e) => {
    if (catagory.includes(e.target.value)) {
      setCatagory(prev => prev.filter(item => item !== e.target.value))
    }
    else {
      setCatagory(prev => [...prev, e.target.value])
    }
  }

  const toggleSubCatagory = (e) => {
    if (subcatagory.includes(e.target.value)) {
      setSubCatagory(prev => prev.filter(item => item !== e.target.value))
    }
    else {
      setSubCatagory(prev => [...prev, e.target.value])
    }
  }

  const Applyfillter = () => {
    let productsCopy = products.slice();

    if (showSearch && search) {
      productsCopy = productsCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
    }

    if (catagory.length > 0) {
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

  useEffect(() => {
    Applyfillter();
  }, [subcatagory, catagory, search, showSearch, products])

  const sortProducts = () => {
    let filtterProductsCopy = fillterProducts.slice();

    switch (sortType) {
      case 'low-high': setfillterProducts(filtterProductsCopy.sort((a, b) => (a.price - b.price)));
        break;

      case 'high-low': setfillterProducts(filtterProductsCopy.sort((a, b) => (b.price - a.price)));
        break;

      case 'popular': setfillterProducts(filtterProductsCopy.sort((a, b) => ((b.soldCount || 0) - (a.soldCount || 0))));
        break;

      default:
        Applyfillter();
        break;
    }
  }

  useEffect(() => {
    sortProducts();
  }, [sortType])

  // sub categories shown = subs of selected categories (or every sub if none selected)
  const visibleSubCategories = []
  const seen = new Set()
  categories
    .filter(cat => catagory.length === 0 || catagory.includes(cat.name))
    .forEach(cat => cat.subCategories.forEach(sub => {
      if (!seen.has(sub.name)) { seen.add(sub.name); visibleSubCategories.push(sub) }
    }))

  return (
    <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t'>

      {/* fillter options  */}
      <div className='min-w-60 '>
        <p onClick={() => setShowfillter(!showfiltter)} className='my-2 text-xl flex items-center cursor-pointer gap-2'>FILTTERS
          <img src={assets.dropdown_icon} className={`h-3 sm:hidden ${showfiltter ? 'rotate-90' : ''}`} />
        </p>
        {/* catagory filtter — now fully dynamic like Meesho */}

        <div className={`border border-gray-300 pl-5 py-3 mt-6  ${showfiltter ? '' : 'hidden'} sm:block`}>

          <p className='mb-3 text-sm font-medium '>CATAGORIES</p>

          <div className='flex flex-col gap-2 text-sm font-light text-gray-700 max-h-72 overflow-y-auto pr-2'>
            {categories.map((cat) => (
              <p key={cat._id} className='flex gap-2 '>
                <input
                  type='checkbox'
                  className='w-3'
                  value={cat.name}
                  checked={catagory.includes(cat.name)}
                  onChange={toggleCatagory}
                />{cat.name}
              </p>
            ))}
          </div>
        </div>

        {/* sub catagory filtter  */}

        <div className={`border border-gray-300 pl-5 py-3 mt-5  ${showfiltter ? '' : 'hidden'} sm:block`}>

          <p className='mb-3 text-sm font-medium '>Type</p>

          <div className='flex flex-col gap-2 text-sm font-light text-gray-700 max-h-72 overflow-y-auto pr-2'>
            {visibleSubCategories.map((sub) => (
              <p key={sub.slug || sub.name} className='flex gap-2 '>
                <input
                  type='checkbox'
                  className='w-3'
                  value={sub.name}
                  checked={subcatagory.includes(sub.name)}
                  onChange={toggleSubCatagory}
                />{sub.name}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* righ side  */}

      <div className='flex-1 '>

        <div className='flex justify-between text-base sm:text-2xl mb-4'>
          <Title text1={"ALL"} text2={"COLLECTIONS"} />
          {/* product sort  */}

          <select onChange={(e) => setSortType(e.target.value)} className='border-2 border-gray-300 text-sm px-1 py-1 sm:text-base sm:px-2 sm:py-1.5 d:text-lg md:px-3  md:text-lg  md:py-2
                lg:text-xl lg:px-4 lg:py-2'>
            <option value="relevent">Sort by : Relevent</option>
            <option value="popular">Sort by: Popular</option>
            <option value="low-high"> Sort by: low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>
        </div>


        {/* All products  */}

        <div className='grid grid-cols-2 sm:grid-cols-3 ms:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
          {
            fillterProducts.map((item, index) => (
              <ProductItem key={index} id={item._id} image={item.image} name={item.name} price={item.price} sizes={item.sizes} />
            ))
          }
        </div>

        {fillterProducts.length === 0 && (
          <p className='text-center text-gray-400 py-20'>No products found in this category yet.</p>
        )}

      </div>
    </div>
  )
}

export default Collection
