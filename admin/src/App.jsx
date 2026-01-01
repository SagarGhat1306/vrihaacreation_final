import React, { useEffect, useState } from 'react'
import Navbar from './component/Navbar'
import Sidebar from './component/Sidebar'

import { Route, Routes, useSearchParams } from 'react-router-dom'
import Order from './pages/Order'
import Add from './pages/Add'
import List from './pages/List'
import Login from './component/Login'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

export const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'
export const currency = '$'
const App = () => {



const [token , setToken ] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : '')

useEffect(()=>{
  localStorage.setItem('token',token)
},[token])

  return (
    <div className='flex flex-col bg-gray-50 min-h-screen'>
      <ToastContainer />
      {
        token === ""
        ? <Login setToken={setToken} /> :
        <>
       <Navbar setToken= {setToken}/>
       <hr />
       <div className='flex w-full'>
        <Sidebar />
        <div className='w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base'>
          <Routes>
            <Route path = '/add' element={<Add  token={setToken} />}></Route>
            <Route path = '/list' element={<List token={token} />}></Route>
            <Route path = '/orders' element ={<Order token={setToken} />}></Route>
          </Routes>
        </div>
       </div>
      </>
     
      }
      
    </div>
  )
}

export default App
