import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets'
import { useLocation } from 'react-router-dom';

const SearchBar = () => {

  const { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext);
  const [searchvisible , setSerachVisible] = useState(false)

  const location = useLocation();

  useEffect(()=>{

    if (location.pathname.includes('collection') && showSearch) {
        setSerachVisible(true)
    }
    else{
        setSerachVisible(false)
    }
    console.log(location.pathname)
  },[location])

  return showSearch  && searchvisible ? (
    <div className="bg-gray-50 py-5 relative flex justify-around">

      {/* Search Input */}
      <div className="flex items-center border border-gray-400 py-3 px-4 rounded-full w-3/4 sm:w-1/2 bg-white">
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 outline-none text-sm bg-transparent px-2"
        />
        <img src={assets.search_icon} alt="" className="w-4 opacity-70" />

        <img
        onClick={() => setShowSearch(false)}
        className="w-4 cursor-pointer absolute right-4 top-1/2 -translate-y-1/2"
        src={assets.cross_icon}
        alt=""
      />
      </div>
      {/* CROSS ICON — aligned right */}
   
    </div>
  ) : null
}

export default SearchBar
