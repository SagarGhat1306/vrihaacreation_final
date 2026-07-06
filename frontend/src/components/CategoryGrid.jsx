import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { useNavigate } from 'react-router-dom'
import Title from './Title'
import { imgUrl } from '../api'

// Meesho-style "shop by category" tiles on the home page
const CategoryGrid = () => {

    const { categories } = useContext(ShopContext)
    const navigate = useNavigate()

    if (categories.length === 0) return null

    return (
        <div className='my-10'>
            <div className='text-center py-8 text-3xl'>
                <Title text1={'SHOP BY'} text2={'CATEGORY'} />
            </div>

            <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4'>
                {categories.map((cat) => (
                    <div
                        key={cat._id}
                        onClick={() => navigate(`/collection?category=${encodeURIComponent(cat.name)}`)}
                        className='cursor-pointer text-center group'
                    >
                        <div className='w-full aspect-square bg-slate-100 rounded-full overflow-hidden flex items-center justify-center'>
                            {cat.image?.url
                                ? <img src={imgUrl(cat.image)} alt={cat.name} className='w-full h-full object-cover group-hover:scale-110 transition' />
                                : <p className='text-2xl text-gray-400 prata-regular'>{cat.name.charAt(0)}</p>
                            }
                        </div>
                        <p className='text-xs sm:text-sm mt-2 text-gray-700'>{cat.name}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default CategoryGrid
