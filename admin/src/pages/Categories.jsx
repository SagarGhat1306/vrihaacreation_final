import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { BASE_URL, apiGet, apiPost } from '../api'

const Categories = ({ token }) => {

  const [categories, setCategories] = useState([])
  const [name, setName] = useState('')
  const [subCategories, setSubCategories] = useState('')
  const [image, setImage] = useState(false)
  const [loading, setLoading] = useState(false)

  const fetchCategories = async () => {
    const data = await apiGet('/api/category/all')
    if (data.success) setCategories(data.categories)
    else toast.error(data.message)
  }

  useEffect(() => { fetchCategories() }, [])

  const addCategory = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const formData = new FormData()
      formData.append('name', name)
      formData.append('subCategories', subCategories)
      if (image) formData.append('image', image)

      const res = await fetch(`${BASE_URL}/api/category/add`, {
        method: 'POST',
        headers: { token: localStorage.getItem('token') },
        body: formData,
      })
      const data = await res.json()

      if (data.success) {
        toast.success(data.message)
        setName(''); setSubCategories(''); setImage(false)
        await fetchCategories()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const toggleActive = async (cat) => {
    const data = await apiPost('/api/category/update', {
      id: cat._id,
      isActive: !cat.isActive,
    })
    data.success ? (toast.success(data.message), fetchCategories()) : toast.error(data.message)
  }

  const removeCategory = async (id) => {
    const data = await apiPost('/api/category/remove', { id })
    data.success ? (toast.success(data.message), fetchCategories()) : toast.error(data.message)
  }

  return (
    <div>
      <p className='mb-2 font-semibold'>Create Category (Meesho style)</p>

      <form onSubmit={addCategory} className='flex flex-col gap-3 max-w-[500px] mb-8'>
        <input
          value={name} onChange={(e) => setName(e.target.value)}
          className='px-3 py-2 border' placeholder='Category name e.g. Jewellery & Accessories' required
        />
        <input
          value={subCategories} onChange={(e) => setSubCategories(e.target.value)}
          className='px-3 py-2 border' placeholder='Sub categories, comma separated e.g. Earrings, Rings, Bangles' required
        />
        <input type='file' onChange={(e) => setImage(e.target.files[0])} />
        <button disabled={loading} className='w-40 py-2 text-white bg-black disabled:bg-gray-400'>
          {loading ? '...' : 'ADD CATEGORY'}
        </button>
      </form>

      <p className='mb-2 font-semibold'>All Categories</p>
      <div className='flex flex-col gap-2'>
        <div className='hidden md:grid grid-cols-[2fr_3fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100'>
          <b>Name</b>
          <b>Sub Categories</b>
          <b>Status</b>
          <b className='text-center'>Action</b>
        </div>

        {categories.map((cat) => (
          <div key={cat._id} className='grid grid-cols-[2fr_3fr_1fr_1fr] items-center py-2 px-2 border text-sm gap-2'>
            <p className='font-medium'>{cat.name}</p>
            <p className='text-gray-500'>{cat.subCategories.map(s => s.name).join(', ')}</p>
            <p
              onClick={() => toggleActive(cat)}
              className={`cursor-pointer ${cat.isActive ? 'text-green-600' : 'text-gray-400'}`}
            >
              {cat.isActive ? 'Active' : 'Hidden'}
            </p>
            <div onClick={() => removeCategory(cat._id)} className='text-center text-red-600 cursor-pointer'>
              Delete
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Categories
