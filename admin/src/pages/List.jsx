import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { apiGet, apiPost } from '../api'
import { currency } from '../App'

const List = ({ token }) => {

  const [list, setList] = useState([])
  const [statusFilter, setStatusFilter] = useState('') // '' | approved | pending | rejected

  const fetchList = async () => {
    try {
      const data = await apiGet(`/api/product/adminlist${statusFilter ? `?status=${statusFilter}` : ''}`)
      if (data.success) setList(data.products)
      else toast.error(data.msg || data.message)
    } catch (error) {
      console.error(error)
      toast.error("Failed to fetch product list")
    }
  }

  useEffect(() => { fetchList() }, [statusFilter])

  const removeproduct = async (id) => {
    try {
      const data = await apiPost('/api/product/removeproduct', { id })
      if (data.success) {
        toast.success(data.message)
        await fetchList()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const updateStatus = async (id, status) => {
    const data = await apiPost('/api/product/status', { id, status })
    if (data.success) {
      toast.success(data.message)
      await fetchList()
    } else toast.error(data.message)
  }

  const updateStock = async (id, size, stock) => {
    const data = await apiPost('/api/product/stock', { id, size, stock })
    if (data.success) {
      toast.success(`${size} stock updated`)
      await fetchList()
    } else toast.error(data.message)
  }

  const totalStock = (item) => (item.sizes || []).reduce((sum, s) => sum + (s.stock || 0), 0)

  return (
    <>
      <div className='flex items-center justify-between mb-2'>
        <p className='font-semibold'>ALL Products List ({list.length})</p>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className='border px-2 py-1 text-sm'>
          <option value=''>All status</option>
          <option value='approved'>Approved</option>
          <option value='pending'>Pending (seller)</option>
          <option value='rejected'>Rejected</option>
        </select>
      </div>

      <div className='flex flex-col gap-2'>
        <div className='hidden md:grid grid-cols-[1fr_3fr_1.5fr_1fr_2fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm'>
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Stock (per size)</b>
          <b>Status</b>
          <b className='text-center'>Action</b>
        </div>

        {list.map((item) => (
          <div
            key={item._id}
            className='grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1.5fr_1fr_2fr_1fr_1fr] items-center py-2 px-2 border text-sm gap-2'
          >
            <img src={item.image?.[0]?.url || item.image?.[0]} alt={item.name} className='w-12 h-12 object-cover' />

            <div>
              <p>{item.name}</p>
              <p className='text-xs text-gray-400'>by {item.sellerName || 'Vrihaa Bazaar'}</p>
            </div>

            <p>{item.category}<span className='text-gray-400'> / {item.subCategory}</span></p>
            <p>{currency}{item.price}</p>

            <div className='flex flex-col gap-1'>
              {(item.sizes || []).map((s) => (
                <div key={s.size} className='flex items-center gap-1'>
                  <span className='w-10'>{s.size}</span>
                  <input
                    type='number'
                    min={0}
                    defaultValue={s.stock}
                    onBlur={(e) => Number(e.target.value) !== s.stock && updateStock(item._id, s.size, e.target.value)}
                    className={`border w-16 px-1 ${s.stock <= 5 ? 'border-red-500 text-red-600' : ''}`}
                  />
                </div>
              ))}
              <p className={`text-xs ${totalStock(item) <= 5 ? 'text-red-600' : 'text-gray-400'}`}>
                total: {totalStock(item)}
              </p>
            </div>

            <div>
              {item.status === 'pending' ? (
                <div className='flex flex-col gap-1'>
                  <button onClick={() => updateStatus(item._id, 'approved')} className='text-green-600 border border-green-600 px-1'>Approve</button>
                  <button onClick={() => updateStatus(item._id, 'rejected')} className='text-red-600 border border-red-600 px-1'>Reject</button>
                </div>
              ) : (
                <p className={item.status === 'approved' ? 'text-green-600' : 'text-red-600'}>{item.status}</p>
              )}
            </div>

            <div onClick={() => removeproduct(item._id)} className='text-center text-red-600 cursor-pointer'>
              Delete
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default List
