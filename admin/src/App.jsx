import React, { useEffect, useState } from 'react'
import Navbar from './component/Navbar'
import Sidebar from './component/Sidebar'

import { Route, Routes, Navigate } from 'react-router-dom'
import Order from './pages/Order'
import Add from './pages/Add'
import List from './pages/List'
import Categories from './pages/Categories'
import Analytics from './pages/Analytics'
import Sellers from './pages/Sellers'
import Login from './component/Login'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export const currency = '₹'

const App = () => {

  const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : '')

  useEffect(() => {
    localStorage.setItem('token', token)
  }, [token])

  return (
    <div className='flex flex-col bg-gray-50 min-h-screen'>
      <ToastContainer />
      {
        token === ""
          ? <Login setToken={setToken} /> :
          <>
            <Navbar setToken={setToken} />
            <hr />
            <div className='flex w-full'>
              <Sidebar />
              <div className='w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base'>
                <Routes>
                  <Route path='/' element={<Navigate to='/analytics' />} />
                  <Route path='/analytics' element={<Analytics token={token} />} />
                  <Route path='/add' element={<Add token={token} />} />
                  <Route path='/list' element={<List token={token} />} />
                  <Route path='/categories' element={<Categories token={token} />} />
                  <Route path='/orders' element={<Order token={token} />} />
                  <Route path='/sellers' element={<Sellers token={token} />} />
                </Routes>
              </div>
            </div>
          </>
      }
    </div>
  )
}

export default App
