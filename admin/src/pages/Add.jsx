import React, { useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { toast } from 'react-toastify'
import { apiGet, apiPostForm } from '../api'

const Add = ({ token }) => {

  const [image1, setImage1] = useState(false)
  const [image2, setImage2] = useState(false)
  const [image3, setImage3] = useState(false)
  const [image4, setImage4] = useState(false)

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")

  // categories now come from the database — Meesho style, fully dynamic
  const [categories, setCategories] = useState([])
  const [category, setCategory] = useState("")
  const [subCategory, setsubCategory] = useState("")

  // sizes now carry STOCK per size: [{ size: "M", stock: 20 }]
  const [sizes, setSizes] = useState([])
  const [customSize, setCustomSize] = useState("")

  const [bestseller, setBestseller] = useState(false)
  const [loading, setLoading] = useState(false)

  const SIZE_PRESETS = ["S", "M", "L", "XL", "XXL", "FREE"]

  const fetchCategories = async () => {
    const data = await apiGet('/api/category/list')
    if (data.success) {
      setCategories(data.categories)
      if (data.categories.length > 0) {
        setCategory(data.categories[0].name)
        setsubCategory(data.categories[0].subCategories[0]?.name || "")
      }
    }
  }

  useEffect(() => { fetchCategories() }, [])

  const selectedCategory = categories.find(c => c.name === category)

  const onCategoryChange = (value) => {
    setCategory(value)
    const cat = categories.find(c => c.name === value)
    setsubCategory(cat?.subCategories[0]?.name || "")
  }

  const toggleSize = (size) => {
    setSizes(prev =>
      prev.some(s => s.size === size)
        ? prev.filter(s => s.size !== size)
        : [...prev, { size, stock: 10 }]
    )
  }

  const setStock = (size, stock) => {
    setSizes(prev => prev.map(s => s.size === size ? { ...s, stock: Number(stock) } : s))
  }

  const addCustomSize = () => {
    const s = customSize.trim().toUpperCase()
    if (!s) return
    if (sizes.some(x => x.size === s)) return toast.error("Size already added")
    setSizes(prev => [...prev, { size: s, stock: 10 }])
    setCustomSize("")
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault()

    try {
      if (!image1 && !image2 && !image3 && !image4) {
        return toast.error("Please upload at least one image")
      }
      if (sizes.length === 0) {
        return toast.error("Select at least one size and set its stock")
      }

      setLoading(true)

      const formData = new FormData()
      formData.append("name", name)
      formData.append("description", description)
      formData.append("price", price)
      formData.append("category", category)
      formData.append("subCategory", subCategory)
      formData.append("sizes", JSON.stringify(sizes))
      formData.append("bestseller", bestseller)

      image1 && formData.append("image1", image1)
      image2 && formData.append("image2", image2)
      image3 && formData.append("image3", image3)
      image4 && formData.append("image4", image4)

      const data = await apiPostForm('/api/product/addproduct', formData)

      if (data.success) {
        toast.success(data.msg)

        setName("")
        setDescription("")
        setPrice("")
        setSizes([])
        setBestseller(false)
        setImage1(false)
        setImage2(false)
        setImage3(false)
        setImage4(false)
      } else {
        toast.error(data.msg)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-3'>
      <div>
        <p className='mb-2'>Upload Image</p>
        <div className='flex gap-2'>
          {[
            [image1, setImage1, 'image1'],
            [image2, setImage2, 'image2'],
            [image3, setImage3, 'image3'],
            [image4, setImage4, 'image4'],
          ].map(([img, setImg, id]) => (
            <label key={id} htmlFor={id}>
              <img className='w-20' src={!img ? assets.upload_area : URL.createObjectURL(img)} alt="" />
              <input onChange={(e) => setImg(e.target.files[0])} type='file' id={id} hidden />
            </label>
          ))}
        </div>
      </div>

      <div className='w-full'>
        <p className='mb-2'>Product Name</p>
        <input value={name} onChange={(e) => setName(e.target.value)} className='w-full max-w-[500px] px-3 py-2' type='text' placeholder='type here' required />
      </div>

      <div className='w-full'>
        <p className='mb-2'>Product Description</p>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className='w-full max-w-[500px] px-3 py-2' rows={3} placeholder='write content here' required />
      </div>

      <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>
        <div>
          <p className='mb-2'>Product Category</p>
          <select value={category} onChange={(e) => onCategoryChange(e.target.value)} className='w-full px-3 py-2'>
            {categories.map((cat) => (
              <option key={cat._id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div>
          <p className='mb-2'>Sub Category</p>
          <select value={subCategory} onChange={(e) => setsubCategory(e.target.value)} className='w-full px-3 py-2'>
            {selectedCategory?.subCategories.map((sub) => (
              <option key={sub.slug} value={sub.name}>{sub.name}</option>
            ))}
          </select>
        </div>

        <div>
          <p className='mb-1'>Product Price</p>
          <input value={price} onChange={(e) => setPrice(e.target.value)} className="w-full px-3 py-2 sm:w-[120px]" type="number" min={0} placeholder='10' required />
        </div>
      </div>

      <div>
        <p className='mb-2'>Product Sizes & Stock</p>
        <div className='flex gap-3 flex-wrap'>
          {SIZE_PRESETS.map((s) => (
            <div key={s} onClick={() => toggleSize(s)}>
              <p className={`${sizes.some(x => x.size === s) ? 'bg-pink-100' : 'bg-slate-200'} px-3 py-1 cursor-pointer`}>{s}</p>
            </div>
          ))}
          <div className='flex gap-1'>
            <input value={customSize} onChange={(e) => setCustomSize(e.target.value)} className='w-20 px-2 py-1 border' placeholder='custom' />
            <button type='button' onClick={addCustomSize} className='px-2 bg-slate-200'>+</button>
          </div>
        </div>

        {sizes.length > 0 && (
          <div className='flex flex-col gap-2 mt-3'>
            {sizes.map((s) => (
              <div key={s.size} className='flex items-center gap-3 text-sm'>
                <p className='w-12 font-medium'>{s.size}</p>
                <p>Stock:</p>
                <input
                  type='number'
                  min={0}
                  value={s.stock}
                  onChange={(e) => setStock(s.size, e.target.value)}
                  className='border px-2 py-1 w-24'
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className='flex gap-2 mt-2'>
        <input
          type="checkbox"
          id="bestseller"
          checked={bestseller}
          onChange={() => setBestseller(prev => !prev)}
        />
        <label className='cursor-pointer' htmlFor='bestseller'>Best Seller</label>
      </div>

      <button disabled={loading} type='submit' className='w-28 py-2 px-3 text-white bg-black disabled:bg-gray-400'>
        {loading ? '...' : 'ADD'}
      </button>
    </form>
  )
}

export default Add
