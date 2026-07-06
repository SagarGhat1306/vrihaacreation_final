import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { apiGet } from '../api'
import { currency } from '../App'

const Analytics = ({ token }) => {

  // filters
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')
  const [status, setStatus] = useState('')

  const [summary, setSummary] = useState(null)
  const [salesData, setSalesData] = useState([])
  const [topProducts, setTopProducts] = useState([])
  const [categoryData, setCategoryData] = useState([])
  const [statusData, setStatusData] = useState([])
  const [lowStock, setLowStock] = useState([])

  const buildQuery = () => {
    const params = new URLSearchParams()
    if (from) params.append('from', from)
    if (to) params.append('to', to)
    if (paymentMethod) params.append('paymentMethod', paymentMethod)
    if (status) params.append('status', status)
    const qs = params.toString()
    return qs ? `?${qs}` : ''
  }

  const fetchAll = async () => {
    try {
      const qs = buildQuery()
      const [s, sot, tp, sbc, obs, ls] = await Promise.all([
        apiGet(`/api/analytics/summary${qs}`),
        apiGet(`/api/analytics/sales-over-time${qs}`),
        apiGet(`/api/analytics/top-products${qs}`),
        apiGet(`/api/analytics/sales-by-category${qs}`),
        apiGet(`/api/analytics/orders-by-status${qs}`),
        apiGet(`/api/analytics/low-stock`),
      ])

      if (s.success) setSummary(s.summary); else toast.error(s.message)
      if (sot.success) setSalesData(sot.data)
      if (tp.success) setTopProducts(tp.products)
      if (sbc.success) setCategoryData(sbc.data)
      if (obs.success) setStatusData(obs.data)
      if (ls.success) setLowStock(ls.products)
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => { fetchAll() }, [])

  const maxRevenue = Math.max(1, ...salesData.map(d => d.revenue))
  const maxCatRevenue = Math.max(1, ...categoryData.map(d => d.revenue))

  const Card = ({ label, value, alert }) => (
    <div className={`border bg-white px-4 py-3 min-w-[140px] ${alert ? 'border-red-400' : ''}`}>
      <p className='text-xs text-gray-400 uppercase'>{label}</p>
      <p className={`text-xl font-semibold ${alert ? 'text-red-600' : 'text-gray-800'}`}>{value}</p>
    </div>
  )

  return (
    <div className='flex flex-col gap-8'>

      {/* FILTERS */}
      <div className='flex flex-wrap items-end gap-3 border bg-white p-4'>
        <div>
          <p className='text-xs text-gray-400 mb-1'>From</p>
          <input type='date' value={from} onChange={(e) => setFrom(e.target.value)} className='border px-2 py-1 text-sm' />
        </div>
        <div>
          <p className='text-xs text-gray-400 mb-1'>To</p>
          <input type='date' value={to} onChange={(e) => setTo(e.target.value)} className='border px-2 py-1 text-sm' />
        </div>
        <div>
          <p className='text-xs text-gray-400 mb-1'>Payment</p>
          <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className='border px-2 py-1 text-sm'>
            <option value=''>All</option>
            <option value='COD'>COD</option>
            <option value='Razorpay'>Razorpay</option>
          </select>
        </div>
        <div>
          <p className='text-xs text-gray-400 mb-1'>Order status</p>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className='border px-2 py-1 text-sm'>
            <option value=''>All</option>
            <option value='Order Placed'>Order Placed</option>
            <option value='Packing'>Packing</option>
            <option value='Shipped'>Shipped</option>
            <option value='Out for delivery'>Out for delivery</option>
            <option value='Delivered'>Delivered</option>
            <option value='Cancelled'>Cancelled</option>
          </select>
        </div>
        <button onClick={fetchAll} className='bg-black text-white px-6 py-1.5 text-sm'>APPLY</button>
      </div>

      {/* KPI CARDS */}
      {summary && (
        <div className='flex flex-wrap gap-3'>
          <Card label='Revenue' value={`${currency}${summary.totalRevenue.toLocaleString()}`} />
          <Card label='Orders' value={summary.totalOrders} />
          <Card label='Avg order value' value={`${currency}${summary.avgOrderValue}`} />
          <Card label='Units sold' value={summary.unitsSold} />
          <Card label='Paid (online)' value={summary.paidOrders} />
          <Card label='COD orders' value={summary.codOrders} />
          <Card label='Customers' value={summary.totalUsers} />
          <Card label='Live products' value={summary.totalProducts} />
          <Card label='Pending approval' value={summary.pendingProducts} alert={summary.pendingProducts > 0} />
          <Card label='Low stock' value={summary.lowStockProducts} alert={summary.lowStockProducts > 0} />
        </div>
      )}

      {/* SALES OVER TIME — simple bar chart, no chart library needed */}
      <div className='border bg-white p-4'>
        <p className='font-semibold mb-4'>Daily Sales</p>
        {salesData.length === 0 ? <p className='text-sm text-gray-400'>No orders in this range</p> : (
          <div className='flex items-end gap-1 h-40 overflow-x-auto'>
            {salesData.map((d) => (
              <div key={d.day} className='flex flex-col items-center min-w-[34px]' title={`${d.day} — ${currency}${d.revenue} (${d.orders} orders)`}>
                <p className='text-[9px] text-gray-500'>{currency}{d.revenue}</p>
                <div className='w-6 bg-gray-800' style={{ height: `${Math.max(4, (d.revenue / maxRevenue) * 120)}px` }}></div>
                <p className='text-[9px] text-gray-400 rotate-0 mt-1'>{d.day.slice(5)}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>

        {/* TOP PRODUCTS */}
        <div className='border bg-white p-4'>
          <p className='font-semibold mb-3'>Top Selling Products</p>
          {topProducts.length === 0 && <p className='text-sm text-gray-400'>No sales yet</p>}
          <div className='flex flex-col gap-2'>
            {topProducts.map((p, i) => (
              <div key={i} className='flex items-center gap-3 text-sm border-b pb-2'>
                <p className='w-5 text-gray-400'>{i + 1}</p>
                <img className='w-10 h-10 object-cover' src={p.image?.[0]?.url || p.image?.[0]} alt='' />
                <div className='flex-1'>
                  <p>{p.name}</p>
                  <p className='text-xs text-gray-400'>{p.category}</p>
                </div>
                <p className='text-right'>{p.unitsSold} sold<br /><span className='text-gray-400 text-xs'>{currency}{p.revenue}</span></p>
              </div>
            ))}
          </div>
        </div>

        {/* SALES BY CATEGORY */}
        <div className='border bg-white p-4'>
          <p className='font-semibold mb-3'>Revenue by Category</p>
          {categoryData.length === 0 && <p className='text-sm text-gray-400'>No sales yet</p>}
          <div className='flex flex-col gap-2'>
            {categoryData.map((c) => (
              <div key={c.category} className='text-sm'>
                <div className='flex justify-between'>
                  <p>{c.category}</p>
                  <p>{currency}{c.revenue} <span className='text-gray-400 text-xs'>({c.unitsSold} units)</span></p>
                </div>
                <div className='w-full bg-gray-100 h-2'>
                  <div className='bg-gray-800 h-2' style={{ width: `${(c.revenue / maxCatRevenue) * 100}%` }}></div>
                </div>
              </div>
            ))}
          </div>

          <p className='font-semibold mt-6 mb-2'>Orders by Status</p>
          <div className='flex flex-wrap gap-2'>
            {statusData.map((s) => (
              <p key={s.status} className='border px-3 py-1 text-sm'>{s.status}: <b>{s.count}</b></p>
            ))}
          </div>
        </div>
      </div>

      {/* LOW STOCK ALERTS */}
      <div className='border bg-white p-4'>
        <p className='font-semibold mb-3 text-red-600'>Low Stock Alerts (≤ 5 left)</p>
        {lowStock.length === 0 ? <p className='text-sm text-gray-400'>All good — nothing running out</p> : (
          <div className='flex flex-col gap-2'>
            {lowStock.map((p) => (
              <div key={p._id} className='flex items-center gap-3 text-sm border-b pb-2'>
                <img className='w-10 h-10 object-cover' src={p.image?.[0]?.url || p.image?.[0]} alt='' />
                <div className='flex-1'>
                  <p>{p.name}</p>
                  <p className='text-xs text-gray-400'>{p.category} · {p.sellerName}</p>
                </div>
                <div className='flex gap-2'>
                  {p.sizes.filter(s => s.stock <= 5).map(s => (
                    <p key={s.size} className='text-red-600 border border-red-400 px-2'>{s.size}: {s.stock}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}

export default Analytics
