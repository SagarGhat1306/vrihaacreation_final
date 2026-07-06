import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'

// Meesho-style category strip with hover mega-menu.
// Sits right under the main navbar. Categories come from the database.
const CategoryNavbar = () => {

    const { categories } = useContext(ShopContext)
    const navigate = useNavigate()

    if (categories.length === 0) return null

    return (
        <div className='hidden sm:block border-t border-b relative'>
            <div className='flex gap-6 text-sm text-gray-700 py-3 overflow-x-auto'>
                {categories.map((cat) => (
                    <div key={cat._id} className='group shrink-0'>
                        <p
                            onClick={() => navigate(`/collection?category=${encodeURIComponent(cat.name)}`)}
                            className='cursor-pointer hover:text-black whitespace-nowrap font-medium'
                        >
                            {cat.name}
                        </p>

                        {/* dropdown on hover — like Meesho */}
                        <div className='hidden group-hover:block absolute top-full left-0 w-full bg-white shadow-lg border z-40 p-6'>
                            <p className='font-semibold mb-3 text-gray-800'>{cat.name}</p>
                            <div className='grid grid-cols-3 md:grid-cols-5 gap-2'>
                                {cat.subCategories.map((sub) => (
                                    <p
                                        key={sub.slug}
                                        onClick={() =>
                                            navigate(`/collection?category=${encodeURIComponent(cat.name)}&subCategory=${encodeURIComponent(sub.name)}`)
                                        }
                                        className='cursor-pointer text-gray-500 hover:text-black'
                                    >
                                        {sub.name}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default CategoryNavbar
