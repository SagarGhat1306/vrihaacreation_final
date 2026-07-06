import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { apiGet, apiPost } from '../api'

const Sellers = ({ token }) => {

  const [sellers, setSellers] = useState([])

  const fetchSellers = async () => {
    const data = await apiGet('/api/user/sellers')
    if (data.success) setSellers(data.sellers)
    else toast.error(data.message)
  }

  useEffect(() => { fetchSellers() }, [])

  const setStatus = async (sellerId, sellerStatus) => {
    const data = await apiPost('/api/user/seller/status', { sellerId, sellerStatus })
    if (data.success) {
      toast.success(data.message)
      await fetchSellers()
    } else toast.error(data.message)
  }

  const statusColor = {
    pending: 'text-yellow-600',
    approved: 'text-green-600',
    blocked: 'text-red-600',
  }

  return (
    <div>
      <p className='mb-2 font-semibold'>Third-party Sellers ({sellers.length})</p>

      <div className='flex flex-col gap-2'>
        <div className='hidden md:grid grid-cols-[2fr_2fr_1.5fr_1fr_2fr] items-center py-1 px-2 border bg-gray-100 text-sm'>
          <b>Shop</b>
          <b>Email</b>
          <b>Phone / GST</b>
          <b>Status</b>
          <b className='text-center'>Action</b>
        </div>

        {sellers.map((seller) => (
          <div key={seller._id} className='grid md:grid-cols-[2fr_2fr_1.5fr_1fr_2fr] items-center py-2 px-2 border text-sm gap-2'>
            <div>
              <p className='font-medium'>{seller.shopName || seller.name}</p>
              <p className='text-xs text-gray-400'>{seller.name}</p>
            </div>
            <p>{seller.email}</p>
            <div>
              <p>{seller.phone || '-'}</p>
              <p className='text-xs text-gray-400'>{seller.gstNumber || 'no GST'}</p>
            </div>
            <p className={statusColor[seller.sellerStatus] || ''}>{seller.sellerStatus}</p>
            <div className='flex gap-2 justify-center'>
              {seller.sellerStatus !== 'approved' &&
                <button onClick={() => setStatus(seller._id, 'approved')} className='text-green-600 border border-green-600 px-2 py-0.5'>Approve</button>}
              {seller.sellerStatus !== 'blocked' &&
                <button onClick={() => setStatus(seller._id, 'blocked')} className='text-red-600 border border-red-600 px-2 py-0.5'>Block</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Sellers
