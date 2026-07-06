import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
import { toast } from 'react-toastify'
import { BASE_URL, apiPost, apiGet, imgUrl } from '../api'
import { assets } from '../assets/assets'

// Meesho-style third-party seller page:
// 1. register as a seller (goes to admin for approval)
// 2. once approved — login and add products (they appear on the site after admin approves each product)
const BecomeSeller = () => {

  const { navigate, categories, currency } = useContext(ShopContext)

  const [mode, setMode] = useState('register') // register | login | dashboard
  const [sellerToken, setSellerToken] = useState(localStorage.getItem('sellerToken') || '')

  // register / login fields
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [shopName, setShopName] = useState('')
  const [gstNumber, setGstNumber] = useState('')
  const [phone, setPhone] = useState('')

  // dashboard — my products + add product
  const [myProducts, setMyProducts] = useState([])
  const [pName, setPName] = useState('')
  const [pDescription, setPDescription] = useState('')
  const [pPrice, setPPrice] = useState('')
  const [pCategory, setPCategory] = useState('')
  const [pSubCategory, setPSubCategory] = useState('')
  const [pSizes, setPSizes] = useState([])
  const [image1, setImage1] = useState(false)
  const [image2, setImage2] = useState(false)
  const [loading, setLoading] = useState(false)

  const SIZE_PRESETS = ["S", "M", "L", "XL", "XXL", "FREE"]

  useEffect(() => {
    if (sellerToken) {
      setMode('dashboard')
      fetchMyProducts()
    }
  }, [sellerToken])

  useEffect(() => {
    if (categories.length > 0 && !pCategory) {
      setPCategory(categories[0].name)
      setPSubCategory(categories[0].subCategories[0]?.name || '')
    }
  }, [categories])

  const selectedCategory = categories.find(c => c.name === pCategory)

  const fetchMyProducts = async () => {
    const res = await fetch(`${BASE_URL}/api/product/seller/list`, {
      headers: { token: localStorage.getItem('sellerToken') }
    })
    const data = await res.json()
    if (data.success) setMyProducts(data.products)
  }

  const registerSeller = async (e) => {
    e.preventDefault()
    const data = await apiPost('/api/user/seller/register', { name, email, password, shopName, gstNumber, phone })
    if (data.success) {
      toast.success(data.message)
      localStorage.setItem('sellerToken', data.token)
      setSellerToken(data.token)
    } else {
      toast.error(data.message)
    }
  }

  const loginSeller = async (e) => {
    e.preventDefault()
    const data = await apiPost('/api/user/login', { email, password })
    if (data.success && data.role === 'seller') {
      localStorage.setItem('sellerToken', data.token)
      setSellerToken(data.token)
      toast.success("Welcome back, seller!")
    } else if (data.success) {
      toast.error("This account is not a seller account")
    } else {
      toast.error(data.message)
    }
  }

  const sellerLogout = () => {
    localStorage.removeItem('sellerToken')
    setSellerToken('')
    setMode('login')
  }

  const toggleSize = (size) => {
    setPSizes(prev =>
      prev.some(s => s.size === size)
        ? prev.filter(s => s.size !== size)
        : [...prev, { size, stock: 10 }]
    )
  }

  const setStock = (size, stock) => {
    setPSizes(prev => prev.map(s => s.size === size ? { ...s, stock: Number(stock) } : s))
  }

  const addProduct = async (e) => {
    e.preventDefault()
    try {
      if (!image1 && !image2) return toast.error("Upload at least one image")
      if (pSizes.length === 0) return toast.error("Select at least one size")

      setLoading(true)

      const formData = new FormData()
      formData.append('name', pName)
      formData.append('description', pDescription)
      formData.append('price', pPrice)
      formData.append('category', pCategory)
      formData.append('subCategory', pSubCategory)
      formData.append('sizes', JSON.stringify(pSizes))
      formData.append('bestseller', false)
      image1 && formData.append('image1', image1)
      image2 && formData.append('image2', image2)

      const res = await fetch(`${BASE_URL}/api/product/seller/add`, {
        method: 'POST',
        headers: { token: localStorage.getItem('sellerToken') },
        body: formData
      })
      const data = await res.json()

      if (data.success) {
        toast.success(data.msg)
        setPName(''); setPDescription(''); setPPrice(''); setPSizes([])
        setImage1(false); setImage2(false)
        fetchMyProducts()
      } else {
        toast.error(data.msg || data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const statusColor = { approved: 'text-green-600', pending: 'text-yellow-600', rejected: 'text-red-600' }

  // ------------------- DASHBOARD -------------------
  if (mode === 'dashboard') {
    return (
      <div className='border-t pt-10'>
        <div className='flex items-center justify-between'>
          <div className='text-2xl'>
            <Title text1={'SELLER'} text2={'DASHBOARD'} />
          </div>
          <button onClick={sellerLogout} className='text-sm text-gray-500 hover:text-black'>Logout</button>
        </div>

        <p className='text-sm text-gray-500 mb-8'>
          New products go for admin approval before they appear on the site. If adding fails with
          "approved sellers only", your account is still pending approval.
        </p>

        {/* ADD PRODUCT */}
        <form onSubmit={addProduct} className='flex flex-col gap-3 max-w-[500px] mb-14'>
          <p className='font-medium'>Add a new product</p>

          <div className='flex gap-2'>
            {[[image1, setImage1, 's1'], [image2, setImage2, 's2']].map(([img, setImg, id]) => (
              <label key={id} htmlFor={id}>
                <img className='w-20 border' src={!img ? assets.upload_area : URL.createObjectURL(img)} alt="" />
                <input onChange={(e) => setImg(e.target.files[0])} type='file' id={id} hidden />
              </label>
            ))}
          </div>

          <input value={pName} onChange={(e) => setPName(e.target.value)} className='px-3 py-2 border' placeholder='Product name' required />
          <textarea value={pDescription} onChange={(e) => setPDescription(e.target.value)} className='px-3 py-2 border' rows={3} placeholder='Description' required />
          <input value={pPrice} onChange={(e) => setPPrice(e.target.value)} type='number' min={0} className='px-3 py-2 border' placeholder='Price' required />

          <div className='flex gap-3'>
            <select value={pCategory} onChange={(e) => {
              setPCategory(e.target.value)
              const cat = categories.find(c => c.name === e.target.value)
              setPSubCategory(cat?.subCategories[0]?.name || '')
            }} className='px-3 py-2 border w-full'>
              {categories.map(cat => <option key={cat._id} value={cat.name}>{cat.name}</option>)}
            </select>
            <select value={pSubCategory} onChange={(e) => setPSubCategory(e.target.value)} className='px-3 py-2 border w-full'>
              {selectedCategory?.subCategories.map(sub => <option key={sub.slug} value={sub.name}>{sub.name}</option>)}
            </select>
          </div>

          <div className='flex gap-3 flex-wrap'>
            {SIZE_PRESETS.map(s => (
              <div key={s} onClick={() => toggleSize(s)}>
                <p className={`${pSizes.some(x => x.size === s) ? 'bg-pink-100' : 'bg-slate-200'} px-3 py-1 cursor-pointer`}>{s}</p>
              </div>
            ))}
          </div>
          {pSizes.map(s => (
            <div key={s.size} className='flex items-center gap-3 text-sm'>
              <p className='w-12 font-medium'>{s.size}</p>
              <p>Stock:</p>
              <input type='number' min={0} value={s.stock} onChange={(e) => setStock(s.size, e.target.value)} className='border px-2 py-1 w-24' />
            </div>
          ))}

          <button disabled={loading} className='w-44 py-2 text-white bg-black disabled:bg-gray-400'>
            {loading ? '...' : 'SUBMIT FOR APPROVAL'}
          </button>
        </form>

        {/* MY PRODUCTS */}
        <p className='font-medium mb-3'>My products ({myProducts.length})</p>
        <div className='flex flex-col gap-2'>
          {myProducts.map(item => (
            <div key={item._id} className='flex items-center gap-4 border p-2 text-sm'>
              <img className='w-12 h-12 object-cover' src={imgUrl(item.image?.[0])} alt='' />
              <p className='flex-1'>{item.name}</p>
              <p>{currency}{item.price}</p>
              <p className={statusColor[item.status]}>{item.status}</p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ------------------- REGISTER / LOGIN -------------------
  return (
    <div className='border-t pt-10'>
      <div className='text-center text-2xl'>
        <Title text1={'BECOME A'} text2={'SELLER'} />
        <p className='w-3/4 m-auto text-xs sm:text-sm text-gray-500 font-normal'>
          Sell your products to thousands of customers on Vrihaa Bazaar — just like Meesho.
          Register your shop, get approved by our team, and start listing products.
        </p>
      </div>

      <form onSubmit={mode === 'register' ? registerSeller : loginSeller}
        className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-10 gap-4 text-gray-800'>

        <div className='inline-flex items-center gap-2 mb-2'>
          <p className='prata-regular text-3xl'>{mode === 'register' ? 'Seller Sign Up' : 'Seller Login'}</p>
          <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
        </div>

        {mode === 'register' && <>
          <input onChange={(e) => setName(e.target.value)} value={name} type='text' className='w-full px-3 py-2 border border-gray-800' placeholder='Your Name' required />
          <input onChange={(e) => setShopName(e.target.value)} value={shopName} type='text' className='w-full px-3 py-2 border border-gray-800' placeholder='Shop Name' required />
          <input onChange={(e) => setGstNumber(e.target.value)} value={gstNumber} type='text' className='w-full px-3 py-2 border border-gray-800' placeholder='GST Number (optional)' />
          <input onChange={(e) => setPhone(e.target.value)} value={phone} type='text' className='w-full px-3 py-2 border border-gray-800' placeholder='Phone' required />
        </>}

        <input onChange={(e) => setEmail(e.target.value)} value={email} type='email' className='w-full px-3 py-2 border border-gray-800' placeholder='Email' required />
        <input onChange={(e) => setPassword(e.target.value)} value={password} type='password' className='w-full px-3 py-2 border border-gray-800' placeholder='Password' required />

        <div className='w-full flex justify-end text-sm mt-[-8px]'>
          {mode === 'register'
            ? <p onClick={() => setMode('login')} className='cursor-pointer'>Already a seller? Login</p>
            : <p onClick={() => setMode('register')} className='cursor-pointer'>New seller? Register</p>}
        </div>

        <button className='bg-black text-white font-light px-8 py-2 mt-2'>
          {mode === 'register' ? 'Register Shop' : 'Login'}
        </button>
      </form>
    </div>
  )
}

export default BecomeSeller
