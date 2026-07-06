import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { apiPost } from '../api'

const Login = ({ setToken }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

const onSubmitHandler = async (e) => {
  e.preventDefault();

  try {
    const data = await apiPost(
      "/api/user/admin",
      { email, password },
      false // Don't send token while logging in
    );

    if (data.success) {
      setToken(data.token);
      localStorage.setItem("token", data.token);
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    toast.error(error.message);
  }
};  

  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='bg-white shadow-md rounded-lg px-8 py-6 max-w-md w-full'>
        <h1 className='text-2xl font-bold mb-4 text-center'>Vrihaa Bazaar Admin</h1>

        <form onSubmit={onSubmitHandler} className='flex flex-col items-center w-full gap-4 text-gray-800'>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            className='w-full px-3 py-2 border border-gray-800'
            placeholder='Email'
            required
          />

          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type="password"
            className='w-full px-3 py-2 border border-gray-800'
            placeholder='Password'
            required
          />

          <button type="submit" className='bg-black text-white px-8 py-2 mt-4'>
            Login
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
