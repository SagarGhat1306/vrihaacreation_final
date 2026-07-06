import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Collection from './pages/Collection'
import Home from './pages/Home'
import About from './pages/About'
import Login from './pages/Login'
import Product from './pages/Product'
import Orders from './pages/Orders'
import PlaceOrder from './pages/PlaceOrder'
import Contact from './pages/Contact'
import Cart from './pages/Cart'
import BecomeSeller from './pages/BecomeSeller'
import Navbar from './components/Navbar'
import CategoryNavbar from './components/CategoryNavbar'
import Footer from './components/Footer'
import SearchBar from './components/SearchBar'
import { ToastContainer } from "react-toastify";

import 'react-toastify/dist/ReactToastify.css'

const App = () => {
  return (
    <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
      <ToastContainer />
      <Navbar />
      <CategoryNavbar />
      <SearchBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/product/:productID" element={<Product />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/placeorder" element={<PlaceOrder />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/become-seller" element={<BecomeSeller />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App
